# Graph Editing

This post goes over my ideas for editing graphs.

## Goals

- Focus on Code graphs (ASTs)
- Define common set of useful operations
- Make a tool for loading a graph and operating on it

## Operations

### Basic graph operations

- *vertex insertion* to introduce a single new labeled vertex to a graph.
- *vertex deletion* to remove a single (often disconnected) vertex from a graph.
- *vertex substitution* to change the label (or color) of a given vertex.
- *edge insertion* to introduce a new colored edge between a pair of vertices.
- *edge deletion* to remove a single edge between a pair of vertices.
- *edge substitution* to change the label (or color) of a given edge.

## Resources

- [Graph Edit Distance](https://en.wikipedia.org/wiki/Graph_edit_distance), lists some elementary operations
- [Combinatory Logic](https://en.wikipedia.org/wiki/Combinatory_logic), lambda calculus is about creating graphs of relations and transforming them so there should be operations in there I could use.
- [SKI Combinatory Calculus](https://en.wikipedia.org/wiki/SKI_combinator_calculus), like a more minimal alternative to Lambda Calculus.
- [Splay Tree](https://en.wikipedia.org/wiki/Splay_tree), defines some interesting tree operations like Zig/Zig-Zag
- [Universal Abstract Syntax Tree](https://github.com/cqfn/uast), attempts to make a spec for AST nodes that can be reused between different languages. Useful inspo for thinking about universal graph transformation operations.
