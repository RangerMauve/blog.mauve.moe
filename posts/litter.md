# Litter

This is a collection of ideas for `litter`, an alternative to [fritter](dat://fritter.hashbase.io/), itself a Dat-based alternative to [twitter](https://mobile.twitter.com/).

### TODO:
- Sketch out notifications API
- Implement the API
- Build MVP timeline renderer
- Render links and @mentions in posts
- Finish main features
- Make it work in legacy browsers
- Extras

## Main goals

- Use ESM for JS / dependencies
- No transpilation
- Use template literals
  - One JS file per template
  - Export async function that returns string
- No virtual-dom libraries to start
- Make it easy to customize the templates / style

## Implementation

- liblitter
- Use dat-object-store for indexing posts/people
- Don't store post contents, just URLs to location and metadata
- Index who's following people, and who's following them
- Track notifications in a collection, mark them as `read`
  - This will mean you don't miss notifications that you got in the past that you've just replicated
  - Replies
  - Mentions
  - Votes
- Index second-degree follows so that you get notifications from them
  - Should tag posts in index with whether you're following them or not
- Don't show replies on the main timeline, just thread roots and reply counts

## Display

- Emoji everywhere 😂
- Posts are called `litter`
- Your timeline is your `trash heap`
- You `throw out` the litter on your `trash-heap`
- You `watch` people instead of `follow`
- Notifications are `recently smelled`
- Display whether somebody is following you whenever you see them

## Nice to have

- React with different kinds of emoji (limit to positive ones a la github)
- dat-polyfill integration
- Support markdown
- `Who to follow` tab which shows people that follow you which you haven't followed
- Use datPeers API to discover people that are online for the `who to follow` tab

## API

```javascript
import Litter from "whatever"

class Litter {
  // Create a new litter instance.
  // Specify `name` if you want to create a new profile
  // Specify `profileURL` if you want to load an existing profile
  static async create({profileURL, name}): Litter
  
  // Load a litter instance from the inde URL
  static async load({url}): Litter
  
  // URL of the DatArchive storing your index
  indexURL: String
  
  // Your profile URL
  profileURL: String

  // The raw ObjectStore referenced being used to store and index the data
  db: DatObjectStore
  
  // Getter for your own profile
  get profile(): Person
  
  // Get your timeline (all posts)
  get timeline(): Timeline

  // Get information on votes
  get votes(): Votes

  // Get your notifications (can filter by read or unread)
  get notifications(): Notifications
}

class Query {
  // For filtering on the timestamp
  $gt: Number
  $lt: Number
  $sort: Number

  // For paging posts
  $limit: Number
  $skip: Number
  
  // URL of the author
  author: String
}

class TimelineQuery extends Query {
    // URL of who has been mentioned
  mentioned: String
  
  // Whether the authors should be people you're following
  isFollowed: Boolean
  
  // Only get replies to a given post
  threadParent: String
  
  // Only get replies to a given thread
  threadRoot: String
}

class Post{
  // The URL this post is located at
  url: String
  
  // The author's information
  author: Person
  
  // Get the post data. It should have `text`
  async post(): Object

  // List all the votes for this post
  async votes(): Array<Vote>

  // List all the replies to this post
  async replies(Query): Array<Vote>

  // Add a vote for this post
  async vote(vote: Any): Vote

  // Post a reply to this post
  async reply({text}): Post
}

class Vote {
  // The URL of the vote
  url: String

  // The author's information
  author: Person

  // The vote data
  async vote(): Obect
}

class VoteQuery extends Query {
  // Which subject you want to find votes for
  subject: String
}

class Votes {
  async list(query: VoteQuery): Array<Vote>
}

class Timeline {
  // List all posts
  async list(query: TimelineQuery): Array<Post>
  
  // Create a post (only works for your timeline)
  async post({text}): Post
}

class Person {
  // The person's Dat URL
  url: String
  
  // Get a timeline scoped to their posts
  get timeline() : Timeline
  
  async profile(): {name, bio, avatar}
  
  // List the people this person is following
  async following(): Array<Person>
  
  // List the people you know are following this person
  async followers(): Array<Person>
  
  // Only available if it's you
  async update(): void
  async follow(url: String): void
}

class NotificationQuery extends Query {
  // What type of notification to filter by
  type: String

  // Filter by read or unread notifications
  read: Boolean
}

class Notification {
  // What post / vote originated the notification
  url: String

  // What 
  type: String | "reply" | "mention" | "vote",
  read: Boolean

  async data(): Post | Vote

  // Mark the post as read
  async markRead()
}

class Notifications {
  async list(NotificationQuery): Array<Notification>
}
```






