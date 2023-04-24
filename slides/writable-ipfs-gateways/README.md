# IPFS Writable Gateways

<!--
Notes in comments are what will be said

Hey folks, thanks for coming to this talk.
Today we're going to be looking at the state of writable gateways and some future directions it can go.
At the end we'll have a short discussion session to take notes on stuff we'd like to follow up on.
-->

## Readable Gateways

<!--
Before getting into writable gateways, lets look at what readable gateways do that's common
Most of this functionality comes out of the box with Kubo based gateways in Go.
-->

- [Specs](https://github.com/ipfs/specs/tree/main/http-gateways)
- Resolve IPFS CIDs and download files (or sub-range)
- Resolve IPNS to use for same stuff as IPFS
- Download DAGs as CAR files (`?format` parameter)
- Generate directory listings

## Writable Kubo gateway

<!--
Similarly, the gateway that comes with Kubo also has support for opting into writing to the gateway alongside reading from it.
These are useful mostly for uploading individual files or adding/removing files from a gateway.
Notably, if you want to upload several files to a directory at once, the writable gateway won't give you recourse.
-->

[source](https://github.com/ipfs/kubo/blob/master/core/corehttp/gateway_handler.go#L295)

- POST `/ipfs/` -> `/ipfs/cid/` Upload fresh data with a new "root"
- PUT `/ipfs/CID/path` -> `/ipfs/cid/` Replace data at a path
- DELETE `/ipfs/CID/path` -> `/ipfs/cid/` Delete data at path

## Content ARchives - CAR

<!--
In a lot of situations, it's not enough to send files over one at a time and sometimes you'd want to send down an entire tree of data at once.
This is something that's supported by service providers like web3.storage support via uploads of CAR files.
CAR files store entire IPLD dags that are precomputed on the client side.
This means the client side has more control of how the content gets generated at the expense of needing to have extra code for creating them.
This seems like a common enough use case that we may wish to standardize it into writable gateways at large.
-->

- Create tree of data (IPLD DAG) in the client
- Convert to single CAR file
- Send file to gateway ([web3.storage](https://web3.storage/docs/how-tos/work-with-car-files/))
- Get back root CID
- Needs more code client-side

## FormData

<!--
For the web, there's been another standard way of sending multiple files to a single endpoint: Formdata. 
For raw HTTP libraries, this requires encoding data in multipartm/form-data encodings.
More practically within browser clients this can be done via built in APIs like `FormData` and `fetch()`.
Unlike CAR files which require more code for properly building up data, you can make use of existing browser primitives without extra dependencies to upload data.
One downside is that the formdata spec doesn't allow for specifying subfolders within file names being uploaded, so you're stuck with just adding files at the top level.
-->

- mim-type: `multipart/form-data`
- `FormData` / `fetch()` APIs
- No subfolders
- Also in web3.storage (under `/upload/`)

```JavaScript
const form = new FormData()
form.append('file', new File(), 'filename.txt`)
form.append('file', new File(), 'example.txt`)
// etc..
await fetch('ipfs://localhost/', {method: 'PUT', body: form})
```

## IPNS

<!--
Another place where writability could be useful, is when we think about mutability with IPNS.
A lot of applications rely on updating data over time and at the moment sending that updated CID often gets done out of bands via centralized side channels or protocols on top of libp2p.
In Agregore, we support this via similar APIs to IPFS.
In the same way that you can write new data over an IPFS CID path, you can write data over an IPNS key if the gateway has access to write over it.
This means that clients using this sort of gateway don't need any extra libraries in order to create and publish IPFS datasets that change over time.
-->

- Mutability to datasets
- Similar methods to `/ipfs/` writability
- `PUT /ipns/key_here/example.txt => ipns://key_here/` (raw body, FormData, also DELETE)
- `POST /ipns/localhost/?key=name_here => ipns://key_here/`
- Need to give gateway private key
- How to import keys?
	- `Authorization` header?
	- `POST /ipns/localhost`?

## Agregore

<!--
Earlier this year we experimented with these concepts in the Agregore Browser.
We created a custom fork of the go IPFS gateway and added in formdata, IPNS support, and some other goodies.
With this in place, and integrated into our browser's custom protocol handlers, we created a basic markdown blogging app which uses plain JavaScript and browser APIs to create updatable statically generated blogs.
Making the app helped us find pain points in development and to see whether it would be viable to have a zero dependency applicaiton that builds on p2p web tech.
The results were successful and we're hoping to branch out to more applications in the future.
-->

- Existing writable gateway functions
- Adds FormData support
- Adds IPNS support
- Source: [agregore-ipfs-daemon](https://github.com/AgregoreWeb/agregore-ipfs-daemon/blob/main/spec.md)
- [Mardown Blog app](https://github.com/AgregoreWeb/markdown-blog/) based on gateway + vanilla JS

## Discussion

<!--
So that's the current state of writable gateways that I'm privvy to.
Since we have some time left I wanted to open this up to some discussions about what we can do next as a community.
-->

- Questions?
- Are there more methods of mutability out there in gateways?
- Which of these things are useful for you as an app developer?
- Are these things we could standardize in gateways?
- Did anything mentioned surprise you?

<details>
<summary>🤫</summary>
<!-- This text is hidden when rendered -->
Agregore supports `pubsub://` for publishing and subscribing to data in a swarm.
This is useful for situations where you want to send around ephemeral data between peers in a network, and the gateway works with standard browser APIs like `EventSource` in order to get a stream of events.
</details>
