# P2P Databases with IPLD Prolly Trees

???

Hey folks! Thanks for coming out.
I'm going to be talking about peer to peer databases, and specifically how you can build them on top of Prolly Trees.

---

## How are databases so fast?

Database = Query(Collections + Indexes)

???

So, before we get into Peer to Peer databases, lets have a recap on how databases can go so fast.
At the core most database engines are a query layer that abstracts over raw data that's stored in collections of items, and indexes that sit beside the raw data and let you speed up searches.

---

## Non-Indexed Queries

- Search through everything
- Filter based on criteria
- Sort after filter (or build up during)
- Skip + Sort requires full computation

---

## Database Indexes

- Additional "Views" beside "raw" data
- Can combine several properties together
- Sort happens before filter
- Streaming-friendly
- Seek to most relevant data

---

## B+ Trees

- Building block for indexes
- Key-Value Store
- Keys are bytes
- Sorted by keys
- Good for sequential reads

---

## B+ Tree Structure

TODO: Image of structure

![Source: https://en.wikipedia.org/wiki/File:Bplustree.png](https://upload.wikimedia.org/wikipedia/commons/3/37/Bplustree.png)

???

- Data is sorted and stored sequentially in "leaf nodes"
- Intermediate nodes are created that stitch together ranges of sorted keys
- You can replace individual leaves or intermediate nodes up to the root without needing to update the rest of the tree.

---

## B+ Trees are Order-Dependent

add key 1, delete 2, update 3

!==

add key 1, update 3, delete 2

???

One limitation with using B+ trees is that the order that keys get created or deleted changes the order that

- Non-Determenistic with Different Order
- Less suitable for distributed systems.

???

One of the downsides is that the order that you insert or delete keys can change the shape of the leaf nodes.
For example if you insert into a tree that had a key deleted before, or insert in a key that got deleted after, you could have different boundries between leaf nodes.

---

## Prolly Trees

B-Tree + Content Addressing + Determenistic Chunking

???

So! An alternative is to make use of another data structure.
It's like B+ Tree in that you use ordered key-value pairs with leaves that store several pairs.
However, instead of storing stuff as pointers in memory, each leaf and each intermediate node is content addressed (in this case using IPLD).
As well, when keys are being inserted into the structure, the boundries between the chunks are calculated using a determenistic algorithm based on the hash of the key-value pair.
This means that regardless of the order that keys are inserted, each peer would come to the exact same structure for their tree at the byte level. 

---

## Schema

TODO: Paste IPLD Schema

???

So, here's what it looks like at the Specification Level.

At the root of the tree we add some information about how the tree was chunked so that any peers wishing to add it or merge it with other trees can make sure that the chunking and encoding settings are compatible.
Each intermediate TreeNode has a list of keys, and a list of values that go with those keys.
It also has the `isLeaf` boolean that lets the application know whether this is a leaf node which contains actual values, or if the values are links to more TreeNodes.

---

## Construction Steps

- Add keys to a leaf node
- Check for chunk boundries
- Make a parent node, and sibling
- Add remaining keys to sibling
- Add current node and sibling to parent
- Repeat for sibling, then up to the parent

???

Here's the gist of how you construct a tree, or updating a portion of it.
What's useful is that it's a bottom up approach and you can build the tree as you ingest data.

---

## Chunk Boundries

threshold = 0x0100...

is boundry = hash < threshold

- hash(key2 + value2) = 0x00FF... (no boundry)
- hash(key1 + value1) = 0xACAB... (boundry!)
- hash(key3 + value3) = 0x0666... (no boundry)

lower threshold = larger leaf nodes

???

The boundries between leaves can be calculated based on a chunking threshold.
You take the hash of the given key-value pair, and if it's less than the given threshold then you know you need to put all subsequent keys into a new chunk.

---

## Indexing Data

`/` === `0x00`

```
/posts => metadata, schemas, etc
/posts/doc/{id} => {id, title, createdAt, tags, content}
/posts/index/createdAt-tags/ => metadata, version, field
/posts/index/createdAt-tags/{createdAt}/{tag} => {id}
```

???

So, from here you can stop worrying about the details as much and focus on the keyspace.
Here's an example of how you can segregate the keyspace.
You can have a top level prefix for everything related to "posts".
Then you could have a section for all the individual documents in your database.
And finally you can have separate prefixes per index.
With this you can do sequential reads on documents and indexes and avoid overlap between different collections within a single dataset.

---

### Index Ordering

```
/posts/index/createdAt-tags/{createdAt1}/{tag1} => {id1}
/posts/index/createdAt-tags/{createdAt1}/{tag2} => {id1}
/posts/index/createdAt-tags/{createdAt2}/{tag1} => {id2}
/posts/index/createdAt-tags/{createdAt3}/{tag1} => {id3}
```

???

For example, here's what an index with a few documents could look like.
We've got the timestamps from each post first, then we take the array of tags for a post and we split it into individual keys that also get sorted alphabetically.
Since everything is sorted by the createdAt timestamp first, a cursor can start searching at whatever time range the user wants to see.
From there, if a user is filtering by the tags in a post, the cursor can check if the document contains that tag without needing to fetch the entire document into memory.
In this example we have 3 unique document IDs, but imagine if you have a million and only care to show the most recent 50.
You can seek in the Prolly Tree to where "today" starts, and start searching through the posts index and show just the ones that are relevant.
Of course there's a bunch of other information that might be useful for a search so a given application will likely want to make several indexes to speed up loading.

---

## The Network is the Database

- Sync as you query
- Prioritize view data automatically
- Download more in the background
- Combine indexes as sparsely as possible

???

So! One of the neat parts is that loading data from a prolly tree is directly tied to loading data from the network in general.
As you query the keyspace, you'll be loading parts of the DAG using block exchange or graph sync.
With this, if you have a giant dataset you can load just the first few levels on an initial sync, and quickly dril down to which segments of the keyspace you want to load next.
The application can then download more data in the background once the initial view has been loaded in order to speed up queries and and have information available offline.
You can also merge large datasets together by doing a merge on the top most tree nodes and only combining the specific leaves that overlap to calcualte a new root.

---

## Let's build!

- [Github ipld/ipld#254 - Spec](https://github.com/ipld/ipld/pull/254)
- [Matrix Channel #p2p-deebees:mauve.moe](https://matrix.to/#/#p2p-deebees:mauve.moe)

???

So! Hopefully that's given you some more insight into how this stuff works and maybe sparked some ideas on how to build your own databases on top.
If you're interested, we've got a spec for how this can be implemented using IPLD, and we've got a Matrix channel where we've been chatting about peer to peer datbases in general.
