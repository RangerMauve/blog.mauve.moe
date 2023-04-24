Here's a stream of thoughts about how one could make an alternative to dat-gateway using a single page application with service workers.

## Concerns about the dat-gateway

Having the dat-gateway serve files is a potential security issue. It should be possible to allow the browser to replicate with the swarm without ever revealing th contents of the data to a thir party server.

As well, replicating a hyperdrive via WS makes it hard to experiment with different data types like raw hypercore or hyperdb (and the cool stuff that cabal does with auto-auth).

## What to do about it

### Gateway

The gateway should just give access to the discovery-swarm. The same API as the swarm, will be provided by sending messages over a websocket to a gateway. The gateway will only be able to infer data that a MITM could catch which is really only discovery keys. This way the actual contents are still safe.

### SPA (PWA?)

In addition to a gateway, there should be a single page application which is used as the entry point to the dat ecosystem. It will have a URL box for dat urls, register a protocol handler, and register the service worker that will be used to serve the files.

### Service Workers!!

The service worker will be the main guts of the application in that it will be the mechanism for serving content to the browser and injecting the polyfill. When it gets set up, it will intercept all HTTP traffic for the current domain for everything in the `/dat/:key/**` path.

When it gets requests for data:
 - it will set up a hyperdrive
 - have it store its data in IndexedDB (for caching) (Maybe use RAM instead?)
 - set up a replication with the swarm
 - Wait a bit for the metadata to sync
 - Generate a response with the file content

### Polyfill

The polyfill will be the bit that makes the client-side work. The existing version of dat-polyfill was enough to get fritter to work, so it should be adaptable for other applications.

The polyfill consists of a few parts:

### URL Rewriter

As mentioned before, all `dat://:key` urls will need to be redirected to the `/dat/:key`. This is needed because service workers can only intercept HTTP traffic. The dat-polyfill was already doing this to rewrite URLs to point at the gateway, so it should be easy to adapt it to point locally.

### Local Storage shim

A big issue that the gateway addressed was cross-origin resource sharing. Before the dat-gateway got redirection, all sites were served from the same origin, and thus shared the same local storage. This should be accounted for by rewriting the globals for storage to prefix the current dat key to all keys / DB names in order to prevent sites from knowing about each others data. This isn't super secure, but it should be enough to whet people's whistles.

### DatArchive polyfill 

The DatArchive polyfill will need to be reworked in order to support the new gateway. The replication is going to be a bit more challenging since it will need to manage multiple replication streams with the swarm. Otherwise it could remain exactly the same, which will probably be good enough to run complex applications like fritter.