# Peer to Peer Databases

Peer to peer and decentralized applications have been popular lately, but almost all of them rely on synchronizing append only logs of operations (or an equivalent).
This leads to performance degredation over time as data accumulates and needs to be processed on new peers before they can start querying and updating data within an existing swarm.
This post will talk about how pre-indexed peer to peer databases can be built and how they can sidestep the need to process operation logs and query data more efficiently.
The short of it is that with this new data structure, the network becomes your database instead of needing to build a database after loading everything from the network.

## Operation Logs and their Limitations

Before we get into pre-indexed databases, we should talk about append only operational logs which are the basis of most current decentralized databases.
Most existing p2p databases like [OrbitDB](https://github.com/orbitdb), [SecureScuttlebutt](https://scuttlebot.io/), [Automerge](https://automerge.org/), or [Cabal](https://cabal.chat/)  work by having each users create a log of all the changes they're making to a dataset.
Each change that needs to happen or new piece of data that gets created is stored in an "operation" in the users log.
When a peer wants to load data they will start pulling changes out of the logs of other peers and processing them locally in order to arrive to the latest "state" of the dataset.
What's interesting is this isn't just the case of p2p databaes, but is also the building block of distributed databases in general like [MongoDB](https://www.mongodb.com/) or [CockroachDB](https://www.cockroachlabs.com).
In fact, most blockchains are just another case of databases that make use of append only operation logs, but with new ways of doing log consistency which distributes trust accross minors or validators.
At the end of the day it's all operation logs and some sort of mechanism for ensureing the consistency of the log and whether the DB can process operations in different orders to arrive at the same state.

This setup works well in that it separates the view of the data from how the data gets replicated and leaves a lot of room for how to manage consistency and fault tolerance in your system.
However, this setup works best for databases that are always online and have a relatively consistant set of peers to replicate to.
If you have large time ranges where two peers are unable to communicate, or if you have new peers joining and leaving, you end up requiring large amounts of operationst to be processed before a peer can actually make use of the data.

This can be see in in scenarios where somebody is following a lot of users with a lot of history in SSB and needing to wait for all the logs to be processed, or when a new database replica is added and needs to fetch all the existing state (whether it's a regular DB or a blockchain full node).
The new node will need to sit still and focus all of its resources on catching up with the append only log and updating it's local database indexes before it's able to do antyhing else.
Relying on append only logs leads to this scenario as your data grows and as the number of peers trying to consume the data grows and leads to similar situations accross all systems with this core building block.
You can attempt to optimize your core sync logic but as your data grows in either volume or frequency, you'll end up facing the same limitations.

One way to get around needing to "catch up" with a writer is to get "snapshots" of the current state of the data from trusted peers.
From there you can skip a lot of the extra processing and just load the new changes since your snapshot.
This of course presumes that you have a trusted peer and that they are in fact trustworthy, which isn't always possible in distributed systems (in particular p2p).
In some cases the snapshot might not be getting generated in time or might be so large that auditing it becomes infeasible.

Another approach is to split your data into multiple oplogs for different "regions" so that peers only need to replicate the data that is actually relevant to them.
This is used by certain databases like CockroachDB, by the "offchain" processing methods we're seeing in some cryptocurrency projects, and by projects like [PeerBit](https://github.com/dao-xyz/peerbit) which split up the logs for individual documents.
The Secure Scuttlebutt community is also looking at a new feed standard where they can split up users data into a bunch of sparsely replicated feeds.
Splitting up the logs can reduce the overall amount of operations you need to replicate, but for bits of data that have a lot of "history", you can expect to see everything getting slower and slower as time progrsses.
For exaple if you have a chat room with a multi-year history, if a new user needs to rely on append only logs to get the latest data, they'll have no choice but to sit there while it loads.

All of this together leads to either a centralization of power in long-lived nodes that do the replication for you (e.g. traditional databases, blockchains) and then give you access to the data as a "client" which needs to rely on the node to be truthful and constantly reachable.
For cases where an application doesn't have the ability to do this centralization (like p2p databases), you end up getting performance degrdation as your data grows.

So, what if instead of append only logs where we fully replicated data, we instead worked with the final data itself and only ever loaded just the bits we needed regardless of where the data is coming from.

## How Databases Create Indexes

Although typical centralized (in terms of control + trust) usually build on top of append only logs, applications that use them don't need to worry about that detail and typically only worry about fetching the latest data using search queries.
All an application need to know is that there are collections of documents (or tables of rows) with some sort of properties it's interested in, and how to search through those documents by their field values.

For example, instead of an application getting a list of every single post in a database and filtering based on the "tags", they can say `Get me the first 32 posts with the tag #cats` and the database engine will figure out how to do that for them.
This is further sped up by the database by storing not just the raw documents, but also "indexes" of certain properties that the database engineer expects will be used often.

Database indexes are typically built on top of [B+ Trees](https://en.wikipedia.org/wiki/B%2B_tree) which are like "key-value stores" where you can associate a value with a certiain key, where the keys are sorted lexically.
This is combined with specially crafted keys so that you can sort data by the key.

For example, if you have data with a "date" that has a year/month/day, you can imagine a range of keys that looks like this:

```
2022/12/01 => id1
2022/12/02 => id2
2023/01/01 => id3
```

When a document is inserted into an indexed collection, the database engine will fetch the indexed properties and add them into the B+ tree in their appropriate slot.
Then if you want to perform a query like "Give me all the posts in December 2022", the database can quickly seek to where the prefix `2022/12/` is stored in th DB and start iterating through them for the query.
Note how an index can store multiple properties at once so that you can say both sort stuff by time and by whether it contains a certain tag like `{type}/${time}`.
What's more, this will exclude any documents that don't have the `date` field and skip needing to think about them for the application at all.
In fact, if your query can avoid fetching the document from the DB at all if all of the fields it requires are within the index.

If your query relies on fields that aren't indexed at all, this forces the database to do a search through _all_ of the documents in order to satisfy your search. In particular if you're attempting to sort results by some value, your database has no choice but to do complex gymnastics to make it happen on the fly.

Database enginners will typically work along side developers in order to craft indexes that will make the overall performance of the database swift for the kinds of queries the application needs.
Without efficient database indexes, you end up having inefficient and sluggish apps or API servers.

What's cool is that we can take these concepts of databases and databases and apply them to peer to peer data structures.

## Hyperbeedeebee

Some of my first work along these lines was with the [Hyperbeedeebee](https://github.com/RangerMauve/hyperbeedeebee/) project which a client commissioned me to make for the [USHIN](https://ushin.org/) project.
It's built on top of [Hyperbee](https://github.com/hypercore-protocol/hyperbee/) which is a p2p B+ Tree that is in turn based on [Hypercore](https://github.com/hypercore-protocol/hypercore/) which is an append only log.
Hyperbee treats Hypercore as a sort of "append only memory" where it can add nodes within it's B+ Tree and have the latest root of the tree stored in the latest block of the core, with the ability to load additional nodes by referencing them from their index in the append only log.

On top of that, hyperbeedeebee treats Hyperbee as a regular B+ Tree to store key ranges in order to represent a MongoDB-like API with collections of documents and indexes on top of the documents.
Since I had learned from the database indexing in other ecosystems like [LevelJS](https://leveljs.org/), I was able to build up my key space based on an [initial design document](https://gist.github.com/RangerMauve/ae271204054b62d9a649d70b7d218191).

Collections are identified via a `name` which is used as a prefix for all the data within a collection.
Underneath that, there is another prefix called `doc` for the documents being stored in the collection, and another for the `idx` indexes.

For example, you might have a collection of `people` that have a `name` and an `id`.
From there lets suppose there's and index for the `name`, and two people: `alice` and `bob`.
Our keyspace will end up looking something like this:

```
/people/doc/0 => {_id: 0, name: "alice"}
/people/doc/1 => {_id: 1, name: "bob"}
/people/idxs => [["name"]]
/people/idx/name/alice/0 => 0
/people/idx/name/bob/1 => 1
```

For the acutal representation I added code for generating index keys using CBOR encoding to make the ordering of different data types consistent, and used BSON for encoding the documents themselves.
And on top of that I created a MongoDB-like API for creating collections and querying their contents.

This works pretty well in that large datasets can be ingested into hyperbeedeebee and queried sparsely on a remote peer without that peer needing to fully have the database stored locally.
You can think of this approach as being similar to having the B+ Tree with your keys authored on any remote device but loaded as though it was local.

Even though this approach works great, it has some limitations when it comes to loading data from multiple authors.
Hypercore is inherently single-writer due to it's append only log structure, and while they have [some work on multiwriter](https://github.com/hypercore-protocol/autobase) it's very tied to the data model and wasn't stable at the time of writing this.
This means that for collaborative use cases you need to somehow query all of your peers' databases at the same time which can add a bunch of overhead when you're querying more than a few dozen hyperbees.
It also means that data that's duplicated between two hyperbees needs to be manually handled at the applicaition layer.

After getting hyperbeedeebee in place, I started looking at some similar structures based on content addressibility which is how I came accross Prolly Trees.

## IPLD Prolly Trees

I first saw Prolly Trees mentioned in [this blog post on Peer-to-Peer Ordered Search Indexes](https://0fps.net/2020/12/19/peer-to-peer-ordered-search-indexes/) and it changed how I thought about data in distributed systems in general.
Similar to B+ Trees, prolly trees store ordered key ranges in a tree structure.
Unlike B+ Trees they use content addressibility and probibalistic chunking to determenistically generate the tree structure.
In practice this means that the same key-value pairs will generate the same tree structure regardless of insertion order and one can combine two trees determenistically.

Everything that can apply to B+ Trees and database indexes, can now apply to Prolly Trees with the added ability of it being p2p, sparsely loaded, and mergable.
In particular, when merging two datasets, you can easily skip over blocks that are the same on both sides without having to traverse into a tree, you can also insert entire ranges that are new into your tree withut having to fully traverse the individual items within.

I'll go over the specific use cases for these properties in a bit, but in general it gives us a new way of working with data regardless of the kind of application you're building.

## P2P DBs

With prolly trees as a building block applications can start presenting their data as entire databases rather than having to use operations and then generating local databases from them.
In general, a database can have one or more "collections" of "documents", and each collection can have 0 or more "indexes" to make querying over properties for documents more efficient.
What's cool is that this idea can extend to all sorts of databases and document structures.
SQL tables can fall into this paradigm by having the schema for rows strictly enforced and available.
We can store RDF data as triples and perform SPARQL queries over top of it.
One can store datalog-compatible data on top and query with that.

Ideally, this can be an opportunity to build a specification for "peer to peer databaes over IPLD Prolly Trees" where can can agree on how to structure the keyspace for the core use case, and start building tools on top of the spec that specialize on certain shapes of documents or certain patterns for querying them.
With this we can get support for graph databases, MongoDB type databases, or whatever funky thing you can think of.
Having a specification can also enable us to create tools for exploring and working with datasets that can be reused accross the ecosystem.

Using IPLD also brings us advantages outside of content addressability.
At its core IPLD has a high level "data model" for representing data, and that data model can use "lenses" to wrap over IPLD node and expsoe them as different types.
For example, if we have a standard lense for encrypted IPLD graphs, we can treat an encrypted tree as though it were unencrypted within the application, and have the IPLD engine automatically encrypt/decrypt data as we use it.
Specifically, this means that we can take the work from projects like [Webnative Filesystem](https://github.com/wnfs-wg) on encrypting IPLD trees, and reuse it for IPLD Databases.
Similarly, any code that adds news ways of synchronizing and exproting IPLD data can be reused in any projects that want to use p2p databases.
Overall, there's a lot of potential to get people up and running with their data layer, so they can focus more on their application and the actual utility they are bringing to people.

## Use Cases

So, speaking of utility, I'm hoping that you now have a bit of a picture of the approach to peer to peer databases that I've been descriping, and you might already be thinking about how you can apply them for your use cases.
In talking to folks I've come accross a few common use cases and have thought through some of the implications that using p2p databases would bring.
I'm going to go through some of the more common and obvious ones, and hopefully by the end you'll be thinking more concretely about your personal contexts.

### P2P Social Apps

A lot of social P2P apps right now use the append only logs method of synchronizing data and end up having large histories if they actually get used for a long period of time.
Generally these apps also have users coming in and out from the swarm frequently and being offline for long periods of time.
This leads users to commonly face the downsides of using append only logs.
New users have to sit and wait for their databases to sync (sometimes for minutes, sometimes tens of minutes), and users that haven't been online for a while can still need to sit around a bit to get up to speed.
Very active users that might be in a bunch of chatrooms at once will have that initial load multiplied by each chat they're participating in which can lead to sluggishness (see Matrix chat clients when you're in hundreds of rooms with thousands of people).

If these apps instead used p2p databases, they could drastically improve the initial load times.
Instead of waiting for all of the history to sync, a client can focus on getting the set of most recently active users, and query their indexes for just the messages that are needed to render the current view.
Detecting notifications like mentions or "new messages" can also be done by comparing your last seen state of somebody's index with the latest one.
The app can then pull just the notifications since the last load (or last "marked read") or ignore those indexes entirely if a user has notifications turned off for that channel.

Once the intial load is in place and a user is set up to see the latest data, their client can then start slowly backing up more messages from peers to populat a chat history and help improve replication if the user wants their client to keep more messages available for offline use.
In fact, using indexes within your data gives applications fine grained control over what data they do or don't want to have available locally.

Depending on how you structure your post verification, you can make use of the prolly tree merging to combine users indexes togehter and perform searches accross the entire DB keyspace at once.
This can simplify a lot of the code for querying data for views, but it comes with the tradeoff that you'll need to build more trust into your system so that users can't pretend to author posts on behalf of others.
Generally you'll need to use public key cryptography to "sign" posts in addition to their data in order to verify the author's identity.

In general, developers can now use similar approaches to talking to "backend" databases, but skip having to actually set one up and pay for the maintenance that it requires.

This is also where encrypted DAGs would come in handy.
If you want to have private groups or DMs, the easiest way to represent them is to have separate encrypted prolly trees and tie the users identity to whatever ones they're participating in.

There's also room to explore peer discovery around things like "tags" that people are talking about and to figure out how to send a message to somebody that isn't already aware of your existence on the network.
I've written about this in the past with my [P2P Inboxes](https://medium.com/@RangerMauve/p2p-inboxes-be0f02083223) post, and some of the tutorials I did using "gossip protocols".

Overall, changing how peer to peer apps can exchange and merge data can give us some clear wins on user onboarding and on performance in general.

### Blockchain State

Personally, I'm not a huge fan of blockchain based technology.
And one of the main reasons for that is just how many resources you need to get a chain running, and the centralizing effect that has on the network.
In order to run a (even a proof of stake based) full node you typically need hundreds of GBs of harddisk storage, a whole bunch of RAM, and a bunch of CPU power spinning away.
And once you have one, it needs to take a while to catch up with the chain, or use snapshots to catch up and keep going.
This means that setting up full nodes isn't something the average person will be able to do and leads to groups with more spare capital or technical knowledge to set them up.
For everyone else, they need to rely on other people's full nodes in order to query the blockchain state or post transactions (with exceptions that I'm not going to get into here).

As a result, most "clients" trying to use blockchains have to trust that the full node they're using isn't omitting data, and that it will be online fot them indefinitely.
These full nodes typically keep a local database (like postgres or the such) and have an HTTP API for clients to connect to and ask for state.
This HTTP API is where full nodes can impose arbitrary restrictions and start charing for access to the chain state.
For example, if you're trying to use metamask to access some data, or some NFT platform, they effectively control your access to the chain via their centralized management of these HTTP APIs.

With p2p databases, we can sidestep the need for these HTTP APIs and central-ish databases in blockchain ecosystems.
Instead of a blockchain existing to keep an append only log of blocks, and full nodes acting as indexers over that state in order to make it actually usable, what if the chain published both the latest block, and a link to the root of a Prolly Tree containing the indexes of all the data.

From there a client could talk to any node participating in keeping the chain running and do their actual query on the data by traversing the peer to peer indexes.
Instead of loading everything from a single node and depending on it to be online, a client can load subsets of the index from multiple nodes in paralell, and the more nodes exist in the chain the more available the data will be.

This can also be used to "prove" that a certain result was part of the blockchain state by linking to the root block, and the subset of the prolly tree which was used to satisfy the query.
From there one could send these proofs around to different systems which can have implications for inter-chain communication and sending proofs without needing to be fully connected to the chain.

Backups and fresh starts can also be improved in that a node can get the latest block from the chain and start loading the underlying prolly trees from the history while prioritizing blocks that are relevant to any smart contract calculations first.
To be specific, a node can execute code that relies on the state before having a full copy of the state by being able to load the part of the prolly tree it needs on the fly from the rest of the network.

Storage of the blockchain state can also be optimized thanks to the content addressibility.
If only a small subset of the index changed, then all the other nodes in the tree will remain the same.
It's kind of like compressing your DB right from the get go without losing the ability to roll back to earlier snapshots of your state.

To start, I'm hoping to work with the [Filecoin FVM](https://fvm.filecoin.io/) team to see if we can integrate Prolly Trees into their stack, and I'm likely going to reach out to some of the folks in the [Cosmos Network](https://cosmos.network/) via my collaboration with the [Hypha worker cooperative](https://hypha.coop/).

Hopefully this has given you a bit of insight into how we can change the state of blockchain state (ha!).
We can have new networks that are less dependent on central DBs, and therefore more resilient to outages and censorship.
And we can make chains more efficient to participate in and search through.

### Cross-Organizational Search

Another place where p2p search indexes would be useful is for indexing institutional data for text search.
Specifically, it could be useful for projects doing archiving of data using [WebRecorder](https://webrecorder.net/) to build up large datasets of crawled data.
At the moment, it's possible to index data from these sources using traditional centralized databases like [Elasticsearch](https://www.elastic.co/elasticsearch/), but this requires running centralized infrastructure and doesn't allow for sharing indexes between groups easily.
Often this is done via external companies like Google which come in and set up search indexing on the institutions behalf and results in the institution relying on paying the third party to keep access to their own data.

With p2p databases we can begin to build up search indexes collaboratively with community members, where individuals or smaller groups can participate in generating indexed data, and larger indexes being formed from combining the smaller ones.
For example, cultural institutions can start tracking data for use by their community, and they can also build bridges to other institutions in order to search through larger amounts of data without needing to delegate authority and ownership to a third party like Google.

This can apply outside of cultural institutions as well and can be used for curated search indexes for all sorts of use cases.
Communities interested in a given topic can collaborate on search via prolly trees, scientific publishers and communities can combine their data, etc.
Instead of having a centralized search engine like Google or Bing which is vulnerable to spam originating from untrusted and illrelevant parties, we can have smaller scale and more focused search indexes wich can be use and combined together based on who is interested in what.
This is some of the paths that we're hoping to explore with the [IPFS Search](https://ipfs-search.com/) team by taking their existing indexed data and finding ways to ingest it into prolly trees and perform searches over top.

### Big Data

Another place I'm excited to explore with p2p databases is the world of "big data".
At the moment people are coordinateing large cloud deployments to process and send data around.
Usually, due to the amount of central coordination necessary for making "big data" viable, this is all mediated through a central authority which controls access and exchange of data on their network.


Ingtroducing p2p databases into the mix gives us new ways of approaching big data.
In the first place it gives us a new way to scale out and shard large datasets accross multiple storage backends by storing subsets of a prolly tree accross several machines.
Decoupling the storage from the authoring and reading layer can make it possible to spin up different components within a single cloud or accross people's home machines.
Ingestion can be completely changed too in that instead of running ingestion on a single database or via some sort of map reduce cluster, one can split up sections of data to be ingested and indexed and combine the outputted prolly trees at a different layer accross many worker nodes.

Apart from scaling we can now have new ways of structuring data marketplaces where authors of datasets can encrypt prolly trees and sell decryption keys to others which can then process and refine the data and publish it themselves.
This sale and publishing can either be done via centralized marketplaces, blockchains, or manually coordinated contracts accross organiations.
In fact, having the underlying distribution and processing be decentralized can be a boon to making [Data DAOs](https://apo.org.au/node/318350) which manage and profit off of datasets.

One project I'm working with at the moment is [Pando](https://github.com/pando-project/pando) from [KEN Labs](https://github.com/kenlabs) which is planning on being an out of the box solution to aggregating and working with large p2p datasets.
At the moment we don't have clear use cases to point to, but we'll be optimizing different prolly tree configurations and working with other groups in order to find the best settings for read and write performance as well as distributed ingestion pipelines.

## What next?

So, the first part of the p2p database story in the process of being finalized.
We've got [an initial specification](https://github.com/ipld/ipld/pull/254) for prolly trees, and are working on spec based implementations in [Golang](https://github.com/kenlabs/go-ipld-prolly-trees) and another one in [Rust](https://github.com/ipfs/devgrants/issues/257).
From there we'll be working on creating some initial indexing libraries and exploring how databases can be built on top of prolly trees.

Ideally we'll be working with other groups (maybe you!) interested in this space on specifications for how collections of documents can be stored aling with their indexes over top of prolly trees, and working on libraries for ingesting data and querying over it with standard languages like SQL or Datalog.

Once we have some data being ingested, we'll be exploring how to tune the performance with different tradeoffs between tree depth, cache invalidation frequency, and write/merge throughput.

At the same time we'll be working with groups like Fission and their WNFS project to standardize encryption of datasets and access control based on users identity.

Personally, I'm excited for being able to set up spatial search indexes to pin data into decentralized virtual worlds and augmented reality overlays.

It's still fairly early in the process, but if you're interested in building the future of peer to peer databases, or using them for the future of decentralized applications, reach out to me by email, or come join us in the [Matrix Chat](https://matrix.to/#/#p2p-deebees:mauve.moe).

Last updated December 2022
