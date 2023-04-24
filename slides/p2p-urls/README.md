# Mixing Peer to Peer Protocols On the Web
## With the Agregore Browser

## P2P Protocols

### BitTorrent

### IPFS

### Hypercore-Protocol

## Web Integration

### URLs

- `scheme://origin/path?searchParams`
- `origin` is case-insensitive, clashes with protocols that use uppercase chars
- `origin` separates web pages storage from each other, one origin per "app"?
- `path` can help you specify a particular bit of data in the dataset
- `path`s ending in a `/`, either resolve to a directory listing, or load an index file

### Ways URLs are used

- web pages (html, iframes)
- images
- audio
- video
- stylesheets
- scripts

### HTTP

- Method + URL + Headers + Body? => Status + Headers + Body?

### `fetch()`

- Browser API for interacting with HTTP
- Can be used to interact with any protocol as if it were HTTP

## Agregore

### Minimal

- As few assumptions as possible
- Extendable via extensions (which can access p2p protocols)

### Protocols

- ipfs (ipns)
- hyper
- bittorrent (magnet)
- gun
- gemini
- YOUR NAME HERE

### Demo

- Make a website using Markdown

## Local-First Software

- User-owned data
- Works offline
- Local-area network
- Over the internet

## Mesh Networks

- Apps are resilient to outages
- Exchange data over most local mesh node
- Reduce internet costs by reusing local caches
