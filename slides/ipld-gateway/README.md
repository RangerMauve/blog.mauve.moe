# IPLD Gateway Spec

<!--
Hey folks, in this session we're going to be looking at some of the ideas I've had about exposing high level IPLD APIs via gateways and custom protocol handlers in browsers.
We'll be periodically pausing to take questions/comments from the room so we can figure out a spec that works for everyone.
-->

- [IPIP Spec PR](https://github.com/ipfs/specs/pull/293)
- [IPLD URL Exploration Report](https://github.com/ipld/ipld/blob/e6cfab631d2bd24bf158d3a85e126514c98de5ce/notebook/exploration-reports/2022.03-ipld-url-scheme.md#future-work)

## Goals

<!--
Starting out, here's some of the assumptions and goals I had when going about this.
-->

- Make IPLD a first-class part of gateways
- Simplify for app devs / light clients
- Expose raw IPLD without UnixFS-ities
- Clear path for integrating ADLs/Schemas/etc
- Read + write capabilities
- Find folks that would use this
- Use case: Light clients (Browsers/ETC)
- use case: Languages/Environments with little IPLD library support

## Basic

<!--
With that in mind, let's talk about some basic APIs we could expose on the gateway for loading IPLD content.
Obviously, getting a CID can be useful, and we could extend it with the standard `Accept` header from browsers to get data out in different formats.
Similarly the gateway will inform us what the encoding is for the data we asked for.
-->

- `GET /ipld/cid/supath`
- `Accept: application/json`
- `Accept: application/vnd.ipld.dag-cbor`
- Default to CID's encoding?
- Respond with `Content-Type: application/json`, or encoding used
- Similar to `?format` parameter in `GET /ipfs/`

## Path Segment Parameters

<!--
A slightly more advanced feature, which makes raw IPLD different from IPFS paths, is the ability to view data through different lenses.
I propose we take full advantage of this in gateways and make it easy for applications to signal that they would like to use ADLs and the such.
With this we can apply ADLs, schemas, and selectors for segments in the IPLD path.
-->

- IPLD has "lenses" for viewing data
- Can we add them to segments of a path?
- `/ipld/cid/[ADL=HAMT]example`
- Alternately, specify info in the querystring for the root CID?

### Syntax

<!--
Each `segment` in an IPLD path can have some parameters surrounded by `[` and `]`.
The content of these parameters follows the same encoding as query strings, where parameters specify lenses and IPLD transofmrations that should be made on the data before returning it to the client.
-->

- Segments of a path can have parameters
- `[` and `]` for surrounding parameters
- Parameters use same syntax as querystrings
- e.g. `[ADL=foo&Schema=bar]`
- Extracted out of the path specifier
- Use URL encoding for escaping new special characters.

### ADLS/Schemas/Selectors?

<!--
So, I'd like to reserve this parameter syntax sooner than later, but I'd like some feedback before suggesting specific ways that parameters should be handled.
I've put some questions together that it'd be useful to contemplate and to record answers from folks in the room.
Feel free to bring up related points here too.
-->

- What ADLs should we support? (HAMT to start?)
- How should schemas be linked to? (URL to IPLD data for schema? Inline JSON?)
- Is there a good way to serialize selectors?

## Writing

<!--
So, reading IPLD data is a good start, but I think that authoring content is just as important if not more so important for p2p tech to really spread.
With that in mind, I wanted to apply some of the learnings from writable gateways for IPFS and IPNS to IPLD.
-->

- Writing data is important! Not just reading.
- Learned from writable gateway requirements

### Basic

<!--
Uploading IPLD data could be similar to IPFS.
We can POST data encoded in whatever format we're used to to `/ipld/` and get back the CID for it.
Or we can PUT some data over top of an existing CID with some data and get back an updated root.
We'll also need to figure out how long data would be persisted and how this could interact with pinning services.
As well, similar to being able to read data in different formats, we can hint to the gateway which encoding we're using for IPLD.
One thing that remains is to figure out how we could POST data in one encoding, but have the gateway save it in another one.
This could be useul for cases where JSON is easier for your application to work with, but you want to store the data in a more efficient format like dag-cbor.
-->

- `POST /ipld/ {somedata} => ipld://newcid`
- `PUT /ipld/cid/subpath {somedata} => ipld://newcid`
- `Content-Type: application/json`
- `Content-Type: application/vnd.ipld.dag-cbor`
- Can we submit JSON but tell it to encode as CBOR?

### Patch

<!--
For cases where we want to perform several changes to a dataset at once, we can make use of the IPLD Patch spec.
This is based on JSON-Patch for specifying operations to apply, but it works with the IPLD data model and can use any encoding that is supported by it.
Coincidentally, the HTTP spec has a standard PATCH method which we can leverage for adding in data.
This makes it easier for applications to represent complex changes and to determenistically share change sets.
-->

- [IPLD Patch Spec](https://ipld.io/specs/patch/)
- Based loosely on [JSON-Patch spec](https://datatracker.ietf.org/doc/html/rfc6902/)
- Apply sets of operations over an IPLD tree
- Encode operations in whatever format translates to the IPLD Data Model
- `{ "op": "add", "path": "/baz", "value": "qux" }`
- `PATCH /ipld/cid/ [{op: 'add', ..etc}] => ipld://newcid/`
- Easier to do complex operations with less code
- Easier to share determenistic change sets

## IPLD client library API

<!--
Outside of gateways, it would be useful to think about how these same operations could be exposed via IPLD APIs.
I propose having raw mappings between IPLD APIs/CLI tools and the gateway so that applications could have a standard way of thinking about working with IPLD along side the nitty-gritty low level APIs for when they need them.
-->

```
ipld.get(url) => Node
ipld.put(url, Node) => url
ipld.patch(url, patchset) => url
```

## Next Steps

- What other use cases can you think of?
- Anything we should watch out for / is missing?
- What are some potential applications?
- Are there folks that would actively be interested in using these specs once we make them?
- Can we get buy-in from gateway maintainers/
