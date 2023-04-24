# The Network Is The CDN

Putting together some thoughts after talking to [@ttk314](https://mobile.twitter.com/ttk314). I never thought about approaching p2p systems from the network, so big kudos to him for sharing his idea.

The internet has been grea for connecting humans together, but it hasn't delivered on it's inital promises of decentralization and has led to large centralized services and weird hacks to work around network latency.

## How the internet works

- Every device has an IP address (don't worry about NAT)
- Make a packet with the destination IP
- The device send's the packet to their ISP
- The ISP then shoots the packet towards the destination IP
- It might get there eventually, or it might not

If the destination computer is offline, you get Nada.

This pushes people to make services that are always online, which leads to centralization.

Another consideration is that there are fundamental limits to how much data you can push over these hops, and limits on how fast it can travel.

[Here's an article about those limits](https://medium.com/@kilpatrickjustin/689c9a18fc75)

## What do applications need

When I want to get data somewhere, I care about having it arrive.

Ideally, I want people to have some sort of inbox to send data to, and an outbox I could send data from which others could consume.

When I make an application, I want to be able to create an outbox for sharing data with the world, and if I need to send data to another user, I want to send it to their inbox without worrying about how and when it gets there.

## Existing implementations

[Secure Scuttlebutt](https://www.scuttlebutt.nz/) is close to this ideal.

You get an append only log (your outbox), and send messages into it.

People you connect to will then replicate your log, and you'll replicate theirs.

In addition to that, you'll also replicate any other logs they have and vice versa.

This means that if you're following a friend, you can get updates for their log from mutual friends if they're not able to connect to you directly.

The big feature here is that you're not relying on connections and real-time data transfer to your peers.

You create your content, and it gets cached and transferred across the network automatically.

## Flaws

This approach works for certain applications, but it's not without it's flaws.

- You can't get messages from somebody you aren't following. You have to go through each message you follow and check if it's for you.
- You still need to be able to make connections to peers to exchange this data (adding network traffic)
- Overall it's pretty heavy because you need to cache everyone's logs locally which is a lot of bandwidth and storage. (also it takes forever to bootstrap into a community)

## It should be the basis

What if the concept was a foundational part of the internet?

Instead of having short-lived, but fast connections by sending packets as fast as possible, what if we instead had logs which got cached across the internet infrastructure.

You'd create a stream, say your twitter posts, and send them out to your ISP. You then share your equivalent of an IP address somewhere that people can see it.

Your ISP will store a copy of your posts and will be able to share them with the rest of the internet backbone the same way it would route your IP packets now.

Then, people can start reading from your stream by asking for it from their ISP instead of from your computer directly.

The internet backbone would then kick into gear trying to route to the nearest infrastructure that actually has the content. After it's fetched it'll be cached on some of the nodes that were traversed when the content was being fetched.

This should be built into the device's Kernel in the same way that TCP and UDP are so that the OS can handle these requests and application developers can focus on the high level usage.

With this in place, content that's popular will be cached in more placs and will be faster to fetch since it'll be more likely to be near your device.

## How the web does something similar

HTTP is the current basis for the web and it works by having know, central servers which listen for connections to ask for some content, and sending the content back in response.
This is great in that it makes it clear how to develop applications on it, but it sucks for caching since that content has to be sent over the entire stretch of the internet for every request.
If two people in the same room try to load the same YouTube video, it needs to be donloaded almost the whole way twice.

Wouln't it be nicer if the video got loaded over the internet once, and then the second one got served from a cache that was closer to the users?

Companies already do something like this via Content Deliver Networks that work by having loads of servers around the world that act as that cache.
This works just fine for Google and other huge companies, but it's hard to make this scale for the web as a whole.

That's where this internet-caching idea comes in.

## A possible approach

Instead of asking a server for some content, you can look it up directly by it's identifier from the internet.

This would need a new protocol to describe how individual files are supposed to be uploaded and downloaded from this network.
I think that Dat is a great example of how you can represent changing files over time using append-only-logs.
Essentially, you have a metadata feed about all the changes to files in your website, and a content log which contains the actual file data.

The identifier for a feed could be a public key which is used to sign each message in order to guarantee it's validity. This gets rid of some concerns from ISPs tampering with the content before it gets to you.

Your "inbox" could also use your public key, but the messages sent to it will be encrypted such that only you can decrypt it with the private key.

## Some concerns

- Censorship is a big problem on the internet and this system will be vulnerable to the whims of ISPs
- Not all content is treated equal, just like the current internet, companies are going to pay big bucks to break net neutrality and have their content prioritised over smaller companies and personal use
- Privacy is important. How are we going to prevent people from snooping on our cached feeds? (crypto, duh)
- What are the privacy implications of MITM being able to see all the content you're accessing? (metadata of the stream identifiers)
- How do you gurantee a stream will be cached long enough for it to be see by the people that need it?
- Will content be saved forever?
- How does searching for the content work?
- Naive encryption could lead to feeds being taken over irreparibly, will the protocol need to account for that?
- Can content be deduplicated across feeds at the caching layer?

## Long term

Once the biggest concerns are figured out, and ISPs have adopted the new technology, we'll be seeing new categories of applications that are faster to load content, are easier to build since they don't need complex centralized services, and potentially more secure since developers will need to use cryptography to secure data instead of trusting that their database won't get hacked.

Users will get the benefits of better speeds, and developers will be able to innovate faster without having to worry as much about how data is shared between users.