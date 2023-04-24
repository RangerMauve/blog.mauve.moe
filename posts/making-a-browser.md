# Making A Minimal P2P Browser (In Rust)

Electron is all the rage these days and it's enabled cool projects like [Beaker](https://beakerbrowser.com) to experiment with creating new kinds of browsers.

Although electron enables you to reuse Node.js code and mix it with new-ish versions of Chrome, it has some drawbacks. Namely: applications using Electron need to be distributed with what's essentially the entire Chromium and Node.js code bases and take on the high memory usage of Chrome out of the box.

## `webview`

Wouldn't it be cool if instead of bundling a bunch of extra code in your application, you reused the web views that the OS provided? A few years ago this would have been a pretty bad idea because OS-specific browsers sucked. But now that Webkit is keeping relatively up to date with modern web features, and Windows 10 is able to use Edge instead of IE, it's startling to look like a pretty good idea.

I'm of course not the first to think of this and this idea is in use in the amazing [zserge/webview](https://github.com/zserge/webview) library. The library is written in `C` and has bindings for a bunch of languages. The idea is that you load a window with the OS webview, and then use two-way communication with it to create your user interface. One of the drawbacks of this library is that it's C API is fairly minimal so you can't do everything, and it doesn't support Edge on Windows, so you're stuck with old JS features.

Another library that was inspired by `zserge/webview` is [quadrupleslap/tether](https://github.com/quadrupleslap/tether). This library uses `Rust` instead of `C` and integrates with the UWP APIs on Windows to use Edge as the webview. It still has some limitations that make it unsuitable for making a fully fledged browser, but before we get into that, let's look at what a browser would need.

## Features needed for a browser

A browser that wants to mess around with new protocols and JS APIs will want to have at least the following to be viable:

- A way to spawn multiple webviews for tabs/windows
- A way to layout those webviews and communicate with them
- A way to register new protocol handlers
- A way to inject JavaScript into webviews before anything else loads
- A way for JavaSript to send messages back to the native code

These features aren't super fancy, but it's still a challenge to find a way to get it work the same across multiple platforms.

### Spawning multiple webviews

`webview` and `tether` have examples of how to spawn windows with a webview, but they tie in the creation of a webview with the creation of a window.

This would need to be decoupled into two APIs. One for creating a window, and one for creating webviews and attaching a webview to the window.

The APIs for this will be based off of the code in `tether`.

### Layout

After these web views are created, we need APIs to move them around in the window.
The platforms I'd want to support all provide some way of doing layout with absolute values, so those APIs could be abstracted across the platforms.

### Protocol handlers

With the previous stuff in place, it could be enough to make a super basic browser.
But we're looking to experiment with new protocols so we should have support for that.
Most browsers have something like this, register a handler, and return a stream of data for a request.
Edge seems to only support loading the main page from other protocols, so I'm not sure how well that'll work


## Dream platform-abstracting APIs

TODO

## New JS APIs for p2p functionality

- [DatArchive](https://beakerbrowser.com/docs/apis/dat.html)
- Dat PeerSockets API
- IPFS
- IPNS
- IPFSArchive
- Libp2p
- SSB

## Styling browser chrome

Wouldn't it be cool if you had _total_ control over your browser without having to do any native coding?

What if most of your browser features were created using a webpage?

I think that the easiest way to make this new browser hackable is to provide a set of high level APIs for spawning webviews and interating with them,
and having a priviledged webview which is used as the the main browser logic.

From there you can configure which URL this priviledged view is loaded from, and allow it to control how the browser behaves from there.

The browser should ship with a default look and feel, but it should be easy to fork off of it and customize it how you see fit and configure it to load from your URL instead.
This plays nicely with the Dat ecosystem since it's easy to fork an archive, customize it, and push out uptdates (or checkout a specific version).

Instead of having internal databses and fancy settings for the browser in native code, it can be stored in localStorage and indexedDB (or dat archives!).

This enables people to customize their browsers on a low level. For example, if you want to share your browser history between your devices, instead of relying on a centralized service, you could put your history in a Dat Archive and have that sync between your devices.

You could have your own ideas of what boomarks are and how they should be organized, or how tabs should be split on the screen.

The goal is to take browser customization outside of the native code, and to put it in the hands of the user.

### Priviledged browser APIs

- Permissions
  - Access restrictions for IPFS/Dat/SSB/etc per domain
  - Listing domains and accept/deny lists
  - Modifying these lists
- WebView creation/positioning/communication APIs/loading events
- `<browser-webview>` element
  - A CustomElement that represents a webview
  - When it's created, it will automatically invoke the webview creation API
  - When it's layout changes, it will update the position and layout of the webview it represents over the API
  - It will have attributes for injecting JS code
  - JS API for sending messages to and from using `postMessage` and `onmessage`
  - Listeners for URL changes and content loading/errors
- DatLibrary
  - Lists the DatArchives that were created locally
  - Lists DatArchives that are in the cache and has methods to clear them
- IPFSCache
  - Lists cached IPFS content and adds methods for clearing content
- Register protocol stream handler
  - In addition to being able to register protocols in native code, it should be possible to load them in the browser view itself. This is likely a bad idea with regards to performance, but YOLO.

## Outline of ideas

- Use Rust (yay)
- Base code off of [tether](https://github.com/quadrupleslap/tether), a cross platform library for binding to OS browsers. This way you don't need to include any browser engine like you would with electron.
- Add API for `registerStreamHandler(url, stream: Write)` to Rust bindings
  - Have it take a URL and a [writable](https://doc.rust-lang.org/std/io/trait.Write.html) stream in the rust binding
  - `Linux` [webkit_web_context_register_uri_scheme](https://webkitgtk.org/reference/webkit2gtk/stable/WebKitWebContext.html#webkit-web-context-register-uri-scheme)
  - `Windows` [NavigateToLocalStreamURI](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.controls.webview.navigatetolocalstreamuri#Windows_UI_Xaml_Controls_WebView_NavigateToLocalStreamUri_Windows_Foundation_Uri_Windows_Web_IUriToStreamResolver_)
  - `Apple` [setURLSchemeHandler](https://medium.com/@kumarreddy_b/custom-scheme-handling-in-uiwebview-wkwebview-bbeb2f3f6cc1)
- Add API for `addJSInterface(name, script, (args: String) => void)` to Rust binding
  - `Apple` Handle events: [addScriptMessageHandler](http://www.joshuakehn.com/2014/10/29/using-javascript-with-wkwebview-in-ios-8.html) Inject APIs: [WKUserScript](https://developer.apple.com/documentation/webkit/wkuserscript?language=objc)
  - `Linux` Handle Events: [register_script_message_handler](https://github.com/quadrupleslap/tether/blob/master/src/platform/gtk.rs#L127) Inject APIs: [add_script](https://github.com/quadrupleslap/tether/blob/master/src/platform/gtk.rs#L129)  
  - `Windows` Handle Events: [ScriptNotify](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.controls.webview.scriptnotify) Inject APIs: [InvokeScriptAsync](https://stackoverflow.com/a/38181085)
- Add API for `setPosition(top, bottom, left, right)` to reposition a webview
  - `Windows` [UpdateLayout](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.uielement.updatelayout#Windows_UI_Xaml_UIElement_UpdateLayout)
  - `Linux` [GtkFixed Layout](https://developer.gnome.org/gtk3/unstable/GtkFixed.html)
  - `Apple` [setFrameSize / setFrameOrigin](https://developer.apple.com/documentation/appkit/nsview/1483530-setframesize)
- Support new protocols:
  - `dat://`  [datrs](https://github.com/datrs/dat)
  - `ipfs://` [rust-libp2p](https://github.com/libp2p/rust-libp2p)
  - `ipns://` [rust-libp2p](https://github.com/libp2p/rust-libp2p)
  - `ssb://` (for blobs) No existing rust implementation 😢
- JS APIs:
  - [DatArchive](https://beakerbrowser.com/docs/apis/dat.html)
  - IPFS
    - `static async readFile(url: String, format?): ArrayBuffer|String`
    - `static async writeFile(content : ArrayBuffer|String) : String`
    - `static async readdir(url: String) : Array<String>`
    - `static mkdir(name: String, paths : Array<String>) : Strng`
  - IPNS
    - `static async resolve(url: String) : String` Resolve IPNS to an IPFS URL
    - `static async * watch(url: String) : AsyncIterable<String>` Resolve 
    - `static async publish(url: String) : String`
    - `static async self() : String` 
  - IPFSArchive
    - Similar API to DatArchive, but it takes an `ipns://` or `ipfs://` URL and you can write to folders if it's IPNS and you're the owner
  - LibP2P
    - Something for listening on a connection, and advertising on the DHT?
  - SSB ??
    - Something for reading an SSB feed and publishing to "your" feed.
- Browser UI should use overlayed web views
  - Load the UI from a path (`dat://`?)
  - Priviledged JS APIs for managing stuff
    - List created DatArchives
    - Intercepting access control restrictions (used in Dat/IPFS/SSB)
    - Setting JS whitelists and blacklists
    - Adding contacts for SSB network
    - Injecting additional JS APIs using `<webview>`
      - `postMessage` and `onMessage` for communication
      - `userScripts` attribute for loading JS.
  - Have a `<webview>` element in the HTML
    - Have a webview created in the native side and overlaying the browser layout webview (this is used for the actual content)
    - Use a web component which will calculate it's size and message the native thread about it's layout
    - Reposition the native webview relative to the custom element
  - Any windows should be opened with `window.open` and positioned with that in mind so that they'll be overlayed over the content webview
  - Any state should be placed in `localStorage` or `indexedDB` or whatever else.
  - The URL should be configurable by the user so that the browser can be fully customized from there.

- Use similar methods for Android and iOS? Should figure out how rust bindings would work there.