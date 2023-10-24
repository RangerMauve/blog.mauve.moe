# The Distributed Press Social Inbox - How does it work?

This post will look at the new [distributed.press Social Inbox](https://github.com/hyphacoop/social.distributed.press/) and talk about how we split [ActivityPub](https://activitypub.rocks/) into statically published web content with a minimal "Inbox Server" that just handles incoming messages like follow requests and replies.

## What is ActivityPub?

Before getting into the details of how the inbox works and how it relates to Distributed Press, we should talk a little bit about what ActivityPub is and why we are using it.
The best way to think about it is that it's like email but for social data.
Instead of everybody having and count on 1 website and everybody posting all of their data on that website, people can have accounts on different websites and talk to each other by sending messages to each other's inboxes.
What's cool is that there's already a bunch of web sites and communities that are making use of this standard.
Software like [Mastodon](https://joinmastodon.org/), [Pixelfed](https://pixelfed.org/), and [Lemmy](https://join-lemmy.org/) offer interfaces that are familiar to folks from other social media sites like Twitter, Instagram, and Reddit.
However unlike their corporate counterparts anybody can set up an instance of these web sites and users on any of these instances can follow each other and comment on each other's posts.

At the core of this is the ActivityPub and ActivityStreams standards which dictate how servers and clients should talk to each other in a way where posts and accounts can be visible to apps regardless of how it will be displayed to users.

## How does that work with P2P Publishing?

Given how many people are already using these standards it was very appealing as a target for web sites and blogs published using distributed press.
Thanks to a generous grant from the [Filecoin Foundation for the Decentralized Web](https://www.ffdweb.org/) we got to make it easier for folks publishing their web sites to get comments and to make their posts available to anybody that's already on the federated web powered by ActivityPub (AKA The Fediverse).

One thing we wanted to focus on was to put as much "authority" into the publish website and as little as possible into any sort of centralized server.
what's cool is that ActivityPub is actually well set for this use case.
Most of the data that servers access is actually representable as static JSON files.

Our 1st goal was to create an example of repository of static files published via distributed press that could be loaded from software such as mastodon without needing any extra servers.
We published this on Github at [staticpub.mauve.moe](https://github.com/RangerMauve/staticpub.mauve.moe/).
If you want to have as minimal a set up as possible you can clone this repository and change the URLs to match your own domain and start adding posts using whatever method you prefer.
What was important is to have a valid actor file which is how other people can load information about who you are and discover posts that you made.
You will also need to create a WebFinger file which we will get into in a bit.

```json
{
  "subject": "acct:mauve@staticpub.mauve.moe",
  "aliases": [
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "type": "text/html",
      "href": "https://staticpub.mauve.moe/about.html"
    },
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://staticpub.mauve.moe/about.jsonld"
    }
  ]
}
```

Finally you will need to represent all of your posts using JSON files in the [ActivityPub "notes" format](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-note).

```json
{
    "@context": "https://www.w3.org/ns/activitystreams",
    "id": "https://staticpub.mauve.moe/helloworld.jsonld",
    "type": "Note",
    "summary": null,
    "published": "2023-06-29T17:29:45Z",
    "url": "https://staticpub.mauve.moe/helloworld",
    "attributedTo": "https://staticpub.mauve.moe/about.jsonld",
    "to": [
        "https://www.w3.org/ns/activitystreams#Public"
    ],
    "cc": [],
    "sensitive": false,
    "content": "Hello World!",
    "contentMap": {
        "en": "Hello World!"
    },
    "attachment": [],
    "tag": [],
    "replies":  "https://staticpub.mauve.moe/helloworld-replies.jsonld"
}
```

You will also need to add a link tag to the html version of your posts with the the "rel" property being set to "alternate" and the typeset to something like "application/activity+json" and the "href" property pointing to a full your route to the JSON version of your post.

```html
<link rel="alternate" type="application/activity+json"
      href="https://staticpub.mauve.moe/helloworld.jsonld" />
```

With this in place whenever somebody tries to look up your post on mastodon it will automatically resolve it to the ActivityPub version and present it within the app with options to boost your post or follow your account for updates.

One thing to note however is that instances won't be able to follow you if all you have is your static versions of your site.
In order to be able to follow somebody an instance needs to be able to send an activity to request a follow to that actors inbox and for that actor to send them a follow accept or reject for the server to know that it was successful.
this flow sadly requires a server and can't be done with purely statically published web sites.
The good news is that we've created a minimal ActivityPub inbox server specifically for this use case.

## How The Inbox Works

This brings us to the new Distributed Press Social Inbox.
It does just enough for you to be able to receive follow requests and replies, to send out new posts to followers, and download your follower list and replies back onto your static website.

After setting up your static website with the appropriate ActivityPub JSON files you will need to generate a key pair which will serve as a means to authenticate any http requests.
This is used for the [HTTP Signatures specification](https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-08) which is used by ActivityPub to verify that anything sent to an inbox is actually coming from the expected actor.
Whenever you want to send an http request, you will need to 1st calculate a [digest header](https://docs.joinmastodon.org/spec/security/#digest) based on the body of the request, and then take some of the request headers (including the digest) and [sign them with your public key](https://docs.joinmastodon.org/spec/security/#http-sign).

We use this in the in box server to verify that requests are coming in from specific userswithout needing to have them create accounts with login credentials or set up any custom authentication schemes.
In order to register an inbox, you must 1st send a post request to `/v1/:actor/` with your public and private key pair and information about where your actor file is.
We check this against the global blocklist in order to block domains that the instance might not want to host.
Everywhere in the API where we have an actor, we make use of WebFinger style short hands using the `@username@domain` syntax that is common in the fediverse for tagging accounts in posts.

Once you've created the account you can now modify your actor object took link to the inbox at `/v1/:actor/inbox`.
For example `https://social.distributed.press/v1/@mauve@staticpub.mauve.moe/inbox` is what we link to in the static pub example.
from here you can sit back and wait for people interacting with your blog to send you replies or follow requests.
If you have moderation set to accept all follow requests you can sit back even more while the inbox server automatically sends response activities.

Once you've created a new post you should create an "Activity" that references it and after uploading it to your site, you should send a POST request to your outbox at `/v1/:actor/outbox`.
The outbox will then look at your followers list and forward the activity to all of their inboxes so that they can see your new post in their timeline.

### Moderation

The goal of the Social Inbox is to make it easy for folks to add social interactions to their statically published websites.
And sadly a lot of social interactions on the open internet can be unpleasant when folks get exposed to trolls or just plainly don't get along.
To ease the amount of damage from drive by posting, we've added some moderation features to the inbox for Allow Lists and Block Lists.

By default any incoming Activities will get queued up in your `GET /v1/:actor/inbox` endpoint which can be looked at and accepted or deleted.
However to speed things up you can automate the process with the `/v1/:actor/blocklist` and `/v1/:actor/allowlist` endpoints.
You can `GET / POST / DELETE` newline separated username patterns in order to block/allow specific users and instances.

For example if you trust everyone on `social.mauve.moe` you can add `@*@social.mauve.moe` to your allow list.
Similarly if you've had trouble with `@mauve@social.mauve.moe` and don't want to bother seeing any of their inflammatory replies, you can add `@mauve@social.mauve.moe` to your block list.
These endpoints streamline personal moderation choices for each user of the Inbox.

On top of the individual moderation techniques we also have instance wide allow lists and block lists at `/v1/allowlist` and  `/v1/blocklist` which enable administrators of in instance to preemptively block or allow incoming messages from communities they're already aware of.
This can make it easier for communities to work together so that individuals don't have the responsibility of moderating everything themselves if they don't want to.
For example, an administrator can choose to allow all trafficked by default except for any instances that were specifically blocked by setting `@*@*` in the allow list.

If you check [the source code](https://github.com/hyphacoop/social.distributed.press/blob/347f9d59f07bce936a0eee2b61865602fd62af3d/src/server/moderation.ts#L16) for moderation logic you'll see that we prioritize the choices of actors over instance admins.
When considering incoming traffic week 1st check to see if the user because inside the actor allow list, then we check if they are in the actor block list.
Then we check if they are an admin or if they're in the global block list or global allow list.
Finally if an actor is not in any of these lists then they will be added to your inbox queue to be manually processed.

For our deployment scripts we've also added the option to specify a blocklist in the [mastodon blocklist format](https://fedi.tips/importing-ready-made-server-blocklists-on-mastodon/) when setting up an instance with Ansible.
We looked around at some of the options and have settled initially on the [garden fence blocklist](https://github.com/gardenfence/blocklist/blob/main/gardenfence-mastodon.csv) which covers some of the instances that have the most trouble and illegal or hateful content.
As with all our moderation features this is opt in and you can choose to use it or bring your own list.
We're also looking at other efforts in the space like "the bad place" which has a larger community working on APIs for moderating at scale.

### Hooks

Since publishers can have a huge variety and how they actually generate the static files needed for their web sites and how they might want to integrate replies and followers we've integrated a robust system of [web hooks](https://en.wikipedia.org/wiki/Webhook).
You can use the various `/v1/:actor/hooks/:hook/` endpoints to register hooks which should be invoked whenever a new moderation item is queued, whenever an activity gets approved, or whenever an activity gets rejected.
you can set this up to invoke Github actions or whatever other system you want to notify.
This can be useful for triggering new builds up your website that pull responses into your site content or to notify a moderator to look at replies that need to be acted on.
having web hooks also means that less logic sits inside your inbox server and more can be plugged into places that you already have.

## Sutty

For folks that aren't interested in doing a bunch of coding themselves and want to focus on getting content out for folks to see, you can now use the distributed press integration in the [Sutty CMD](https://panel.sutty.nl/).
They have developed a [jekyll plugin](https://0xacab.org/sutty/jekyll/jekyll-activitypub) into some of their templates which automatically generates the necessary ActivityPub data and interacts with a configured social inbox to receive followers and to send out new posts to them.
You can also make use of their plugin directly if that's more up your alley, by personally I think the out of the box functionality you will be the easiest way to make use of this stuff.

## Next Steps

Now that we have the initial version of the inbox ready will start integrating it with Hypha specific web sites and start working on the next set of milestones.
The big things that we want to focus on is how to make discoverability of blogs easier and how we can transition more ActivityPub clients to make use of the peer to peer published versions of people sites instead of needing to depend on http for everything.

If you're curious to get involved send us an email at `hello [at] distributed.press` or open an issue on our [Github repositories](https://github.com/hyphacoop/social.distributed.press/).
