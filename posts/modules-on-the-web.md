# Modules On The Web

Here's some thoughts I've had about how ESM can be used for a healthy module ecosystem on the web, and the p2p web.

## Background

For those not in the know, JavaScript has had a cool spec for a few years now called [EcmaScript Modules](http://2ality.com/2014/09/es6-modules-final.html), or ESM.

This defines new syntax, `import` and `export`, as well as a spec for how content should be resolved and loaded.

The short story is that you can do the following:

In `mylibrary.js`

```javascript
class SomeLibrary {
  static doAwesomeThing() {
    console.log('Wow so cool!');
  }
}

// This is how you can "export" a value that can be `import`ed
export default SomeLibrary
```

And in `myapplication.js`

```javascript
// Load the default export from the library into the `SomeLibrary` variable
import SomeLibrary from 'https://example.com/mylibrary.js'

// Use the library in your application
document.body.onclick = () => SomeLibrary.doAwesomeThing()
```

---

This new syntax is [supported in all major browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility), and has basic support in [Node.js](https://nodejs.org/api/esm.html). For more details on how the Node.js support is going, check out my [blog post about it](https://rangermauve.hashbase.io/posts/esm-with-node-vm).

That's great news because now we can have modules in our applications without needing extra build tools!
This also means that including third party libraries doesn't depend on a bunch of global variables barely being able to coordinate with each other.

Publishing modules with ESM is as simple as hosting the files on a webserver.

What this doesn't mean is that we have an alternative to npm. Since anybody can host the files for their modules, there's no central registry for it (yet), and there's no standard way to version files.

## CommonJS

Modern JavaScript development relies heavily on Node.js and the [npm](https://www.npmjs.com/) module registry.

The core of npm and node modules rely on a spec called `CommonJS` and a manifest called `package.json`.

These specs combined with npm have made JavaScript explode with thousands of modules being created and downloaded all the time.

This has enabled JavaScript developers to create awesome applications and libraries for web servers, command line tools, and ever browser applications.

The downside is that `ESM` is fundamentally different from `CommonJS` and the two can't easily interact.

## Using ESM with npm

Although `CommonJS` doesn't work with `ESM`, npm can still sort of be used.

This is thanks to tools like [unpkg](https://unpkg.com/) that let you use code like this:

```javascript
import SomeLibrary from 'https://unpkg.com/somelibrary@4.2.0/index.js'

document.body.onclick = () => SomeLibrary.doAwesomeThing()
```

What `unkpg` does, is it downloads the package at the version you specified, finds the file you're referencing, and returns that in an HTTP response.

This lets you load modules that use ESM that are published on npm, and solves the issue of versioning since you can use a [semver](https://semver.org/) version to allow for automatic updates for patches.

This doesn't work for Node.js because it's ESM support doesn't support `https` URLs. Again, see my [older blog posts](https://rangermauve.hashbase.io/posts/node-loader-for-web-and-p2p) about the matter.

TL;DR, use [Webrun](https://github.com/RangerMauve/webrun) instead. 😛

## Browser roadmap

When ESM was being developed, one of the rquirements was that each "identifier" string for importing must be a valid URL. That's either a relative URL starting with `/example.js` or `./example.js`, or a full URL with the protocol like `https://example.com/example.js`.
This means that ESM doesn't support something like `import React from "react"`.

Browser vendors are working on a spec called [package name maps](https://github.com/domenic/package-name-maps).

The gist is that an HTML page can add a script tag with `type="packagemap"`, which contains some JSON that maps these raw identifiers to URLs where the actual module code will live.

This allows developers to use `import "marked"` in their code, and let build tools figure out what URL that should actually resolve to.

It enables the npm-centric workflow we're used to, but it adds complexity and adds the requirement of maintaining this mapping.

It also has the limitation that the top-level application author must be the one to specify the package map, any dependencies that are being `import`ed cannot specify their own package maps (yet?).

Given the higher complexity, it seems that this has been a dealbreaker for [deno](https://github.com/denoland/deno/issues/8).

## Peer to Peer Web (Dat/Beaker)

As many will know, I'm pretty obsessed with [Dat](https://datproject.org/) and the ideas behind the peer to peer web.

The gist of it is that you can create a `Dat Archive` which is a (versioned) filesystem that only the creator can write to, but anybody can read from if they have the `dat://` URL.

For example, my blog is at [dat://0a9e202b8055721bd2bc93b3c9bbc03efdbda9cfee91f01a123fdeaadeba303e/](dat://0a9e202b8055721bd2bc93b3c9bbc03efdbda9cfee91f01a123fdeaadeba303e/) and you can look at all the files in it using [Beaker](beaker://library/dat://0a9e202b8055721bd2bc93b3c9bbc03efdbda9cfee91f01a123fdeaadeba303e/).

Since Dat is peer to peer, it also has the benefit of being offline-first. So if you don't have a connection to the internet, it will try to load content from it's local cache, or try to find peers on the local (wifi/LAN) network.

That means that a person can publish their ESM modules to a `dat://` URL, and use the `import` syntax to load them into Beaker!

Since `dat` allows you to include a version in the URL, you can safely pin a given dependency to a specific version and know that there's no way that version can refer to different content in the future.

Dat is fully peer to peer, so if you're publishing a module, anybody that's downloaded your module's code will be contributing to re-sharing it's contents.

When a module gets more popular, it's network grows and the original publisher needs fewer and fewer resources to ensure peopel can get at it.

I've got [a few modules](dat://da03b54ff070571e65e41766544e0924ca1212b212d881542fd1abcebb9593bb/) that are dat-first, and it's been working out so far.

The Dat community doesn't have anything like npm for sharing modules on the web yet. So if you want to load a module from `dat://`, you'll need to somehow discover it first.

The versioning provided by Dat also works differently than semantic versioning. Instead of a version string like `6.6.6`, versions are an integer which starts at `0` and goes up by one every time a file is added/updated/removed in the archive.

At the moment my goal has been to post all my reusable modules within a single archive, and people can import just the ones they want, and easily discover the other stuff I've published.

This has been working for me, but I could see it getting difficult to manage large dependency trees, and manually figuring out and updating dat versions is a pain.

## Prior art: dat-npm

About a year ago, @mafintosh created [dat-npm](https://github.com/mafintosh/dat-npm) which is a mirror of the npm registry that's stored within a dat archive.

I'm not sure how far this has gotten, and I kinda lost the twitter thread where it was announced, but feel free to look into it further. 😛

## Dat Mounts

A few mounts ago, @pfrazee created a [discussion](https://github.com/datprotocol/DEPs/issues/32) to talk about "mounts" in dat archives.

The gist of it is that you could have something similar to [Symbolic Links](https://en.wikipedia.org/wiki/Symbolic_link) in a dat archive which would let you redirect certain paths to a given URL.

This opens up some possabilities.

### Use case 1: Module Registries

As mentioned before, npm has been crucial in the growth of the JavaScript community in that it helps developers discover and load tools and libraries, and makes it easy to use specific versions of a given dependency.

One could easily create the same concepts with mounts.

A centralized (or one of many) service can exist which allows people to claim names in the registry which are added under a folder to a dat archive using mounts.

If I have a library at `dat://example.com/mycoollibary/mycoolibrary.js`, I could ask the registry to mount that path at `dat://registry.example.com/myoollibrary`.

From there, registries can build up search indexes and users can have a standard way of looking up and installing depdencies.

This doesn't address versioning, however.

### Use case 2: Versioning

This one is a little crazier. What if instead of relying on the version of a dat archive when refering to versions, you could use a semantic versioning string.

This can be done with a tool that takes a version string, then generates folders for matching it.

For example, given the version `6.9.13`, the tool could create mounts at the following locations:

```
/versions/x.x.x/
/versions/6.x.x/
/versions/6.9.x/
/versions/6.9.13/
```

This approach makes it easy to say "I want anything at version 6", or "I want patches for version 6.9" in addition to getting the latest or tagged version.

If this was turned into a standard, it would be easy enough for people to get into the habit of including versions when importing something.

It'd also work well enough with the non-p2p web as HTTPS servers could use HTTP redirects to direct to the specific version that should be loaded by the browser.

Updating versions would mean going to each file that imports a given dependency and updating the version, which could be a pain, but would also push people to structure their code differently so there's fewer points for dependencies to be integrated.

## What about the HTTP web?

The JavaScript ecosystem has been rooted pretty strongly in small modules posted on npm combined with build tools into bundles.

This new ESM/Filesystem-first approach would pretty much throw all of that out the window.

Personally, I think that's a good thing. Modern browsers provide a lot of high level iterfaces as it is, and this could encourage people to start relying on smaller depdency trees.

People, especially application developers, should aim for focused libraries that use modern JavaScript / Web APIs in order to reduce the amount of utility code necessary.

The Dat-based versioning I mentioned could still apply to similar schemes over HTTPS urls. If npm decided to create a canonical alternative to unpkg, we could get rid of the cli entirely.

## IPFS / IPNS

Pretty much everything that I've said for Dat translates more or less to IPFS. The main difference is that IPFS doesn't handle versioning, though that can be overcome by keeping track of all the hashes for the versions somewhere in the code repository (through IPNS?).

## Vendoring using tooling

Of course, in addition to doing fancy things with URLs, you can using tooling to help with versions.

Inspired by the vendoring suggestion in [this comment](https://github.com/denoland/deno/issues/195#issuecomment-395765429), one could use the following approaches.

I'm personally not the biggest fan of having additional tooling, since I'd rather use what's baked into the platform and use file paths / protocols as a core building block.

### Download everything locally!

One of the benefits of the `import` syntax is that it's very easy to statically process the entire dependency tree and figure out what needs to be downloaded without actually executing anything.

This would make it easy to make a tool that statically analyzes imports, downloads dependencies locally, and rewrites the URLs to import from the local domain.

For example, if I wanted to use `https://example.com/visalizer.js`, which in turn had a bunch of dependencies, the tool could download it, and all it's dependencies to a `/vendor/` folder, which I could then import from in my main application.

This has the advantage of giving you full control over the code, and knowing that it will never update unless you want it to.

This is similar to what the npm cli does at the moment, only it doesn't need to do any rewriting because node supports this use case.

The main disadvantage to this approach (on the web) is that you'd lose the de-duplication across domains. If Two websites both rely on the same version of `React.js`, why should the browser download it twice?

### Have a file for import/exports

A big pain point with ESM, is that importing a file from multiple files in your project make it annoying to update the version.

You'd need to go through all the files and update the URL.

What if you could have one place that needed to be updated?

That's the approach suggested in this [post](https://github.com/denoland/deno/issues/195#issuecomment-395765429) by @janpot.

Essentially, for each library you're importing, you can have a file in `/vendor/` which will export all the contents of a url using the `export * from "url"` syntax.

This means that you could create `/vendor/react.js` which would contain `export * from "https://example.com/react/4.2.0/react.js"`. In your code you can then use `import React from "/vendor/React.js"`.

With this approach you have more freedom with updating versions, and it could feasibly be done by hand.

Dependencies of your dependencies wouldn't be under your control, however. So you'll need to trust that they have their versions pinned using an intelligent algorithm.

Plus you still have to worry about the source going offline or serving unexpected content.

## Is importing from a URL even OK?

There's been some debate, specifically in the [deno community](https://github.com/denoland/deno/issues/195#issuecomment-395721616) (thanks to @millette for the link!), about whether importing code from a random URL is safe to do in the first place.

Personally, I think that loading from URLs is a core feature of the web that we won't be removing any time soon, and other JavaScript environments should follow suite.

If you worry about trust and providers changing the contents unexpectedly, you can add processing steps to your codebase to rewrite all your imports to be from the local domain / fs, or use p2p technologies where the version is cyrprographically guaranteed to always refer to the same contents.

Flexability is a great base to build on, and you can add restrictions on top of it if you need to for your use cases.

## Other environments

As mentioned earlier, deno is a new JS environment that's competing with Node. They currently support loading from the local FS and from the web, so anything that works on the web will work here.

Another environment that might be a little less known is [GJS](https://gitlab.gnome.org/GNOME/gjs/wikis/home), the JavaScript environment that comes built into the [GNOME](https://www.gnome.org/) desktop environment.
They're [working on](https://gitlab.gnome.org/GNOME/gjs/merge_requests/150) adding support for ESM, though they seem to be at the early stages and are only going to be supporting loading from relative file paths for now, but my hope is that that might change in the future.
This is very exciting because it could mean that you could distribute full-blown desktop applications by running `gjs -m https://example.com/myapplication.js`, and having it use GTK APIs

---

Let me know what you think on either the [#dat IRC channel](https://webchat.freenode.net/?channels=dat), [gitter](https://gitter.im/datproject/discussions), or send me a message on [Twitter](https://mobile.twitter.com/RangerMauve).

I'll update this article as I get new information and ideas.

