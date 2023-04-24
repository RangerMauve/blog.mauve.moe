# A Node ESM loader for the Web and P2P

## The state of EcmaScript Modules

There's been a lot of buzz about the new EcmaScript Module specification that's landed in JavaScript a while ago.

Originally, it was only used by tools like Babel to bring new syntax for describing modules and how they can be bundled together.

Recently, [browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) have started supporting the spec natively. This means that people can make applications _today_ that make use of a first-class module system in JavaScript, without having to have a build step!

What's also exciting is that Node.js now also has support for these modules behind an [experimental flag](https://nodejs.org/api/esm.html).

## There's a catch!

Even though we have this cool new language feature, transitioning to it is going to be hard.

- Node.js only supports ESM modules with files that have a `.mjs` file extension (which doesn't make sense on the web)
- People are still trying to make use of modules geared towards Node and CommonJS which won't work without a build step on the web
- Node.js only supports loading modules through the `file:` protocol. This means you can't load a module through `https` like you would on the web.
- Even if you make a module using ESM that could be imported on both platforms, Node.js lacks most of the APIs that exist in the browser which means people need Node-specific modules for them
- Setting up build tools to get this stuff to work in Browsers is complex (why should we have to?)
- Modules published on NPM can't be `import`ed on the web, they have to be processed by build tools.

## Prior work

The current project that's leading the way in making ESM nice to use in Node is the aptly named [esm](https://github.com/standard-things/esm) module.

It parses your code and makes it so you can import and export modules using the new syntax. This is a step above what Node does by default and lets you configure the behavior without having to set up complex build tools.

However, I believe that it doesn't focus enough on bringing the web into Node and is mostly useful if you're focused on reusing your existing Node-specific code.

As well, it does a lot more than just plug into the ESM module loader and does a bunch of parsing and transpiling to make things work.

## My approach

What I want is for people to be able to make modules that work in both Node and the browser.

Peope have mostly been approaching this from the side of Node, trying to get Node modules to run in browsers by specifying globals and using build tools.

What I propose is to go the other direction: Make browser-first modules, and modify Node to be able to run them.

To acheive this I propose the following:

- Make most JS modules loadable in (modern, evergreen) browsers without complex build tools
- Allow Node.js to load modules through HTTPS
- Provide essential APIs like `fetch` and `Websocket` in Node
- Ditch legacy support for Node modules in favor of modern JS and browsers

With these goals in mind, I've created [@rangermauve/web-loader](https://www.npmjs.com/package/@rangermauve/web-loader).

It works by using the new [loader hooks](https://nodejs.org/api/esm.html#esm_loader_hooks) in Node.js to intercept `import` calls.

When it encounters an `https://` or `dat://` URL, it will download the relevant file to a temporary folder, and tell node to load it.

This allows you to import any module you want from a web server and cache it locally to prevent unncessary network traversal.

This also means that you can start using modules without having to have centralized registries.

In addition to this, I've added some globals to Node which allow you to use modules geared for HTTP requests and websockets without having to use node-specific APIs

This means you can write your code as though it was in the browser (or an environment like React-Native) and have it `Just Work™` in all environments.

## Peer to Peer / Decentralization

Lately, I've been really into the P2P web scene. My favorite protocol at the moment is [Dat](https://datproject.org/) which models it's data as a versioned filesystem which you can share with people using a secret URL while distributing the load across the network.

This protocol is currently only available in Node.js and the [Beaker Browser](https://beakerbrowser.com/).

In addition to being able to share files, you can update them (unlike BitTorrent) and have those changes propogate to peers. In addition, there is a version history for every change made, this makes it easy for people to view older versions of files without having to worry about them being changed or corrupted.

These properties are ideal for distributing code: Only owners of the private key that created an archive can add changes, you can easily checkout older versions or pin your import to a specific version, and anybody can create a Dat archive to share which avoids name conflicts.

As such, I've added support for `import`ing `dat://` URLs, and have added the [DatArchive](dat://beakerbrowser.com/docs/apis/dat.html) global which is used for accessing and creating Dat archives in Beaker.

As with `https://` imports, this is cached to disk in order to avoid unncessary network trips. A benefit here is that modules are fetched from a p2p network, and adding different ways to seed your data doesn't change how it's imported (unlike registries).

At the moment it doesn't bother to re-seed the content, but that might be addressed in a future version.

If any distributed web folks are interested in seeing their favorite protocols integrated in the loader, feel free to send a PR or raise an issue talking about your use case.

## What to do with it

I suggest people start making browser-first, or ESM-first modules and start thinking about alternatives to loading them compared to what we've been doing in Node with NPM.

Instead of setting up crazy build tools, try using the existing infrastructure in the web platform, or start publishing ESM modules that provide better interfaces to it.

I've recently been working on some small side projects using modern JS code, and it feels so refreshing to not have to set up webpack configs and huge `node_module` folders.

I want to bring that same experience when developing scripts with Node.

Try it out, and feel free to send feedback on [Twitter](https://mobile.twitter.com/RangerMauve) or raise issues on [Github](https://github.com/RangerMauve/node-web-loader/issues)

Thank you,

- `RangerMauve`


