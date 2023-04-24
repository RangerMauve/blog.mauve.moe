# What is IPLD Anyway?

???

Thanks for coming out!
My name is Mauve,
my pronouns are they/them,
and today I'm going to be talking about this thing called Interplanetary Linked Data
and why you should consider using it in your decentralized applications.

## Content Addressed Linked Data

- It's Data
- That is Content Addressed
- That is Linked

???

So, Interplanetary Linked Data, or IPLD, is Data, that is content addressed, and is Linked.

Wow, who would have thought!

Let's look at what that means in more detail

## Data Model

- Everything: `Node`
- Scalar: `Null`, `Integer`, `Float`, `String`, `Bytes`
- Recursive: `List<Node>`, `Map<String, Node>`
- `Link<Node>` aka CID

???

At the core of everything IPLD is the IPLD data model.

This is an abstract specification of the kind of data that may be represented.

At the core is the abstract `Node` type, any piece of data is a kind of Node.

More specifically, a node may be a null value, an integer or floating point number, a (usually unicode) String, or an array of bytes.

These are the "scalar" values in IPLD.

Next, we've got Recursive kinds which can themselves contain other types.

This consists of lists of any other node type, or Maps that point from a key value to any of the node types.

Finally, there's the Link data type, which is pretty much the same thing as a Content Identifier or CID if you look elsewhere in IPFS.
This is what we use to link to other blocks of IPLD data.

Together these data types can be used to represent most kinds of data that applications might use in the wild.

## Codecs

`Node` <= `Codec` => `Block`

???

Now, although the data model is useful to represent arbitrary data in memory, we also need a way to represented on disk or when sending it over network connections.

This is the role that Codecs play.

They take Nodes in the abstract data model, and convert them into Blocks that can be referenced and sent around.

You can then take that block, and convert it back into a Node.

## Content Addressibility

`Block` = `Bytes` + `CID(codec id, hash function, hash bytes)`

???

This is also where the content addressibility comes in.

When a codec convers data into a block, it will generate a Content Identifier for it by taking the codec id, a hash function, and calculating the hash of the data.

This, if you have the bytes and the CID, you can verify that the bytes match the CID, and you know which codec to use to decode them.

## Linking

```JavaScript
link1 = encode({hello: 'World'}).cid

link2 = encode({message: link1}).cid
```

???

The CID is also how we do the linking portion of Linked data.

Whenever you want to link to another Node, you can point to It's CID.

In this example you can see how I get the CID of a block of data, then link to it inside another block of data to get a final link.

## Merkle Trees

- Content-Addressed
- Immutable
- Verifiable
- Traversable

???

This type of data structure is called a Merkle Tree.
It's used all over the place in distributed systems since it has nice properties like being content-addressed, immutable, verifiable, and traversable.

## Traversal

```
link1 = encode({hello: 'World'}).cid

link2 = encode({message: link1}).cid

result = traverse(`${link2}/message/hello`)

result === 'World'
```

???

Speaking of traversal, that's something IPLD can do for you too.

Given the tree we saw earlier, we can take to CID of the root block, and have a function that follows a path starting at the node, to the final node that it points at.

This syntax saves you some trouble of linking to deeply nested data and can be used in combination with CIDs to share data in a network.

## Lenses

`Lens(Node) => Node`

???

The next bit that IPLD adds is the concept of "Lenses" over top of IPLD data.

Lenses map a given IPLD node, to another shape of IPLD node.

This can be useful for verifying contents, making data more legible, and working with complex data types in ways that are standard between applications rather than needing to reinvent them each time.

## Schemas

```
type MessageType enum {
  | 'SYN'
  | 'ACK'
  | 'SYN-ACK'
}

type Message struct {
  type MessageType
  data Bytes
}
```

???

The first lense that you might use is the IPLD Schema spec.

This consistes of a human readable syntax called the DSL, as well as a canonical IPLD representation called the DMT.

One of the purposes of the schema is to have a reusable way of representing IPLD data which can be verified accross different languages and applications.

You can define a set of types that your application will support, and other implementations can use it to verify that they are correctly generating and parsing those types.

It can also be useful as documentation for Data sine it gives you a quick glance at what the structure is without needing to decode it first.

### Schema Representations

```
type Message struct {
  type MessageType
  data Bytes
} representation tuple
```

???

The thing that makes schemas a lense is that they can not only verify data, but also do some declarative transportations via it's representation feature.

Representations enable your application to use nice interfaces like structs for your data, while enoding it using more space efficient methods like tuples which remove the need to store struct keys within the data itself.

### Advanced Data Layouts

- Arbitrary Code
- Schemas for Data
- Specs for how to construct/traverse
- Soon to be WASM
- E.g. HAMT / Prolly Trees

???

Finally, some things can be hard to represent in a totally declarative way.

This is where "advanced data layouts" come in.
They're specifications for how to structure more fancy data with sehemas, written descriptions on how to construct and traverse Nodes, and fixtures so that implementations may run tests against them.

Currently, you need to use handcoded implementations, but soon enough you will be able to use automatically loaded Web Assembly modules.

Some examples of ADLs are Hash Array Mapped Tries that are used to speed up filecoin state lookups, or Prolly Trees which are a useful structure for making database indexes.

### URLs

`ipld://CID;adl=HAMT/name;schema=CID;type=Message/subpath`

???

I've been puting all of this together in a new spec called IPLD URLs.

This uses the URL specification, and extends the pathing to be able to specify extra parameters.

With this you can specify that a Node at some point should have a lens applied to it like an ADL, or a Schema.

This is an experiment at the moment, but we're hoping to use this as the start of some higher level APIs for IPLD.

### IPLD Patch

```JavaScript
patches = [
  {op: 'add', path: 'hello', value: 'world'},
  {op: 'remove', path: 'goodbye'}
]

before = {goodbye: 'cruel world'}
after = patch(before, patches)
after === {hello: 'world'}
```

???

Finally, even though I mentioned earlier that data is immutable, we happen to have a way to mutate data via the new Patch spec.

This is based on JSON-Patch which is used to add/remove/move values in JSON objects.

With this you can have a set of operations encoded in IPLD, and pass them to a patch function which can determenistically apply them to a Node and get you back a new result.

These operations support traversing arbitrarily deep graphs, and can be a nice alternative to manually mutating graphs using imperative programming.

## That's IPLD, Baby!

- Data Model
- Codecs
- Linking
- Traversal
- Lenses
- Patch

???

So, that's IPLD, Baby!

The nice thing is that you can use as little or as much as you want for your applications, and a lot of the IPFS ecosystem will have a dependency on these specs one way or another.

## Is it IPFS?

`IPFS = Libp2p + UnixFS(DagPB(IPLD)) + Custom Traversal`

???

So, is IPLD IPFS? How do they relate?

Even though IPFS uses CIDs and Codecs, it's actually a bit more complex.

IPLD on its own doesn't determine a method of resolving blocks, and IPFS makes use of libp2p to find and advertise them.

As well, IPFS focuses on a different data model called UnixFS which is built on top of the Dag-PB codec as well as some custom traversal functions.

## Interlinking

- Link to Git Commit from IPLD
- Link to BitCoin Blocks
- Link to Etherium
- Link to BitTorrent InfoHashes
- Traverse accross them

???

One cool thing about IPLD being decoupled from IPFS is that it can be used to represent all sorts of linked data by adding new codecs.

This enables things like linking to a Git commit from IPLD,
Linking to BitCoin blocks,
Linking to Etherium smart contracts or NFTs,
Linking to entire bittorrent infohashes and trees,
and you can traverse the data accross all of them.
All you really need is a link system that can recognize how to load those blocks, and codecs for encoding and decoding each type of data.

## Why? 🤔

- Interoperability
- Verifiability
- Distributed Databases
- RDF + ActivityStreams

???

So why is this useful?

The coolest bit to me is that it makes it easy to have interoperability of data long with verifiability.

This is a nice building block for things like distribute database for peer to peer and blockchain use cases.

IPLD also gives us a bridge between peer to peer and content addressed systems and formats like RDF or ActivityStreams which have a long history and ecosystem of representing and interoperating data.

If you're making a distributed application, you likely care about these things, and IPLD is a tool being developed to serve your needs.

## What's Next?

- Growing our team
- Rust implementation
- Better docs
- Higher level APIs

???

So, now that we all know IPLD, what's going on next?

Right now we're looking at growing our team to improve the state of Rust implementations for things like the FVM or for WebAssembly use cases.

We're also going to be updating our docs to make them more accessible and to have a more straightforward onboarding ramp for people wanting to use our tools.

Finally, we'll be looking at offering options for higher level APIs that expose all of IPFSs power for regular users, while leaving the underlying core available to hardcore developers that need it.

## Make something!

???

So, I hope this has given you a better view of what IPLD is and why you should care about it.

Now go out there and make something!
