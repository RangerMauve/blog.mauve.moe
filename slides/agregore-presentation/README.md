# agregore-presentation
A overview of Agregore, why it exists, and what it's trying to do.

## Outline

### State of Dat on the Web

- Beaker: Electron-based web browser. JS APIs and custom browser functions. Tight integration with Hyperdrive and rest of browser. Does a lot of stuff that other browsers don't.
- Dat-Webext: Firefox extension based on Libdweb. Can load content on `hyper://`, no APIs for writing yet.
- Dat-SDK: With stuff like `dat-polyfill` could enable web pages to load Dat content. Relies on WebRTC and gateways to function.

### Why Agregore?

- Wanted real P2P in an app (not web proxies or poorly supported extension APIs)
- Mixing protocols (`hyper://`, `ipfs://`, `bt://`)
- New ways to interact with protocols

### What are it's goals?

- Be Minimal
- Mix Protocols
- Leave more to the OS
- Leave more to Extensions

### Minimalism

- Forget about tabs - use Windows
- Bookmarks are files in a folder
- Remove unnecessary UI elements
- Invent as little as possible

### P2P Fetch

- Developers are used to using Fetch or HTTP for working with Data
- A lot of protocols can map to URLs
- Use HTTP methods for interacting with protocols
- Can `GET` to load some data off a p2p network
- Can `PUT` to upload data to a p2p network
- Can `WHATEVER` to do other things
- EventSource for getting updates

### Web Extensions

- Every web context can access `fetch()`
- Extensions can save and load data using p2p protocols
- Bookmarks tracker that doesn't use third party services
- Content discovery over local network

### Future

- Draft mutable Hyperdrive Fetch API
- OS-level bookmarks
- Integrate EartStar protocol
- Integrate IPFS protocol
- Integrate BitTorrent (mutable and otherwise)
- Integrate with decentralized payment APIs (cryptocurrency stuff?)
