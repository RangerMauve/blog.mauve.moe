# Hypercore Protocol in React-Native

This guide will go over the steps needed to get Hypercore-Protocol working in Android and iOS apps using nodejs-mobile.
The guide is aimed at developers and is fairly code-heavy, so you'll want to buckle up and get a tab with your favorite [search engine](https://duckduckgo.com/) ready.

## Hypercore-Protocol

The [Hypercore-Protocol](https://hypercore-protocol.org/) team has released a bunch of usefil Node.js libraries for creating and interacting with peer to peer data structures and networking.
Their code is, in my opinion, easy to reuse and mix in different ways to satisfy the constraints of different applications.
The only downside, is that the code is primarily writte in JavaScript using Node.js specific APIs.
This means that while you can easily run the code anywhere where you have Node.js installed, it's really hard to get it running in other environments where that isn't the case.
More specifically, not only do you need the JavaScript portion of Node.js for stuff like networking and cryptography, you also need support for the native binaries for stuff like [sodium-native](https://www.npmjs.com/package/sodium-native) and [utp-native](https://www.npmjs.com/package/utp-native) which use C++ code and Node.js' NAPI bindings.
This poses a bit of a problem for native Android and iOS apps since those usually use compiled code written in Java or Swift.

## Nodejs-mobile

Luckily, this is something that a lot of folks have dealt with in the past, and there's a way to get node.js code to run in Mobile environments via [nodejs-mobile](https://github.com/JaneaSystems/nodejs-mobile).
It works by tweaking the Node.js API so that it can actually run on iOS and Android (by default iOS doesn't support v8 due to it's JIT functionality).
To use it, you can install it into your project, then put your node.js specoific code in the `nodejs-assets/nodejs-project/` folder, which it will then process and embed in your project.
Your node.js code will have access to a new API called `rn_bridge` which you can load via `const bridge = require('rn-bridge')`, and your React-Native code will have a new API called `nodejs` which you can load with `import nodejs from 'nodejs-mobile-react-native'`.

## Project Setup

Before we can work on getting Hypercore set up with your project, you'll need to set some stuff up.

- [Node.js version 12.19.1](https://nodejs.org/en/) for running scripts that build the native libraries (make sure it's 12.19.1!)
- [Node-gyp](https://www.npmjs.com/package/node-gyp) for building native addons
- [React-Native CLI](https://reactnative.dev/docs/environment-setup) (I used v0.66.3)
- For Android:
	- [Android Studio](https://developer.android.com/studio/)
	- Install NDK 21.4 via the SDK manager
	- Set up your ANDROID_HOME variable
	- Set up ANDROID_NDK_HOME environment variable (should be something like $ANDROID_HOME/ndk/21.4.7075529)
- For iOS:
	- XCode
	- `sudo gem install cocoapods`
	- `pod setup`
	- `brew install autoconf automake libtool openssl`

Having some idea of how Android and iOS development works is useful to have, but you can learn as you go if you don't have it yet.

First, we'll modify some config files to make them work better with nodejs-mobile.

Set `metro.config.js` to this:

```javascript
module.exports = {
  // Might help with some edge cases
  // TODO: See if this can be disabled for perf improvements
  resetCache: true,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },
  resolver: {
    // Avoid processing nodejs-mobile assets
    blockList: [
      /\/nodejs-assets\/.*/,
      /\/android\/.*/,
      /\/ios\/.*/
    ]
  }
}
```

Then, we'll need to edit the `package.json`.

In the `scripts` section, after all the other scripts, add a line that looks like this:

```json
"postinstall": "node ./scripts/install_modules.js && node ./scripts/patch_modules.js"
```

This will add the command `npm run postinstall` which will install the native modules and patch the nodejs-mobile libraries.

Next, we'll want to set up a React-Native application:

```
npx react-native init MyApplication
cd MyApplication
```

We'll also want to install [Browserify](https://browserify.org/) which will be used to compile our node.js code into a single file (for performance reasons).

```
npm install --save-dev browserify
```

Then we'll want to install [nodejs-mobile-react-native](https://github.com/nodejs-mobile/nodejs-mobile-react-native).

```
npm install --save nodejs-mobile-react-native
```

This will create the `nodejs-assets/nodejs-project` directory for you.

You'll want to then go into that directory and set up your Node.js code.

```
cd nodejs-assets/nodejs-project/

npm install --save corestore@next hyperswarm@next sodium-native-nodejs-mobile github:rangermauve/utp-native-nodejs-mobile#ios-support

# On MacOS you might want to add the envrionment variable PLATFORM_NAME=iphoneos to get native libraries to compile correctly
PLATFORM_NAME=iphoneos npm install --save corestore@next hyperswarm@next sodium-native-nodejs-mobile github:rangermauve/utp-native-nodejs-mobile#ios-support
```

Note that this is using my fork of utp-native-nodejs-mobile that adds support for iOS.

Finally, we'll want to create a barebones `main.js` file which will act as the entrypoint for our node.js process.

This example will set up a [corestore](https://github.com/hypercore-protocol/corestore-next) for managing storage of many [hypercores](https://github.com/hypercore-protocol/hypercore-next), and rig it up to [hyperswarm](https://github.com/hyperswarm/hyperswarm) for networking.
It will also listen on messages from the frontend to tell it to load a hypercore and start replicating it.

```javascript
const Corestore = require('corestore')
const Hyperswarm = require('hyperswarm')
const Hypercore = require('hypercore')
const bridge = require('rn_bridge')
const {join} = require('path')

const userDataPath = bridge.app.datadir()
const storage = join(userDataPath, 'corestore')

// Monkey patch out the locking in hypercore storage
// For some reason fsctl.lock doesn't seem to want to work
const originalStorage = Hypercore.defaultStorage
Hypercore.defaultStorage = (storage, opts = {}) => {
  return originalStorage(storage, { ...opts, lock: -1 })
}

const corestore = new Corestore(storage)

const swarm = new Hyperswarm()

// Replicate all connections with the corestore
swarm.on('connection', (connection, peerInfo) => {
  connection
    .pipe(corestore.replicate())
    .pipe(connection)

  // Get the public key of the connected peer
  const { publicKey } = peerInfo
  const key = publicKey.toString('hex')
  bridge.channel.send({type: 'connection', key})
})

// Listen to events from the frontend
bridge.channel.on('message', (message) => {
  // Load a hypercore when the frontend tells us to
  if(message.type === 'load') loadCore()
})

// Tell the frontend we're ready!
store.ready().then(() => {
  bridge.channel.send({type: 'ready'})
}, (error) => {
  bridge.channel.send({type: 'error', error})
})

async function loadCore() {
  const core = corestore.get({
    // Specify a name to derive the keys from
    // Using the same name on a device will generate the same key each time
    name: 'example'
  })

  await core.ready()

  // Get the piblic key of the hypercore
  const { publicKey, discoveryKey } = core
  const key = publicKey.toString('hex')

  // Send over the key for the hypercore to the frontend
  bridge.channel.send({
    type: 'key',
    key
  })

  const discovery = swarm.join(discoveryKey, {
    server: true,
    client: false
  })

  // Stop advertising when the core is closed
  core.once('close', () => discovery.destroy())

  // Wait for the discovery to finish before saying we've done a round of lookups
  await discovery.flushed()

  // Tell the frontend we've done a round of scans and are listening on a key
  bridge.channel.send({ type: 'listening', key })
}
```

Sadly, just having this code in place isn't enough, and we'll need to do some monkey-patching and other fancy stuff in order to get everything running in your app.

## Build Scripts

In order to get apps to actually compile and run we'll need to do the following:

- After installing:
  - Patch nodejs-mobile's `build.gradle` file to remove some unnecessary attributes
  - Replace nodejs-mobile's `require` of the EventEmitter library with `import`
- Before nodejs-mobile rebuilds the native dependencies:
  - patch `sodium-native` and `utp-native` to use their `-mobile` counterparts
  - Clear duplicate sodium-native and utp-native modules from the source tree
  - Patch `sodium-native-nodejs-mobile` and `utp-native-nodejs-mobile` to work better with Browserify
- After nodejs-mobile rebuilds the native dependencies
	- Compile all your js code into a `bundle.js` to load in the app
	- **FOR ANDROID**: Copy libsodium's `.a` files over to your `jniLibs` folder
  - Clear all folders from node_modules which aren't needed after the build (all that don't have native dependencies)

To that end, here's some build scripts you can copy-paste into your project and edit as needed

### scripts/constants.js

This contains some useful constants that will get reused between scripts

```javascript
const { join } = require('path')

const ROOT = join(__dirname, '../')

const ANDROID_DIR = join(ROOT, 'android')
const IOS_DIR = join(ROOT, 'ios')

const PROJECT_DIR = process.env.NODEJS_PROJECT_DIR || join(ROOT, 'nodejs-assets/nodejs-project/')
const MODULE_FOLDER = join(PROJECT_DIR, 'node_modules')

const NODEJS_MOBILE_DIR = join(ROOT, 'node_modules/nodejs-mobile-react-native')

module.exports = {
  ANDROID_DIR,
  IOS_DIR,
  PROJECT_DIR,
  NODEJS_MOBILE_DIR,
  MODULE_FOLDER,
  ROOT
}
```

### scripts/install_modules.js

Run this when you want to install modules into your node folder.
Note that if you're trying to build Android on a Macbook, you'll want to add the `--android` flag.
Also note that switching between compiling for iOS and Android will require reinstalling the node modules since they get configured in different ways.

```javascript
#!/usr/bin/env node
const util = require('util')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)

const { PROJECT_DIR } = require('./constants')

const IOS = 'ios'
const ANDROID = 'android'

let platform = (process.platform === 'darwin') ? IOS : ANDROID
if (process.argv.includes('--android')) { platform = ANDROID }
if (process.argv.includes('--ios')) { platform = IOS }

let isSimulator = false
isSimulator = process.argv.includes('--simulator')

const PLATFORM_NAME = ((platform === IOS) && !isSimulator) ? 'iphoneos' : ''

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
// - Run install inside of `nodejs-assets/nodejs-project`
  console.log('Installing nodejs-project dependencies')
  const env = (platform === IOS)
    ? makeEnv({
        PLATFORM_NAME,
      })
    : makeEnv({
    })
  await exec('npm install --no-optional', {
    cwd: PROJECT_DIR,
    env
  })
}

function makeEnv (vars = {}) {
  return { ...process.env, ...vars }
}
```

### scripts/patch_modules.js

This should be run after you run `npm install` in your React-Native project

```javascript
#!/usr/bin/env node
const { readFile, writeFile } = require('fs').promises
const { join } = require('path')

const {
  NODEJS_MOBILE_DIR
} = require('./constants')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  console.log('Patching nodejs-mobile gradle script')
  const NODEJS_MOBILE_GRADLE = join(NODEJS_MOBILE_DIR, 'android/build.gradle')
  const mainSectionMatch = / {8}main {[^}]+}/gm
  const existingGradle = await readFile(NODEJS_MOBILE_GRADLE, 'utf8')
  const patchedGradle = existingGradle.replace(mainSectionMatch, '')
  await writeFile(NODEJS_MOBILE_GRADLE, patchedGradle)

  console.log('Patching nodejs-mobile EventEmitter import')
  const toReplaceRequire = 'var EventEmitter = require(\'react-native/Libraries/vendor/emitter/EventEmitter\');'
  const replaceWithImport = 'import EventEmitter from \'react-native/Libraries/vendor/emitter/EventEmitter\';'

  const NODEJS_MOBILE_INDEX = join(NODEJS_MOBILE_DIR, 'index.js')
  const indexContent = await readFile(NODEJS_MOBILE_INDEX, 'utf8')
  const patchedIndex = indexContent.replace(toReplaceRequire, replaceWithImport)
  await writeFile(NODEJS_MOBILE_INDEX, patchedIndex)
}
```

### scripts/prepare_modules.js

This script will delete duplicate sodium-native and utp-native modules, create fake ones that point at their mobile versions, and patch the originals to change how they load their native bindings.

```javascript
#!/usr/bin/env node
const { rmdir, mkdir, writeFile } = require('fs').promises
const { join } = require('path')

const { PROJECT_DIR, MODULE_FOLDER } = require('./constants')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  // console.log('Deleting .bin dir to fix builds')
  // const BIN_DIR = join(PROJECT_DIR, 'node_modules/.bin')
  // await rm(BIN_DIR, { recursive: true, force: true })

  console.log('Clearing duplicate sodium-native and utp-native modules')
  const DUPLICATE_FOLDERS = [
    // This list might need to be changed to account for your application
    'sodium-universal/node_modules/sodium-native',
    '@hyperswarm/dht/node_modules/utp-native',
    'hyperswarm/node_modules/utp-native'
  ]

  for (const folder of DUPLICATE_FOLDERS) {
    const location = join(MODULE_FOLDER, folder)
    console.log('Clearing', location)
    await rmdir(location, { recursive: true, force: true })
  }

  const SODIUM_NATIVE_DIR = join(PROJECT_DIR, 'node_modules/sodium-native')
  console.log('Clearing existing sodium-native package')
  await rmdir(SODIUM_NATIVE_DIR, { recursive: true, force: true })

  console.log('Clearing sodium-native-nodejs-mobile build')
  const SODIUM_NATIVE_MOBILE_DIR = join(MODULE_FOLDER, 'sodium-native-nodejs-mobile')
  await rmdir(join(SODIUM_NATIVE_MOBILE_DIR, 'build'), { recursive: true, force: true })

  console.log('Creating fake sodium-native package')
  await mkdir(SODIUM_NATIVE_DIR, { recursive: true, force: true })
  await writeFile(
    join(SODIUM_NATIVE_DIR, 'package.json'),
    JSON.stringify({
      name: 'sodium-native',
      main: 'index.js',
      // Technically the version is 3.2.0, but that is just a change to builds, not API
      version: '3.3.0'
    })
  )
  await writeFile(
    join(SODIUM_NATIVE_DIR, 'index.js'),
    'module.exports = require(\'sodium-native-nodejs-mobile\')\n'
  )

  const UTP_NATIVE_DIR = join(PROJECT_DIR, 'node_modules/utp-native')
  console.log('Clearing existing utp-native package')
  await rmdir(UTP_NATIVE_DIR, { recursive: true, force: true })

  console.log('Creating fake utp-native package')
  await mkdir(UTP_NATIVE_DIR, { recursive: true, force: true })
  await writeFile(
    join(UTP_NATIVE_DIR, 'package.json'),
    JSON.stringify({ name: 'utp-native', main: 'index.js', version: '2.3.5' })
  )
  await writeFile(
    join(UTP_NATIVE_DIR, 'index.js'),
    'module.exports = require(\'utp-native-nodejs-mobile\')\n'
  )

  console.log('Patch imports for sodium and utp mobile')
  const SODIUM_INDEX = join(PROJECT_DIR, 'node_modules/sodium-native-nodejs-mobile/index.js')
  await writeFile(SODIUM_INDEX, `
var path = require('path')
var requirePath = path.join(__dirname, 'build/Release/sodium.node')
var sodium = require(requirePath)

module.exports = sodium;
`)

  const UTP_BINDING = join(PROJECT_DIR, 'node_modules/utp-native-nodejs-mobile/lib/binding.js')
  await writeFile(UTP_BINDING, `
var path = require('path')

module.exports = require('bindings')({
  bindings: 'utp_native.node',
  name: 'utp-native-nodejs-mobile',
  module_root: path.join(__dirname, '../')
})
`)
}
```

### scripts/build_bundle.js

This uses Browserify to compile the node.js code into a single `bundle.js` file

```javascript
#!/usr/bin/env node
const browserify = require('browserify')
const { createWriteStream } = require('fs')
const { join } = require('path')

const { PROJECT_DIR } = require('./constants')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  const entry = join(PROJECT_DIR, 'main.js')
  const output = join(PROJECT_DIR, 'bundle.js')
  console.log(`Compiling bundle from ${entry} to ${output}`)
  const build = browserify(entry, {
    basedir: PROJECT_DIR,
    ignoreMissing: true,
    node: true
  })

  const progress = build.bundle().pipe(createWriteStream(output))

  await new Promise((resolve, reject) => {
    progress.once('error', reject)
    progress.once('close', resolve)
  })

  console.log('Built')
}
```

### scripts/copy_jni_libs.js

This will copy the libsodium files to the jniLibs folder on Android
You might want to adjust this if you have more native libraries that require this.

```javascript
#!/usr/bin/env node
const { mkdir, copyFile } = require('fs').promises
const { join } = require('path')

const { MODULE_FOLDER, ANDROID_DIR } = require('./constants')

const SODIUM_NATIVE_FOLDER = join(MODULE_FOLDER, 'sodium-native-nodejs-mobile')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  // - Copy over sodium files into `android/app/src/main/`
  console.log('Copying native files to android jni')
  const SODIUM_LIBS = join(SODIUM_NATIVE_FOLDER, 'lib/')
  const JNI_FOLDER = join(ANDROID_DIR, 'app/src/main/jniLibs/')

  // Map from nodejs folder name to Android folder name
  const ABI_FOLDER_MAP = {
    'android-arm': 'armeabi-v7a',
    'android-arm64': 'arm64-v8a'
  }

  const SODIUM_LIB_FILE = 'libsodium.so'

  for (const [nodeName, androidName] of Object.entries(ABI_FOLDER_MAP)) {
    const nodeFolder = join(SODIUM_LIBS, nodeName)
    const androidFolder = join(JNI_FOLDER, androidName)
    await mkdir(androidFolder, { recursive: true })
    await copyFile(
      join(nodeFolder, SODIUM_LIB_FILE),
      join(androidFolder, SODIUM_LIB_FILE)
    )
  }
}
```

### scripts/clear_modules.js

Use this to clear unnecessary modules and reduce the app's size

```javascript
#!/usr/bin/env node
const { rmdir, readdir } = require('fs').promises
const { join } = require('path')

const { MODULE_FOLDER } = require('./constants')

const SODIUM_NATIVE_FOLDER = join(MODULE_FOLDER, 'sodium-native-nodejs-mobile')

run().catch((e) => {
  process.nextTick(() => {
    throw e
  })
})

async function run () {
  console.log('Deleting unnecessary modules and build-specific files')
  const TO_PRESERVE = [
    // You may need to adjust this to preserve other native modules
    'sodium-native-nodejs-mobile',
    'utp-native-nodejs-mobile',
    'sodium-native',
    'utp-native',
    'fd-lock',
    'fsctl',
    'crc32-universal'
  ]

  const moduleNames = await readdir(MODULE_FOLDER)
  const nonEssentialModules = moduleNames.filter((name) => !TO_PRESERVE.includes(name))

  const toDelete = [
    join(SODIUM_NATIVE_FOLDER, 'libsodium'),
    join(SODIUM_NATIVE_FOLDER, 'lib'),
    ...nonEssentialModules.map((name) => join(MODULE_FOLDER, name))
  ]

  for (const folder of toDelete) {
    await rmdir(folder, {
      recursive: true,
      force: true
    })
  }
}
```

## Android - Gradle

With these scripts in place, we can start integrating them into the Android build process.

Android uses a build system called [Gradle](https://gradle.org/) which uses a programming language called [Groovy](https://groovy-lang.org/) to define it's builds combined with a sytem for creating a "graph" of tasks and their dependencies.

By default, react-native will have generated some gradle files in the `android` folder, and nodejs-mobile will have hooked some build steps into this process as part of that.

Before we integrate the build scripts, we'll want to modify our configuration in order to enable the build.

Open up `android/app/build.gradle`, which is the file that defines how your application should be configured and compiled.

Where you see the `defaultConfig {`, and after the line that contains `versionName "1.0"`, add a block that looks like the following:

```
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a" // , "x86", "x86_64"
        }
```

This will tell Gradle that you wish to compile native libraries to arm platforms (add more here if you need to support x86 devices and the such).

Next, find the block that says `splits {` and change the line that says `include:` to the following:

```
            include "armeabi-v7a", "arm64-v8a"
```

This will exclude the "desktop" CPU architectures since we aren't targeting them anyway.

Next, find the block that says `buildTypes {`.
Change the line that says `abiFilters` to the following:

```
                    abiFilters "armeabi-v7a", "arm64-v8a"
```

Next, find the part that says `applicationVariants.all { variant ->`.

Change the line that says `versionCodes =` to the following:

```
            def versionCodes = ["armeabi-v7a": 1, "arm64-v8a": 2] //  "x86": 2, , "x86_64": 4]
```

This will again disable the unneccesary architectures.

So with that in mind, here's some code that will define tasks from our build scripts, and wire them up into the build system.

Add this near the end of the file, just before the `apply from: file("../../` line which will apply the react-native code.

```
task patchNodeModules (type:Exec) {
  commandLine "node", "${rootProject.buildDir}/../../scripts/prepare_modules.js"
}

// This makes sure patchin runs right when the build starts
preBuild.dependsOn patchNodeModules

task generateBundleJS (type: Exec) {
  workingDir "${rootProject.buildDir}/nodejs-assets/nodejs-project/"
  // nodejs-mobile copies our assets to a `build` folder
  // We want to run this script within that folder rather than the source tree
  environment NODEJS_PROJECT_DIR: "${rootProject.buildDir}/nodejs-assets/nodejs-project/"
  commandLine "node", "${rootProject.buildDir}/../../scripts/build_bundle.js"
}

task copyJNILibs(type: Exec) {
  // Notice how this says "generateBundleJS" should run before copyJNILibs
  dependsOn generateBundleJS
  environment NODEJS_PROJECT_DIR: "${rootProject.buildDir}/nodejs-assets/nodejs-project/"
  commandLine "node", "${rootProject.buildDir}/../../scripts/copy_jni_libs.js"
}

task clearModules(type: Exec) {
  dependsOn copyJNILibs
  workingDir "${rootProject.buildDir}/nodejs-assets/nodejs-project/"
  environment NODEJS_PROJECT_DIR: "${rootProject.buildDir}/nodejs-assets/nodejs-project/"
  commandLine "node", "${rootProject.buildDir}/../../scripts/clear_modules.js"
}

// By saying `clearModules` should be run at the end of `CopyNodeProjectAssetsFolder`
// We attach our chain of build scripts to run just before the files get finalized into the APK
tasks.getByPath(':nodejs-mobile-react-native:CopyNodeProjectAssetsFolder').finalizedBy clearModules
```

With this in place our scripts will execute at the correct time and create an APK which contains just the code we want for our nodejs side.

One note about the build process, you may want to edit `android/gradle.properties` and replace the line `Xmx2048m` to `Xmx2048m` which will increase the amount of ram that's used to compile the APK (else it might run out of memory).

Lastly, when running the app on Android, make sure to use the Release build rather than the Debug build.
I'm not sure what was causing the debug build to fail, but I've found this helps a lot.

## iOS - XCode

Before we jump into running the scripts on iOS, we'll want to install the pods.

```
cd ios
pod install
cd ../
```

This will install the required dependencies into the project.

XCode uses a concept called [build phases](https://help.apple.com/xcode/mac/10.2/#/dev50bab713d) which are kind of like a more linear alternative to Gradle's "tasks".

nodejs-mobile will actually insert some build phases into your project when you run it that look like `[CP-User] [NODEJS MOBILE] Some description`

We'll want to run our `prepare_modules.js` script after the `[CP-User] [NODEJS MOBILE] Copy Node.js Project files` build phase so that we can prepare the modules before they get compiled.

Call it `Prepare Node Modules` and have it look something like this:

```bash
# Delete unnecessary node modules and patch dependencies before native build

# Tell the scripts which folder to perform this action in
export NODEJS_PROJECT_DIR=$CODESIGNING_FOLDER_PATH/nodejs-project/

# This is optional for when you're using NVM, so that the correct `.bin` gets used
export PATH=$PATH:$HOME/.nvm/versions/node/v12.19.1/bin

# Run the script from the project root
node $PROJECT_DIR/../scripts/prepare_modules.js
```

After this, there will be a phase called `[CP-User] [NODEJS MOBILE] Build Native Modules` which will compile the native libraries.

After this phase we'll add a new Phase called `Build bundle.js` which will compile the bundle

```bash
# Tell the scripts which folder to perform this action in
export NODEJS_PROJECT_DIR=$CODESIGNING_FOLDER_PATH/nodejs-project/

# This is optional for when you're using NVM, so that the correct `.bin` gets used
export PATH=$PATH:$HOME/.nvm/versions/node/v12.19.1/bin

# Run the script from the project root
node $PROJECT_DIR/../scripts/build_bundle.js
```

After this we'll add a phase to clear out any unnecessary node_modules with our `clear_modules.js` script

```bash
# Delete all node modules that don't contain native dependencies
# Tell the scripts which folder to perform this action in
export NODEJS_PROJECT_DIR=$CODESIGNING_FOLDER_PATH/nodejs-project/

# This is optional for when you're using NVM, so that the correct `.bin` gets used
export PATH=$PATH:$HOME/.nvm/versions/node/v12.19.1/bin

# Run the script from the project root
node $PROJECT_DIR/../scripts/clear_modules.js
```

With this in place, when you run xcode to compile the app, it'll automatically run our build scripts in order to prepare the modules to work on your device.

## React-Native

Now that we have the backend figured out, we'll look at some examples for setting up your frontend.

In your `App.js`, import `useEffect` and `useState` from React.
Also, import nodejs-mobile with the following line.

```javascript
import nodejs from 'nodejs-mobile-react-native'
```

Inside the top level of your `App` component have some code that looks like this:

```javascript
  useEffect(() => {
    // Tells nodejs-mobile to load our `bundle.js` code
    nodejs.start('bundle.js')
    // Listen to messages from the nodejs-mobile side and log them
    nodejs.channel.addListener('message', (msg) => {
      console.log('From node: ', msg)
    })
  })

  // Send a message to the bridge to load the app
  async function loadCore () {
    nodejs.channel.send({
      type: 'load'
    })
  }
```

Then somewhere in your render tree, add a button that looks something like this:

```javascript
<Button title='Load Core' onPress={loadCore} />
```

When pressed, this will send an event over to the backend and trigger the core to actually load.

You may want to wait for the nodejs side to send over the `ready` event and showing some sort of loading screen.
Or even wait to start loading your hypercore stuff intil the React-Native side sends a message saying to do so (useful for configuration and the such).

## Debugging Tips

iOS simulators won't work since they require compiling the native modules to whatever architecture your mac is running rather than emulating an actual iphone. Sadly you'll need to run your app on a physical device, unless you're willing to put in the time to get the modules to compile for the `iossimulator` PLATFORM_NAME.

Make sure you're using the correct version of node.js, the NDK, xcode, react-native, whatever.

Also make sure all your necessary environment variables are set like `ANDROID_NDK_HOME`.

Try deleting `nodejs-assets/nodejs-project/node_modules` and run `./scripts/install_modules` again.

Make sure you're using the `install_modules.js` script with the correct flags for the operating system you're trying to run.

On Android, try deleting `android/app/build/` to clear out the cached code.

Try running the app from within Android Studio or XCode.

Put `console.trace` calls everywhere to see where stuff is going wrong.

## Done!

Huge thanks to the [Telios](https://www.telios.io/) team for sponsoring this work.
You can check out their [mobile app](https://github.com/RangerMauve/telios-mobile/) to see this stuff in action.

Hopefully with this in place, you'll be able to get hypercore running within your own mobile app and create some interesting [local-first apps](https://www.inkandswitch.com/local-first/)!

If you're interested in getting this to run in your project and don't have the in-house experience, consider reaching out to [Mauve Software Inc.](https://software.mauve.moe/) for a short term contract to get you on your feet.
