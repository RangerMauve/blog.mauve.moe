# HyperGodot

Hello I'm Mauve, a decentralized software consultant, and today we'll be looking at using dweb technology in videogames.

## Multiplayer Games

A lot of games benefit from being able to connect folks together to play in realtime and to share maps and data with each other.

## Cloud Bad

However, in order to enable this, developers often rely on servers somewhere in the cloud as a core part of their game.

This means that:

- Developers need to spend time and money to set up servers and keep them running and secure
- Players are limtied by which servers they can connect to,
  and ultimately have no control over their own data if they want to interact with the game
- Once the servers are down or unreachable, you can't play the game

## Peer to peer

What if we did multiplayer, but ditched the cloud?

We can do this by making use of peer to peer protocols mixed alongside regular game engines.

Instead of connecting to a server to send our movement data to friends, we can connect directly to each other, instead of storing our avatars in a single place, we can download them from any peer on the network that has a copy.

When the developer stops maintaining the game, we don't need to worry about it being unusable or our data and community disappearing.

No central servers mean that the game can keep going so long as there's players to play it.

## Hypercore-Protocol

In this case, we're using the Hypercore Protocol suite of nodejs modules.

I won't go into detail here, but it's a peer to peer file transfer protocol.

It encrypts data in transit and keeps it private from snooping by default.

As well, we can piggybback on top of the file transfer connections to send arbitrary messages for ephemeral stuff like content discovery and movement data.

All the hypercore-protocol stuff is conveniently encapsulated in a node.js based HTTP server so that any game engine can send requests to it to interact with data and the replication streams.

The HTTP API is based on the same URL sctructures as the Agregore Browser so code can be translated between the web and native Godot without much change.

- File sharing
- Private by default
- Arbitrary messages
- HTTP API based on Agregore Browser

## Godot

Even though the HTTP server is portable and reusable between engines, in this case we're focusing on Godot.

Godot is an open source game engine which has been gaining popularity.

It's permissive license and high level tools make it a great choice for folks getting into game development, and it also means that we don't have to worry about getting people to sign up for expensive licenses just to use peer to peer protocols in their games.

## Hypergodot

Hypergodot consists of high level Godot objects which can be used to spawn the HTTP gateway and to interact with it.

It provides example scenes for doing things like multiplayer, working with player data, and for auto-discovering active levels for game lobbies.

The idea is to make it as easy as possible for deveopers to integrate into their game without needing to mess with the nitty gritty details of how the peer to peer protocols work.

Instead of messing with networking code and re-inventing things from scratch, game devs can focus on their game and the data they want players to interact with.

`hyper://` + Godot = HyperGodot

## Future

- Godot 4
- Compile to Web
- Agregore support

## Thanks

I wanted to quickly give thanks to Stripe Studios for sponsoring this work.
A big thanks to the Godot community for their high level docs and awesome game engine.
And to the folks in the Agregore discord for helping me test stuff out (come join us!)
