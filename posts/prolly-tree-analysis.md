# IPLD Prolly Tree Analysis

This report describes the capabilities of IPLD prolly trees, their use cases, paths for improvements, and alternative structures.

Last Updated Dec 2024 by [Mauve Signweaver](//ranger.mauve.moe)

## How they work

Prolly Trees, invented by Aaron Boodman [^3] and used in the Noms database, are a type of Merkle Tree [^4] used to store ordered sets. It has similarities to B+ Trees in that the set of values is split among "leaf nodes" in a tree, with the main difference beening that where a leaf node starts and ends (the chunk boundry) being determined by randomness from a cryptographic hash function. The benefit of this approach is that the shape of the tree is independant of the order in which keys were added to it. Random read/write operations are O(log<sub>k</sub>n) where `k` is the average chunk size.

To determine these boundaries, the individual entries are hashed and then the resulting value is inspected to see how many `0` bits exist at the end. If there are enough consecutive `0` bits, then there must be a "chunk boundary", and any subsequent entries should be added to a new leaf node. Assuming a uniform distribution in the hash function's output, this allows to determine the probability that en entry has a certain number of bits. One can then configure the number of `0` bits your application desires called the Chunking Factor. There are other variations on how to calculate the hash (such as using a rolling hash), but this is the general approach.

## Merging and Diffing

Since Prolly Trees are deterministic based on their content, if two trees have the same data, they will also have the same root hash. This also works for subsets of a tree. With this property one can quickly determine which subsets of two trees are the same or different. Any hashes of subtrees that match are known to be identical, and any that are different can be traversed to get their new keys. Merging two trees involves finding the subtrees that are different slipping them in at the level where they're different. One also needs to check that the ends of the subtrees fit in with the chunk boundries.

## IPLD Variant

The IPLD Prolly Tree [^6] variant of this makes use of the Inter-Planetary Linked Data ecosystem to encode data and support flexibility in hash functions and data encodings. IPLD supports encoding different hash functions and encodings (such as cbor, json, etc). Having flexebility in the content addressed layer and IPLD having implementations in different programming languages allows for rapid prototyping and experimenting at the application layer. To account for different prolly trees having different configuration options (chunking factor, hash function, data codec), the root of an IPLD Prolly Tree contains a strict pointing to this configuration as well as the root tree node. This enables quickly comparing whether two trees are compatible for merging / diffing. Data in IPLD is stored in the IPFS ecosystem which includes projects like Filecoin which enable long term archival of datasets using decentralized storage networks.

## Room for Improvements

The current IPLD Prolly Tree implementation is useful, but there are still some areas that could be improved.

IPLD serialization can add overhead and more research needs to be done to find appropriate tradeoffs between different formats and hash functions. One area that could be explored is to compare IPLD to popular encodings like dCBOR or FlatBuffers.

The boundry calculation currently uses hashes of key-value pairs but there is room to use Rolling Hashes which take chunk size into consideration the way that Dolt does. This can help lead to more uniform chunks and avoid chunks that are too big or too small popping up randomly.

The current implementation focuses on IPFS Blockstores for storing and retrieving data, usually backed by an indexed CAR file [^9]. This works for storing data within the IPFS ecosystem, but it isn't optimized for updating data and sequential reads. There's room to be more focused on the on-disk representation to speed up operations.

There's currently no optimized protocol for replicating IPLD Prolly Trees since by default we use the Bitswap protocol from IPFS [^10] over libp2p connections. This can lead to performance issues when traversing "deep" trees due to needing to ask for one layer in the merkle tree at a time. There is opportunity to make use of other IPFS protocols like Graphsync [^11] in order to ask for several layers at once. However it could be useful to create a novel replication protocol which works on key ranges and subtree sipping and provides streaming merkle proofs in order to make the best use of the network ranges.

There's also room to figure out improvements around resolving conflicts in duplicate keys as well as implementing tombstones for keys that should be "Deleted". CRDTs that support compressing operations into state snapshots like Delta State CRDTs [^12] can be a useful avenue to explore for cases when the same data may be getting updated accross devices and datasets.

## Alternatives

Merkle Search Trees[^2] are a popular alternative to Prolly Trees which come with a different set of tradeoffs. Unlike Prolly trees, items in the keyspace exist not only in leaf nodes but are evenly distributed accross "layers" in the tree. This means that sequential reads need to traverse "up and down" the tree to add/remove keys which can make logic for construction more complex compared to the "bottom up" approach possible with prolly trees. The benefit of this approach is that fewer nodes in the tree may need to be "re stitched" as chunk boundries change. For Prolly Trees you may (extremely rarely) result in an extra merge or split at every layer of the tree starting from the leaf. According to the paper, in the MST you will only get at most one of these merges or splits within one layer of the tree. This can be important if you want to maximize cache reuse.

## Value To Decentralized Ecosystem

A lot of distributed systems are stuck in fully replicated single writer logs as the default primitive. This can lead to long delays spinning up new blockchain Full Nodes and the need for such full nodes indexing over data in the first place. Placing state into IPLD prolly trees changes the approaches available by enabling "Sparse replication" of large datasets as well as the option to seamlessly and efficiently merge arbitrarily large indexes between different sources. Prolly Trees being Content Addressed also enables applications to guarantee verifiability of data fetched from arbitrary sources. For example: A database built on top of a prolly tree can be loaded from a wide range of sources without readers needing to worry about tampering. Hashes of these datasets could be referenced in Academic and AI contexts without also needing to give access to the full dataset. We've started an initial project in this direction called the Prolly Tree Oracle [^13] which enables Blockchain applications to interact with IPLD Prolly Trees using Solidity Smart Contracts, and we're actively looking for groups that would like to deploy similar setups for themselves.

## Parting Thoughts

This report goes over some of the considerations and future development avenues in IPLD Prolly Trees. Peer to Peer and Decentralized databases are powerful building blocks for all sorts of applications, and if this is something you'd like to learn more about on build with, please join our [Matrix Channel](https://matrix.to/#/#p2p-deebees:mauve.moe) or send an email to contact (at) mauve.moe

## References

[^1]: IPLD Prolly Tree Spec [link](https://github.com/ipld/ipld/blob/776b537e0d16dc0341f1bec13ee79bd05a0dfb9e/specs/advanced-data-layouts/prollytree/spec.md)
[^2]: Merkle Search Trees: Efficient State-Based CRDTs in
Open Networks [link](https://inria.hal.science/hal-02303490/document)
[^3]: Noms Technical Overview by AAron Boodman [link](https://github.com/attic-labs/noms/blob/master/doc/intro.md#basics)
[^4]: Merkle Trees [link](https://en.wikipedia.org/wiki/Merkle_tree)
[^5]: B+ Trees [link](https://en.wikipedia.org/wiki/B%2B_tree)
[^6]: IPLD Prolly Tree Spec [link](https://github.com/ipld/ipld/blob/776b537e0d16dc0341f1bec13ee79bd05a0dfb9e/specs/advanced-data-layouts/prollytree/spec.md)
[^7]: Inter-Planetary Linked Data [link](https://ipld.io/)
[^8]: Prolly Trees - Dolthub [link](https://www.dolthub.com/blog/2024-03-03-prolly-trees/)
[^9]: CARv2 Specification [link](https://ipld.io/specs/transport/car/carv2/)
[^10]: Bitswap Protocol - IPFS [link](https://docs.ipfs.tech/concepts/bitswap/)
[^11]: Graphsync Protocol - IPFS [link](https://ipld.io/specs/transport/graphsync/)
[^12]: Delta State Replicated Data Types [link](https://arxiv.org/abs/1603.01529)
[^13]: Prolly Tree Oracle [link](https://github.com/KenCloud-Tech/prolly-tree-oracle/blob/main/README.md)