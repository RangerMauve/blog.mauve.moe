# Federated Meets P2P

ActivityPub is an exciting spec that's created a wave of new software to be built for federated social media.

Essentially, all social media platforms have some concept of "accounts" making "posts". Each platform might have their own way of representing this data in their databases, but at the end of the day it's pretty much the same.
ActivityPub defines a standard that servers hosting a users social media content can use in order to allow them to interact with each other.

For instance, if I've created an account on a particualr [Mastodon](https://joinmastodon.org/) server, then I can still follow people and interact with them if they have accounts on [Pleroma](https://pleroma.social/) servers.
Now, if you're not a fan of the direction a particualr host is going, or don't agree with what they want for the community, you can easily switch to a different host and bring all your content with you.
Likewise, you don't _have_ to create an account on a particular host in order to interact with it's residents.

Think of it like being able to talk to people on Twitter from within Tumblr and vise versa. Your identity and content can be shared across platforms, and you get more choice for migrating if you need it.

Overall, federation gives people more choice and helps drive innovation, however it still has some potential problems.

## It's still basically centralized

Now, an important thing to note about ActivityPub and the software that implements it, is that even though it's more distributed, it's not fully decentralized.
It's a lot more decentralized than having three or four major platforms that have all the control, and it gives you interoperability, but it stil relies on these central hosts that people need to connect to.

However, ActivityPub doesn't avoid any of the pitfalls of having a central authority controlling accsess to your data.
If an AcitivtyPub instance admin wanted to, they could see everything you're looking at and any messages you're sending.
An admin could potentially censor or manipulate the content you see without your knowledge.
If the server is down, your content is no longer accessible and you can't use the service.
If you're having internet connectivity problems, you won't be able to view or post anything until it's stable.
Likewise, if you're offline, you can't load or post anything.

## P2P and Encryption is the answer.

A solution to some of these problems is to use peer to peer applications instead of ones that rely on servers.

The idea is that instead of sending your content to a central server and having others download your content from that server, you create a peer to peer archive (like a torrent), and have people download your content either from your comupter directly, or from the computer of someone else that has that content.
Then, if you want to create new content, you add it to your archive and sync up with whoever is interested once you'r able to connect to the internet.
As well, if you want to access some content, once you've downloaded it, you have it available to you offline, and you then help share the load of getting other people to load it.
As a result, any applications built in this ecosystem are offline-first, can work over local wifi without internet if two people are trying to communicate, and as content becomes more popular, more people will be helping share the load of actually loading it.

Next comes the problem of keeping things private. The way existing social media works is that you send all your data to a third party, and have to trust them to not do anything too malicous with it.
Of course, we all know by now that companies are doing sketchy things with our personal information, and we can't do anything about it because they own all our data.
In the p2p web, this situation gets more crazy. Anything that's downloadable through the p2p web is now potentially public forever.
However, this means that application developers will have to think harder about how things should be kept private even if they're out in the open.
This is where encryption comes in. The cryptography world has gotten pretty far, and we now have high level tools like [libsodium](https://github.com/jedisct1/libsodium) which provide high level cyrpographic functions which protect developers from making common mistakes.
If a developer wants to encrypt some data that only a persons contact can see, they can use a [sealed box](https://download.libsodium.org/doc/public-key_cryptography/sealed_boxes) crypto primitive to encrypt the content so only the contact can ever decrypt it.
These primitives give stronger guarantees for privacy and combined with the offline-first and p2p approaches to sharing content, you can now share content, securely, and not worry about third parties analyzing you and selling your data to advertisers.

## It still has some problems

Sadly, p2p technology has some downsides compared to more centralized services.
The main issue is that if there's nothing online sharing your piece of content, then new peers can't download it.
This seems obvious, but it's the main distinction from centralized services where they try to guarantee (and often still fail) that something will always be online to serve your content.
Thus, for content that's nto very widespread, you'll need to either set up your own device to be always online, or get a third party to act as a permentant peer for your content (whether for free or paid).
This situation is still better than the big centralization case since you have options for how your content is kept online, whereas with centralized data storage options (not just social media but stuff like Google Drive or Dropbox), require a bunch of manual effort to switch hosts.

Another big problem that p2p apps face is search and discoverability.
With centralized services they can set up huge databses and have interfaces that let users search through them.
This is how people can quickly find posts about their favorite fandoms on Tumblr, or how you can quickly look up a user's profile by their name.
With the p2p web, there is no central database to search through since everyone keeps track of their own data and just the data of the people they follow.
I'm not sure what the correct solution to this is. In some cases this is almost a feature since you can focus on growing communities based on actual human interaction rather than having people thrown in your face all the time.

One idea I had is that centralized services could still exist for the purpose of indexing. Google could still exist largely unchanged. The only difference would be that it would load content from the p2p web, and have links for p2p protocols instead of HTTPS.
This also opens the door for competitors to Google to arise to build p2p search engines. They could build up their own search indexes, and potentially publish their indexes in a p2p archive so that people could share the load of loading the index rather than hitting the same server over and over.
This isn't ideal if you need to contact a centralized service, but it could work if content is distributed on the p2p network. Any searches you made in the past would still be cached locally, and you could potentially download parts of the search index from people in offline environments.
These search indexes don't have to span the whole p2p web, either. Somebody could make search indexes that index a particular social media application, or have a very specialized type of content that they look for.
This could also be the way companies that create p2p applications can monetize their creations.
You get the app for free since you own your data, and you pay for hosting it. But you can pay a service to keep your content up and to enable people to search for you.
The beauty of this is that even though a particular company might offer the service to start, anybody could host their own since the users are the ones in control of their data at the end of the day.

Another option would be to build up p2p search indexes.
Luckily, I'm not the first person to propose people use p2p technology, so there's already projects out there that are trying to solve these problems.
I don't know the details of how these projects operate, but feel free to look at how something like [YaCy](https://yacy.net/en/index.html) works.
Essentially, there's a peer to peer network where the users index data they they encounter and they communicate with each other to build up the index.
This removes the centralization of indexing content and spreads the load across volunteers that want to help with the effort.
The more people participate in the project, the less the load is on everybody to actually do the indexing.

Finally, applications always have the option of setting up local indexes.
Since you'll be loading content onto your machine in order to view it, it might make sense to build up local indexes, or to manually search through the content you have.
The main limitations here are going to be the amount of space you have for loading content on your device, and the amount of computation time users are going to want to put up with in order to do a search.

## There's a middleground

I think it'd be really cool if the p2p space and the federated space smashed together.

Apps that use ActivityPub should be taught to publish and read content from the p2p web, and p2p apps should have gateways that talk to the federated web.
It'd be cool if somebody enabled a mastodon-equivalent where you register an account by pointing it to your p2p archive with your posts.
And enabling people from the fediverse to send messages to you by contacting your server.

You'd get the always-online and search benefits of ActivityPub servers, with the offline and encryption-first benefits of P2P.

Hybrid clients and servers wouldn't be too crazy to build, and they'd help people gradually transition from a world of centralization, to federation, to full decentralization and p2p.

## How can we get there?

Of course, there's my favorite projects pushing the idea of the P2P space: [Beaker](https://beakerbrowser.com) and [IPFS](https://ipfs.io/).

But I think that one project which hasn't been getting much attention could be really useful. Namely, [WebTorrent](https://webtorrent.io/).
It has the benefit of reusing the existing protocols and network from BitTorrent, with the added benefit of working inside browsers _today_.
The only thing it's really missing is to add the ability for people to update their torrent contents through the [Mutable Torrents](http://www.bittorrent.org/beps/bep_0046.html) extension, but that's not too crazy to implement.

Projects like [PeerTube](https://joinpeertube.org/en/) are already playing around with this concept for loading video content over WebTorrent.
What we need next is to make _everything_ loaded through WebTorrent, including the web pages themselves.
Once this is in place we'll have a truly peer to peer web, and will be able to enable people to create, share, and communicate directly, without having to rely on a big corporation to sit in between them.
