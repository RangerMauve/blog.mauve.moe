# Mauve's Vision for IPLD

This post will go over some of my thoughts on how IPLD can be advanced in the ecosystem to enable more advanced linked data use cases in the IPFS ecosystem.

## Why improve IPLD?

From my perspective, while IPFS is great for sharing large numbers of static files, more advanced data use cases like CRDTs and databases are much more difficult to represent in this paradigm.

IPLD serves these more advanced use cases, but it's currently underutilized by the general developer and is left to a few people that understand the lowest levels to take advantage of it.

I believe that the time is right to make IPLD more accessible in order to enable more powerful distributed applications.
New developments in the ecosystem like Probibalistic B-Trees, and the IPVM working group can drastically change what's possible with raw IPLD, and we should be taking advantage of this fact sooner than later.

I'll go over some specific things we could focus on to have IPLD create a bigger impact on the ecosystem.

## More obvious onboarding

Often, when I bring up IPLD in IPFS spaces, people end up not knowing what exactly it is, or what it's used for outside of the basics like codecs.
Usually, people don't think too hard about the uses of the IPLD Data Model and lenses over top of it such as Schemas or Advanced Data Layouts.

This speaks to a lack of onboarding into what IPLD is in our documentation, and in the documentation of the rest of the IPFS ecosystem.

Ideally, people new to IPFS and content addressible data should have a path onboarding them onto IPLD and to take advantage of it in their applications.
There's already been a start to [cleaning up the IPLD Docs](https://github.com/ipld/ipld/issues/240) and we can piggyback off of the general formatting improvements to create better onboarding docs within and outside of the ipld.io website.

## Higer Level APIs

Similarly, the current state of IPLD APIs is fragmented accross the different implementations, and knowledge of available features is spread out based on who is working on what setup.
In particular, there's high level way of combining raw IPLD data, with a way to retrieve it via libp2p, and to apply various lenses like ADLs/Schemas over top of the traversal.

I've been working on this as part of my proposal for `ipld://` URL schemeas and a new IPFS gateway `/ipfs/*` path [here](https://github.com/ipfs/specs/pull/293).
This gives developers a clear way to interpret IPLD in a way that exposes the raw data model, the ability to convert between codecs, and the ability to apply lenses over top of data.
Part of this effort is to merge the concept of lesnes with path traversal into a single reusable unit.
This works via the ability to specify extra parameters to path segments using the [URL Matrix Parameters Spec](https://www.logicbig.com/quick-info/web/matrix-param.html).
For example, if we want to treat data at some path of the URL as a HAMT in order to more effectively search through its key space we could do the following: `ipld://CID_HERE/HAMT_KEY_HERE;adl=hamt/`.
This can be combined with other features like IPLD Schemas and future features like AutoCodec where we can specify CIDs of the lense to apply and load it dynamically from IPFS/libp2p.

Along side this, the new  [IPLD Patch](https://ipld.io/specs/patch/) spec gives us a clean way to mutate arbitrary IPLD trees in a determenistic manner than can translate well between applications.
Patch sets are easier to understand than arbitrary code for mutations, and have the added benefit of being encodable to IPLD itself so that it can be referenced by higher order structures.
This works well along side the HTTP Patch method, where we can provide application authors a way to PATCH IPLD data and get back a new IPLD URL the same way that they can POST some data to a writable IPFS gateway.

At the moment, I've been experimenting with this in JS in the [js-ipld-url-system](https://github.com/RangerMauve/js-ipld-url-resolve/) repository and in the Agregore Browser's p2p protocol handlers.

Overall, the existing APIs can be useful for advanced users which are comfortable gluing everything together with their own application specific code, but there's an opportunity here to reduce the barrier to entry into the IPLD space with a higher level API that centers all of IPLD's high level features.
This is something where we can leverage IPLD fixtures to guide API implementation in several languages at once with a few developers.

## Robust Rust implementation

On the topic of IPLD APIs, the Rust implementations of IPLD are in sore need of some improvement.
At the moment they focus mostly on codecs to translate data between Rust structs, and Blocks intended to be sent to blockstores.

Missing entirely, is a high level IPLD `Node` interface used by the go-ipld-prime data model to enable higher level features such as Schemas and ADLs to work on top.

Rust is a major part of the IPFS ecosystem with its use in the [FVM](https://fvm.filecoin.io/), [WNFS](https://github.com/wnfs-wg), and [Iroh](https://github.com/n0-computer/iroh/).

It's important that IPLD gets represented properly in this space in order to secure it's capabilities in the future.

With that in mind, we would need to fund work on bringing the state of Rust IPLD on par with what is available in Go and looking for projects that would wish to make use of this functionality.

I've been working with the team at KEN Labs on a devgrant to standardize IPLD Prolly Trees, and they would be interested in working on some of this Rust tooling as part of their effort to integrate the spec with FVM use cases.

## WASM Integration

As well, this year we've had some interesting developments on the integration between IPLD/IPFS and WebAssembly in projects like Adin's [WASM-IPLD](https://www.youtube.com/watch?v=Z6ZLawrc94g&list=PLuhRWgmPaHtSVgToYLfsj-gggF9vB1Hzy&index=16) and Fission's [IPVM](https://fission.codes/blog/ipfs-thing-breaking-down-ipvm/) initiative.
There's now a few use cases where WebAssembly and IPLD interplay together, and it seems like the right time to standarize an ABI based on the IPLD data model that WASM modules can either consume arbitrary IPLD data that's initiated from the host environment, or in the autocodec use case, provide IPLD data to be used in traversal at the host level.

This will work well with the Rust effort where we can have Rust bindings for this interface to use either in standalone projects, or projects running within WASM contexts like the IPVM or IPLD URL resolvers.

## P2P Database Use Cases

Ultimately, I beleive that all these improvements to IPLD will improve the IPFS ecosystem's position in using decentralized peer to peer databases.
I imagine ADLs like Prolly trees being used to publish large datasets from either community sourced data, or blockchains publishing their state on p2p indexes instead of centralized full node databases.
Lots of projects in the web3 ecosystem end up reinventing databases and data schemas which don't end up interoperating and often centralize storage and querying on mostly centrally managed infrastructure.

With IPLD we can give people an alternative which can spread the load for querying and can make it possible to verifyably load data while using local caches and direct peer to peer connectivity.

There's a few groups working on things around peer to peer databases for [search indexing](https://rorur.com/), for [big data](https://github.com/pando-project/pando) use cases, and for [local-first chat apps](https://berty.tech/features/).
At the moment it requires a lot of digging and domain knowledge to make something, but I think we're in a good position to help create some higher level tools that can be reused in more projects.

This is something that can be enabled with the higher level APIs, better Rust/WASM support, and by having paths to groups to leverage these tools when applying to devgrants.

## Upkeep on existing issues

Currently Rod is the main person watching and fixing loads of IPLD related issue accross dozens of repos and several languages.
It can be hard to prioritise new things that would be useful for ecosystem growth when we're constantly playing catch up with issues.
With that in mind, getting one or two more people on the backlog, or having more strict policies of closing issues that don't have champions could help us push the ecosystem forward without accruing more technical debt.

## Takeaway

There's a bunch of areas where IPLD can use some more attention and person-hours, but we're in a good position to ride the wave of web3 projects gaining maturity and to create some useful tools for people to work with data.
