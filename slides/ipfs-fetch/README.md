# IPFS-Fetch

## Intro

### Web good

- Easy to start with HTML and a bit of JS
- Cross platform, evrything has a browser
- Content / app distribution

### Servers Bad

- Needs more expertise to get right
  - Scaling is hard
  - Security harder
  - More code to learn and set up
- Needs internet
  - Need internet to author content
  - Need internet to load content
  - Hard to get an offline-first flow working
  - Loading a file betwen two devices requires world-wide round trip
- Usually need money to keep going
  - Needs credit card and housing
  - Money that you might not have much of
- Third party hosting means you don't own your data
  - Might shut down and take your data / community down
  - Breaking changes to your site or hosting which you can't revert

### P2P Good

- Stuff works offline-frist
- Shove some files in a folder and you're good
- No need for extra code for servers
- Can work without a third party
- Internet is an upgrade for more connections

## P2P + Web?

Right now most peer to peer protocols require specific APIs and require developers to learn new paradigms to interact.

What would it look like to have native integration of peer to peer protocols on the web?

### Interaction with HTTP

- URLs
- GET / PUT / DELETE
- Load a page / File
- fetch()

### IPFS-Fetch

- GET `ipfs://SomeHash` or `ipns://ipfs.io`
- PUT `ipfs:///file.txt` => `ipfs://SomeHash`
- PUBLISH `ipns://somename/`

## Agregore Browser

- Built in Protocols
- Minimalist design
- Made to be extended with extensions
- Multi-Protocol

## Demo tiiiime

- Open up dev tools
- Author a simple HTML page
- PUT into IPFS
- PUBLISH to IPNS
- Load URL

## Next steps

- Performance Tuning
- Example apps / docs
- Pertner with projects

## Finishing Thoughts

- Make something
- Make stuff simple
- Make stuff resilient
