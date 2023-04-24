# Merkle DAG Presentation

Presentation about what Merkle trees are and how they're used in p2p applications.

## What is a DAG

- Directed Acyclic Graph
- "Directed" -> All vertexes have a direction in which they point
  - Diagram that shows nodes with no arrows
  - Same diagram, but with arrows showing direction
  - Example of undirected graph: graph of "friends". If I'm you're friend, you're my friend
  - Example of directed relationship: family tree. If I'm your parent, you're not my parent (hopefully)
- "Acyclic" -> If you follow vertexes, it's impossible to form a "loop"
  - Diagram with a cycle
  - Diagram without a cycle
  - Example of cyclic graphs: Representation of streets in a city. You can follow streets between intersections in a loop
  - Example of acyclic graph
- "Graph" -> The good stuff
- Basically, "DAG => Tree"
  - Diagram of a tree

## Where does the "Merkle" part come from?

## Content addressability
- How do I know that the contents of a file I downloaded are the same as the original?
  - Diagram of file transfer with devil emoji in the center
- Hashing!
- Use an agorithm that computes a value by reading the file byte-by-byte. If even a single byte is different, the resulting value will be totally different
  - Diagram with emoji in a list equaling another emoji
  - Same diagram but with one of them different equaling a different emoji
- If you get the hash of a file from a trusted authority, you can download the contents from an untrusted authority and easily verify its integrity

## Content addressability with DAGs

- Trees have a parent-child relationship
- Parents "point" to "child" nodes in the graph using vertexes
- In a graph that's stored in-memory, that vertex works by having references to the child nodes, but that has to change when you're trying to store a graph in a file or share it over the internet
  - Diagram with 4 nodes, and the nodes being in boxes representing linear memory
- What if a pointer to a node in the graph, was the hash of the node?
  - Same diagram, but instead of linear memory, have a little "hash()" thing in the vertexes
- This is a merkle dag.
- Some of the properties this data structure has
  - If a node changes it's value at all, this changes it's hash
  - The value of a node contains the list of hashes of it's children
  - This means that when a child node changes it's hash, all parent nodes change their hash too
  - If you know the hash of the root node, you can verify that child nodes belong to it
  - You can download just the subset of the tree that you want from untrusted sources, and they can't falsify data

## Where is this used

### Git (version control system)

- Git works with "objects" which are referenced by their hash
- When you track changes with git, it builds a merkle tree of the folder strucutre
- When you "commit" you make a new root node that points to the merkle tree for the staged files
- Git can quickly diff changes because it just has to look at those folder/files that have different hashes since the rest haven't changed

### Bittorrent

- Files and folders are split up into sections called "blocks"
- The chunks are then stitched togehter into a merkle DAG and the root hash is shared in a "magnet link"
- Peers that have the blocks, announce to the distributed network that they have the hash, along with their IP address
- Since you have the root hash, you can find the overall structure of the files needed to be downloaded by getting blocks from the DHT
- The actual file contents can then be downloaded through a similar method

### Blockchain

- A blockchain is just a Merkle DAG without branches
- Each "block" is a node in the graph that points to it's parent and has a list of transactions for the bitcoin network
- Thus, if you have a reference to the latest block, you can potentially look through the entire history
- What Bitcoin adds on top of this is "proof of work". They add a random number to the block and keep changing it until the "hash" starts with some zeroes.

## So what?

- Graphs are awesome, and Merkle DAGs are awesome, P2P networks are awesome
- When people hear about p2p applications, they often think of them as "magic", or really complicated
- "Magic" things are made of understandable parts, hopefully this peek behind the scenes of some of the magic software out there will inspire you to peek more and build things






