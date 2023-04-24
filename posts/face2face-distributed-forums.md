## Face2Face (f2f)

One of the killer apps that Dat is missing is a web forum where people can get together and converse without the need for any centralized servers.

Think of the early web where you'd have "Topics" with posts and threads that you had to refresh every few minutes.

### Why Now?

Being fully p2p was hard with Dat since you would need to have some sort of message channel to exchange Dat URLs with other people in your network.

One of the cool features that have come with the latest [Beaker 0.8.0 prerelease](https://github.com/beakerbrowser/beaker/releases/tag/0.8.0-prerelease.7) is the experimental `datPeers` API.

When you access a Dat, what happens in the background is that Beaker will search for peers that have the Dat content and connect to them.

This means that we're forming networks with other people that are interested in the data you're looking at.

The `datPeers` API gives you the ability to communicate with this network.

This gives us a way to find peers without having to rely on any centralized service.

### Then what?

The `datPeers` API allows you to broadcast some data to every peer you connect to. Say, a Dat URL for the posts you've made for your posts.

That way, you can look for peers that are also looking for your forums and start indexing their Dat URLs while they index your posts.

This can be extended by having peers write the URLs of others to their own Dat, which will then be indexed by everyone.

The end result is that everybody will have a list of all other peers' URLs and they'll all be indexing each others posts.

### Cool, how is this a forum?

Now that you have a way to get posts from everyone, you need to have an agreement on what the posts are.

The easiest approach would be to look at how [fritter](https://github.com/beakerbrowser/libfritter) does it.

People could have a `profile.json` to describe their accounts, and they could have a `/posts` directory for all of their posts.

Similar to how Fritter works, new "threads" in the forum would be posts that don't have a parent.

Replies would all link to the parent post.

The post contents would be written in markdown, and would use the same "mentiones" array as fritter.


### Indexing?

Duplicating all the contents within indexedDB sounds like it'll be a bit of a pain.

I think that it would be safe to instead store an index using the thread root + the timestamp.

That way you could search for slices of posts for your current view and fetch the actual post contents from the given DatArchive.

### What about when nobody's online?

The cool thing about the `datPeers` API, is that it can also be used within node.js using [@beaker/dat-node](https://github.com/beakerbrowser/dat-node).

This it should be easy to set up servers which will automatically crawl and replicate the Dat archives of participants.

### How will communities work?

The idea is that creating a new forum will be as simple as forking the base Dat and sharing the URL with your peers

The cool thing here is that there's no single point that people need to connect to.

Instead, you can talk to people directly, either over the internet, or even over your local network.

Even if the original creator of the forum archive goes away, the community can still move their data elsewhere.

Customizing the forums doesn't require any services, just some CSS and HTML knowledge which could be abstracted for non-technical users.

Using the same building blocks as Fritter for the data means that posts are more portable and that they could be linked through other viewers like Rotonde.

Overall, I think this would be a useful tool and a powerful demonstration of distributed web software.

---

Let me know what you think on [Twitter](https://mobile.twitter.com/RangerMauve) and [Fritter](dat://fritter.hashbase.io/user/dat://3df8868d5c3420d7acdf72d17129e4569cf83723092314ea6b260d112797d8c8)

