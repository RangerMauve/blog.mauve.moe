<style>
@font-face {
  font-family: 'FontWithASyntaxHighlighter';
  src: url('FontWithASyntaxHighlighter-Regular.woff2') format('woff2');
}

:root {
  --diagram-primary: #6e2de5;
  --diagram-secondary: #2de56e;
  --diagram-bg: #111111;
  --diagram-text: #F2F2F2;
  --diagram-bg-alt: color-mix(in srgb, #6e2de5 15%, #111111);
}

pre code {
  background: var(--diagram-bg-alt);
  padding: 0.75em 1em;
  border-left: 3px solid var(--diagram-primary);
  display: block;
  font-family: 'FontWithASyntaxHighlighter', monospace;
  font-size: 0.85em;
}

table {
  border-collapse: collapse;
  margin: 1em auto;
}

th,
td {
  border: 1px solid var(--diagram-primary);
  padding: 0.4em 0.6em;
  text-align: left;
}

thead th {
  background: var(--diagram-primary);
  color: var(--diagram-text);
  font-weight: bold;
}

tbody td:nth-child(1) { background: var(--diagram-bg-alt); font-family: monospace; color: var(--diagram-secondary); }
tbody td:nth-child(2) { background: color-mix(in srgb, var(--diagram-primary) 10%, var(--diagram-bg)); }
tbody td:nth-child(3) { background: color-mix(in srgb, var(--diagram-secondary) 10%, var(--diagram-bg)); }
tbody td:nth-child(4) { background: color-mix(in srgb, var(--diagram-primary) 20%, var(--diagram-bg)); }
tbody td:nth-child(5) { background: color-mix(in srgb, var(--diagram-secondary) 20%, var(--diagram-bg)); }

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25em 1em;
  padding: 0.5em;
}

dt {
  color: var(--diagram-secondary);
  font-family: 'FontWithASyntaxHighlighter', monospace;
  font-weight: bold;
}

dd {
  background: var(--diagram-bg-alt);
  padding: 0.3em 0.6em;
  border-radius: 4px;
  font-family: 'FontWithASyntaxHighlighter', monospace;
  font-size: 0.85em;
}

ul {
  list-style: none;
  padding-left: 1.5em;
}

ul::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--diagram-primary);
}

li {
  position: relative;
  padding-left: 1em;
  margin: 0.25em 0;
}

li::before {
  content: "├─";
  position: absolute;
  left: 0;
  color: var(--diagram-primary);
}

li:last-child::before {
  content: "└─";
}

strong { color: var(--diagram-secondary); }
em { color: var(--diagram-primary); }
</style>

# How to use the web's built in Database, IndexedDB

???

This talk will introduce folks to IndexedDB. We'll go over how it holds data, how to search through data, and how you need to effectively manage indexes to keep your app fast. We'll also look at some real life open source projects that use this for offline-first apps.


My name is Mauve Signweaver, I'm a decentralized software consultant, and I'm a bit of a database nerd. Thanks for coming out to learn today!

---

## Overview

- Databases (relational, document)
- IndexedDB (data model, api, migration)
- Performance: (indexing, iteration)
- Real world: Social Reader

???

So, First we'll get on the same page about how databases w2ork.
Then we'll take a look at IndexedDB, how it models data, and a look at how to use it's API and deal with database migrations.
Then we'll talk a bit about how to improve your app performance.
And we'll wrap up by looking at how an open source app I've worked with in the past uses it for offline social feeds.

---

## Databases

Diagram: SQL statement referencing bobby tables

<pre><code>SELECT * FROM users WHERE name = ';
  DROP TABLE students; --';</code></pre>

???

Back end developers are used to relying on databases for storing and sorting through large amounts of data. Usually anything you see on a website needed to be entered into a large database somewhere and fetched before you can see it on the page. These can get really big and end up being a bottleneck and point of centralization in your apps. Thankfully that means job security for those of us that know how to keep them going.

---

### Relational Databases

Diagram: SVG table with generic user data

<table>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>email</th>
      <th>age</th>
      <th>role</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Alice</td><td>alice@example.com</td><td>30</td><td>admin</td></tr>
    <tr><td>2</td><td>Bob</td><td>bob@example.com</td><td>25</td><td>user</td></tr>
    <tr><td>3</td><td>Carol</td><td>carol@example.com</td><td>28</td><td>user</td></tr>
    <tr><td>4</td><td>Dave</td><td>dave@example.com</td><td>35</td><td>moderator</td></tr>
  </tbody>
</table>

(e.g. MySQL, Postgres)

???

Most folks use some flavor of relational database with predefined fields in rows of tables.
Before you can store data you need to figure out it's shape and how different rows will reference each other.

---

#### Migrations

Diagram: SQL statement adding a new varchar `sin` field to the users table with the default set to "existing"

<pre><code>ALTER TABLE users
  ADD COLUMN sin VARCHAR(10)
  DEFAULT 'existing';</code></pre>

???

If you want to add a new field to your data, you need to update the schema and often perform a migration over all your data before you can resume reading and writing.

---

#### Disk format

Diagram: color coded hex for three rows of hex numbers with four repeating colors for colums.

<table>
  <thead>
    <tr>
      <th>offset</th>
      <th>col 0</th>
      <th>col 1</th>
      <th>col 2</th>
      <th>col 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0x00</td>
      <td>41 6C 69 63 65 00 30 FF</td>
      <td>42 6F 62 00 00 19 FF 00</td>
      <td>43 61 72 6F 6C 00 1C FF</td>
      <td>44 61 76 65 00 23 FF 00</td>
    </tr>
    <tr>
      <td>0x20</td>
      <td>65 78 69 73 74 69 6E 67</td>
      <td>75 73 65 72 00 00 00 FF</td>
      <td>6D 6F 64 00 00 00 FF 00</td>
      <td>61 64 6D 69 6E 00 FF 00</td>
    </tr>
    <tr>
      <td>0x40</td>
      <td>00 00 00 00 FF FF FF FF</td>
      <td>41 6C 69 63 65 00 30 FF</td>
      <td>42 6F 62 00 00 19 FF 00</td>
      <td>00 00 00 00 FF FF FF FF</td>
    </tr>
  </tbody>
</table>

???

The benefit here is that the on disk representation of your data can be a lot more predictable with individual rows having periodic offsets. Instead of needing to sift and parse all the data, the database can quickly skip rows or read just the bytes for specific colums.

There's a load of nuance here so bear with me if you're an expert on database internals.

---

### Document Stores

Diagram: List of JSON objects of users, different fields exist in each. Each has an ID

<dl>
  <dt>_id: doc1</dt>
  <dd>{ "name": "Alice", "email": "alice@example.com", "age": 30, "role": "admin" }</dd>
  <dt>_id: doc2</dt>
  <dd>{ "name": "Bob", "email": "bob@example.com", "preferredColor": "blue" }</dd>
  <dt>_id: doc3</dt>
  <dd>{ "name": "Carol", "age": 28, "tags": ["user", "moderator"], "bio": "hi!" }</dd>
  <dt>_id: doc4</dt>
  <dd>{ "name": "Dave", "role": "moderator" }</dd>
</dl>

(e.g. MongoDB, CouchDB)
???

Another popular style of database is the document store. Instead neatly uniform tables, you can essentially have a bunch of json documents which can have heterogenous shapes. What data type or whether a field exists is totally up to you so long as your application can handle it. The only thing that really matters is to have unique identifiers for each document so you can reference them for updates and deletion.

This can be nice if you have complex shapes for your data or don't want to mess with schemas on the database side and plan to handle it in your application layer instead.

---

#### Key Value Stores

Diagram: Key value pairs with ids pointing to json documents

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>"doc1"</code></td>
      <td>{ "name": "Alice", "age": 30, "role": "admin" }</td>
    </tr>
    <tr>
      <td><code>"doc2"</code></td>
      <td>{ "name": "Bob", "preferredColor": "blue" }</td>
    </tr>
    <tr>
      <td><code>"doc3"</code></td>
      <td>{ "name": "Carol", "tags": ["user"] }</td>
    </tr>
    <tr>
      <td><code>"doc4"</code></td>
      <td>{ "name": "Dave", "role": "moderator" }</td>
    </tr>
  </tbody>
</table>

???

Since the binary representation of documents can't be as uniform, most dbs end up storing the raw data in key value stores and doing a bit more parsing when running queries. The keys end up being the thing that makes seeking through the data quick using B+ trees to speed up random access and iteration.

---

## 🎉 IndexedDB 🥳

???

So! With that context let me introduce you to the star of the night, the only database that JavaScript developer have access to without needing really tricky libraries with experimental filesystem access: IndexedDB.

---

### Data model

Diagram: Tree hierarchy of a db called "my app" with two collections called posts and users and some "{}" representing data under each collection with ids like `doc1, doc2, docN` and an index labelled `byTime` for the posts

<ul>
  <li><em>"my app"</em>
    <ul>
      <li><strong>ObjectStore:</strong> "posts"
        <ul>
          <li>{}</li>
          <li>{}</li>
          <li><em>Index: byTime ↕</em></li>
        </ul>
      </li>
      <li><strong>ObjectStore:</strong> "users"
        <ul>
          <li>{}</li>
          <li>{}</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

???

Indexed DB is a document store. Your app can have one or more named databases that are shared between all web pages on your domain. These databases have named collections of documents (they call them object stores) and indexes over those collections that speed up searching.

---

### API

```JavaScript
const db = await new Promise((res, rej) => {
  const r = indexedDB.open("my app", 1);
  r.onupgradeneeded = e => e.target.result.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});

// Save
const tx1 = db.transaction("posts", "readwrite");
tx1.objectStore("posts").add({ title: "Hello", body: "World" });
await tx1.complete;

// Get by id
const tx2 = db.transaction("posts", "readonly");
const post = await new Promise((res, rej) => {
  const r = tx2.objectStore("posts").get(1);
  r.onsuccess = () => res(r.result);
  r.onerror = () => rej(r.error);
});
```

???

This is the gist of what the API looks like. You need to explicitly open your db and any operations require starting a transaction which has this weird callback pattern because it was finalized before promises were a thing. One thing to note is that unlike LocalStorage which some of you may have used to store small bits of data, the entire api is asynchronous which is good for keeping your render thread speedy, but requires you to be careful with asynchronous actions happening concurrently. These transaction objects help the different tabs in your app coordinate read and write operations without stepping on each other and causing conflicts. 

---

### IDB.js

```JavaScript
import { openDB } from 'idb';

const db = await openDB('my app', 1, {
  upgrade(db) {
    db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
  },
});

// Save a post
await db.add('posts', { title: 'Hello', body: 'World' });

// Get by id
const post = await db.get('posts', 1);

// Get all posts
const allPosts = await db.getAll('posts');
```

All that code adds up though so instead of writing a bunch of onsuccess callbacks, we'll assume that your app is using this super lightweight wrapper called IDB.js.

This handles wrapping transactions in promises and converts the custom iterator api into more familiar async iterators.

Notice here how we set up a default key for all posts called `id` and have the database track automatically assigning them when we add a new document. You can also choose to set the key to a field that you control at the app layer and can set to a string instead of an integer.

---

### CRUD

```JavaScript
// Create
const id = await db.add('posts', { title: 'Hello', body: 'World' });
// Read
const post = await db.get('posts', id);
// Update
await db.put('posts', { ...post, body: 'Updated!' });
// Delete
await db.delete('posts', id);
```

???

Just as you'd expect with any other data store you have some basic operations for creating, reading back, updating, and deleting. Note that usually you'd need to set up transactions and perform the operations on there, but thankfully, IDB.js gives us more concise wrappers that open the store and transaction for you.

---

### Iterating

```JavaScript
for await (const { value } of db.transaction('posts').store) {
  if (value.year === new Date().getFullYear()) {
    console.log('This year:', value);
  }
}
```

???

Similarly, we can easily iterate through all the documents in a collection using for await of syntax.
Now, notice here how I'm checking for posts that were tagged with the current year? This could make sense for rendering stuff to a calendar or some sort of gallary view in your app, but it's also hiding a major performance issue. Now, filtering through a few hundred posts is quick enough, but what if there are thousands, and what if you need them to be sorted? What we really need is to get an iterator with *just* this years posts and not bother loading the rest in the first place.

---

### Indexes

```JavaScript
const db = await openDB('my app', 1, {
  upgrade(db) {
    const store = db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
    store.createIndex('year', 'year');
  },
});

const index = db.transaction('posts').store.index('year');
for await (const cursor of index.iterate(new Date().getFullYear())) {
  console.log(cursor.value);
}
```

???

This is exactly what indexes solve. You can specify a name, a field, and it will build up a sorted list of documents with that field. This way you can seek to a specific range

---

### Select in SQL

```sql
SELECT * FROM posts WHERE year = YEAR(CURRENT_DATE);
```

???

For reference this is how you could do the same thing in SQL.
Job security!

---

### Searching

```JavaScript
const index = db.transaction('posts').store.index('year');
const range = IDBKeyRange.bound(1922, 1991);
const range = IDBKeyRange.lowerBound(1980, true); // exclusive

for await (const cursor of index.iterate(range)) {
  console.log(cursor.value);
}
```

???

You can also use this for more advanced queries like values within a range or greater than a specific value.

---

### Pagination

```JavaScript
const page = 2;
const pageSize = 10;

let cursor = await db.transaction('posts').store.openCursor();
cursor = await cursor.advance(page * pageSize);

while (cursor && posts.length < pageSize) {
  console.log(cursor.value)
  cursor = await cursor.continue();
}
```

???

Paging can be done by using the cursor's advance and continue methods instead of for of loops on the iterator.

---

### Migration

```JavaScript
const db = await openDB('my app', 3, {
  async upgrade(db, oldVersion, newVersion, tx) {
    if (oldVersion < 1) {
      const store = db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
      store.createIndex('year', 'year');
    }
    if (oldVersion < 2) {
      tx.objectStore('posts').createIndex('author', 'author');
    }
    if (oldVersion < 3) {
      tx.objectStore('posts').createIndex('title', 'title');
    }
  },
});
```

???

Now, even though we don't need to modify documents when our application adds something, indexed db gives us a convenient way to create and update collections and indexes only if we haven't already. When our app tries to open a database, it can pass in a version number, and if the number is greater than what it was last time, it'll automatically call the upgrade function. Here you can have all the code you'll need to adjust the database to meet what your app expects.

---

## Performance: Indexing

- Identify heavy queries
- Divide into biggest impact
- More indexes = more storage

???

Just like in relational databases, how you set up your data and index it will drastically affect your performance. Your app can either feel instandaneous or a slog based on hoh you approach this.
In general you should focus on the queries that will have the biggest impact first.

From here you should use your indexes to divide the data by fields that will have the biggest effect.

Be weary of over-indexing however as more indexes mean more duplicated storage and more places that need to be updated when a document is mutated.

---

### Case study: Social Media

- timeline of latest posts
- posts mentioning the user
- posts by thread (replies)

???

For example we could imagine the indexes we'd want for a social media app.
We'd want all the posts we'd see in the timeline sorted by date.
We'd want a way to see direct mentions for the users notifications.
And when we view a post we'd want a quick way to load the replies.

---

## Performance: Iteration

- Less is more (e.g. < 200)
- Use raw Cursor (if necessary)
- Benchmark your app!

???

Lastly, keep in mind that sometimes it's not even worth it to do all this extra iterating if you don't need to.
If you know for sure the collection is going to be small, just load it all at once.

If you really need to iterate through thousands of records, you'll want to ditch the promise wrapper and use the more raw cursor APIs to get a significant speed boost.

Lastly, you can't know what's slow or fast, so you should be running benchmarks on your code to know for sure.

---

## [reader.distributed.press](https://reader.distributed.press/)

![reader.distributed.press logo](logo-distributedpress.svg)

---

### What

- ActivityPub client
- Offline first
- Peer-to-Peer

---

### How

- Load posts via fetch
- Save to IndexedDB
- 5 collections
- 18 indexes (11 for notes)

---