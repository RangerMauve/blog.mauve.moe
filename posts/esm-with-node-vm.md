# EcmaScript Modules with Node's VM API.

In version 9.6.0, Node.js got released with a new experimental API in it's [vm](https://nodejs.org/api/vm.html#vm_module_link_linker) builtin module which allowed for plugging into the EcmaScript module system with an elegant promise-based API.

With this, it's now easier than ever to build custom JavaScript environments outside of the browser and to easily experiment with custom module architectures.

I've been wanting a browser-first / ESM-first environment for a while, and was excited when [deno](https://github.com/ry/deno_dev) came out, but was disappointed that it was still creating an environment that wasn't going to enable modules to be used with the web without build tools.

When I read up on the new [esm](https://nodejs.org/api/esm.html) support in node, I was excited again because I thought it would bring us closer. But again, node decided to break web compatability (to preserve compatability with existing modules), and to require all ESM modules to use the `.mjs` file extension, which would make it harder for people to publish them on the web (in the short term?). Another problem is that the experimental support only allows for importing from the local filesystem, which meant that you couldn't load modules over HTTPS like you could on the web, and had to download all your modules locally to use them, which would make it hard to reuse things that were published for the web.

Another cool tool that has seen a lot of popularty is the [esm module](https://github.com/standard-things/esm) which allows you to load fancy ESM-based code by parsing your files and compiling them to something that works with regular node. Though again, it was using the `.mjs` syntax, and was very heavy because it's approach relied on parsing and transpiling your entire codebase.

Then, I saw that the ESM support in node allowed for an experimental "loader" which could customize how `import` resolved file URLs. However, this only allowed rewriting the imports to other locations on the current filesystem, and didn't support loading things asynchronously. With some clever hacks using [child_process.spawnSync](https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options), some global variables, and a bunch of ugly code, I managed to create the first version of my "node-web-loader" which would allow loading files from the web and provided important APIs like `fetch` and `websocket` for doing interesting things with them. You can read about it more in my [original blog post](https://rangermauve.hashbase.io/posts/node-loader-for-web-and-p2p).

This approach was slow and seemed kinda hacky. Plus, it leaked a lot of node-isms which I wanted to avoid in order to encourage web-first modules (the opposite of what the JS ecosystem looks like today).

After doing a bit more digging, I realized that the VM module gave more powerful abstractions over how `import` should behave and would isolate scripts from the rest of node by default. With this knowledge I did a total rewrite and renamed the module to `webrun`.

The APIs provided by node for this were *amazing*. They were structured to make it as easy as possible to implement custom, asynchronous, loading logic and the code almost wrote itself. Paired with the [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) API, all I had to do was add a bit of glue for loading the contents from the FS, HTTPS, and Dat. As a result, it's now even easier to add more protocols for loading contents. [IPFS](https://ipfs.io/) is high on my list for loading contents.

I've been slowly growing a small collection of [libraries](dat://da03b54ff070571e65e41766544e0924ca1212b212d881542fd1abcebb9593bb/) for the Dat ecosystem which I want to be able to reuse server-side for making stuff like bots and seeding services, and I think that webrun is going to be great for facilitating as much code reuse as possible between client-side and server-side applications.

The web platform has come a long way, and I think that more people should start looking at how they can use the tools it provides and move away from crazy frameworks and heavy build toolchains. I hope we can start seeing a healthy cross platform ESM module ecosystem flurish in the next few years.

If you have any comments, feel free to message me on [Twitter](https://mobile.twitter.com/RangerMauve/status/1035904272037294080), or open an issue on the [webrun](https://github.com/RangerMauve/webrun/issues) GitHub repo.

