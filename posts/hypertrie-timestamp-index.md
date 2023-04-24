# Hypertrie Timestamp Index

**Side note:* The ideas written here have been implemented in the [hyperbeedeebee](https://github.com/RangerMauve/hyperbeedeebee) module.

One common case I see in append-only-log based p2p application is the need to index data.
Essentially, the application will use the p2p network to connect to peers, then load all their data, process it, and save it to a local database that can then be queried.
The UX of this pattern ends up feeling a bit clunky to me in that users have to wait for all this loading and indexing to happen.

Specifically I'm thinking of projects like [Secure Scuttlebutt](https://scuttlebutt.nz/), [Cabal](https://cabal.chat/), and [Fritter](https://github.com/beakerbrowser/fritter).

Two things that they have in common is that they have a series of posts ordered by timestamp and each post has a "type" which is used for filtering / searching.

## LevelDB indexing

Most of these use some sort of library that wraps over [LevelDB](https://github.com/Level/awesome).

The interface for LevelUP is a key-value store with range queries. So you can put a value into the store at a given key, get the value for a given key, and scan through the keys alphaneumerically starting at a certain value and going to a certain value.

Indexes are built on top of this by using prefixes in keys and relying on the sort order of scanning.

E.g. if you have the following data:

```
user:alice
user:bob
user:eve
```

You can scan through the list and get all things that start with `user:` and are less than `user:c` and get back the values `user:alice` and `user:bob`.

Similarly you could have an index based on timestamps for:


```
post:123903271238907123
post:133903271238907123
post:143903271238907123
```

And search for posts greater than `133903271238907123` (say it's the last time you loaded posts).

This is handy for local databases, but sadly we don't have anything like leveldb that can be loaded sparsely over the p2p network.

That's why these modules need to download all the data, and then process it into the index for it to actually be useful (the alternative, scanning through all the raw data is very inefficient).

## "Rolling Hash Array Mapped Trie" - Hypertrie

A cool new module we have in the Dat ecosystem is [Hypertrie](https://github.com/mafintosh/hypertrie).

I'm not a computer scientist or a mathematician, so I'm not going to try to explain what a HAMT is, but feel free to search it up on Duck Duck Go.

Much like LevelDB, it's also a key-value store.
You can put values for a key, and get the value for a key, but instead of doing range queries on the entire key space, it uses a sort of directory structure.

For example, if your keys look something like:

```
/users/alice
/users/bob
/posts/helloworld.md
```

You can query for the contents of `/users/` and get back the list `[alice, bob]`. What's cool is that this lookup is performed by sparsely loading chunks of the append-only-log that the hypertrie uses for storage.

One caveat is that the efficiency goes down if you have a lot of items within a directory.
You can't scan for these keys alphabetically because they are [hashed](https://en.wikipedia.org/wiki/Hash_function) before they're stored.

Thus, if you want to build up an index where you sort through things, you'll want to set up intermediate folders to refine the search rather than scanning through the list of keys like you would with LevelDB.

## Timestamp Indexing

With that in mind, I've been thinking of how we could leverage the sparse replication properties of hypertrie to load data while working within the constraints of the HAMT.

I propose using a structure that looks something like this:

```
/TYPE/YEAR/MONTH/DAY/HOUR/MINUTE/SECOND/TIMESTAMP
```

The `TYPE` would be up to the application to decide on (or be optional if you don't need it), then your application can decide on how fine-grained the timestamp boxing should be based on how frequently it expects data to be added.

If your data is something like the [Dat Newsletter](https://github.com/datproject/newsletter), you probably only need to track the `YEAR`s since you won't have too many entries per year.
Applications like SSB might want to box things down to per `DAY` since users are less likely to post thousands of messages per day (might be wrong though!).
A real-time chat like Cabal might want to go down to the `HOUR` or `MINUTE` so that you can quickly load the latest content that people are chatting about and quickly jump back through history.
Something like server logs might want to go down to the `SECOND` if you have loads of logs you want to efficiently sift through.


## In Practice

With this as your building block your application can add stuff to it's local store with an API like `add(type, timestamp, data)`, and can search through the DB with Async Iterators like `for await(let data of search({type, start, end}) process(data)`.

One could imagine loading a client for a social media app, and then trying to load feeds for their friends and loading their latest posts first before scanning further back in history.
If you share the raw DB between applications, they can load the subsets of it that they need locally without needing to index it themsevles or do anything fancy to the datastructure.

Combining data from multiple sources could also be feasible. One could walk the tree from multiple stores at once and emit data from them in sequence.

The data stored in the store could either have the raw data that the application expects, or the application might be using a separate append only log for the full data, and would just store the start and end indexes in the hypertrie.
You might also have a secondary index stored in the tree which would contain the key to the main data.
Check out other datastructures like [hyperdrive](https://github.com/mafintosh/hyperdrive) to see how they use hypertrie for inspiration.

Overall, this approach could improve load times, and reduce the amount of indexing that needs to be done overall. Hopefully resulting in nicer UX for both develoeprs and users of P2P applications.
