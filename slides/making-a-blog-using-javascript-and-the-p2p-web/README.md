# Making a Blog using JavaScript and the P2P Web

---

> TODO: Show geocities screenshot, ✨ 🤩 🦄

Remember the early web? People would hack together little websites for random interestes that they had, and even though it wasn't always slick, it was a cool phenomenon and really showcased the creative power that the web enabled.

---

> Facebook / Twitter / Medium 🙄😪😕

These days you don't see that as much. Instead of whipping together your own website, people instead opt for using social media or "blogging platfors" where all the fun stuff is done for you and you just produce text content for whoever owns the platform.

---

> JavaScript logo

Today we'll be trying to get back into the spirit of the early web by live-coding a blog. The twist is that instead of setting up a server or using some fancy framework, we're going to use modern JavaScript, and the Peer to Peer web.

---

> 🤔

Before we get to the blog portion, let's quickly go over the peer to peer web.

---

> 🤓(📄) -> 🖥

The way the web works right now is that if a person wants to create some content, they have to load it onto a "server".

---

> 🖥(📄) <- 🌐 <- 🤩 💻

A server is just a computer that's running a program that lets other commputers connect to it and download data.
To get the content you ust published, a person will connect to the internet, use your server's IP or domain name to connect to the computer, and download the content.

---

> 🌐 🧙 ️😐❔🐉 🖥

Anyone can hypothetically run their own server, but it's kind of a pain to set up, and there's a bunch of extra technical steps outside of making content. And it takes some tech savvy to register your own website URL.

---

> ☁ 🖥 ☁

This is one of the reasons that people choose not to bother, and just use other people's servers "in the cloud".
Someone else sets up the servers and sets up the URLs you can use to share your content.

---

> 🤓(📄) -> 🌐 -> 🖥 <- 🌐 <- 🤩(📄)

This is great in that your information can flow from you, to the internet, to the server, and then to the internet, and to the people that want to see your information.

---

> 🖥💥 -❌-> 🌐 <-❌- 😭

That all breaks down if the server isn't accessible over the internet anymore.
This can happen if
- The server itself goes down
- The server decides it doesn't want to share your content with specific people for whatever reason
- It's unable to access the internet (either because of physical outage or governments / targeted attacks)
- If there's a natural disaster that blocks your city's network from the server's network
- If your home loses internet connectivity for whatever reason

In addition to these new bottlenecks, you now have to actively pay for the server to be up (or have people pay indirectly by having ads).

---

> 🤓💻(📄) 🏠 🤩💻

But isn't it weird that we need to go through all of these hops over the internet for everything, especially when the producer and the consumer of some content are both within the same room?

---

> https://outage.report/slack
> https://outage.report/github

Of course a lot of those scenarios are unlikely to happen to you.
Or are they? Does anybody here use Github or Slack? Do you remember what happens to productivity when they go down (as they have a few times this year?).
Suddenly all the information and tooling that you rely on is gone, and even though you have people working in the same office, they suddenly can't collaborate or share data.

---

> 🤓 💻(📄) -> ✨ P2P ✨ -> 🤩 💻

What if we got rid of that central source and just connected directly to each other's machines?
That's the promise of the Peer to Peer web.
Instead of setting up servers, you create a website URL using cryptography, and if you share that URL with somebody, they'll be able to download your content either from you, or from anybody else that has downloaded it in the past.

---

> Dat Protocol Logo
> Beaker Browser Logo

My favorite ecosystem for this concept is the Dat protocol, which can be used inside Beaker, an experimental browser for the peer to peer web.

---

> Quick Demo

- Create a blank Dat Archive
- It's like a folder which you can share over the internet
- Create index.html
- Navigate to URL
- Mention how the URL can be loaded by anybody else (demo the gateway?)
- If I go offline, this content can be fetched from anyone else that's online

---

> 😅

Okay, so now let's plan the blog

---

> - Make Posts
> - Use Markdown for post content (markedjs)
> - Have a text editor for authoring
> - Generate HTML page per post
> - Use JS templates for rendering post contents
> - Use CSS and Emoji to make it look cool

The first thing you should do when planning an application (like this blog), is to list what it should actually do

---

> 👨‍🎨

Next, you want to sketch out what your User Interface will look like.
Sometimes you'd want to use a pen and paper, or some fancy tool.
I'm going to use the web.

---

> Post layout

```html
<title>My Post Title!</title>
<style>
  body {
    margin-top: 3rem;
    color: white;
    background: black;
  }
  header {
    font-size: larger;
    position: fixed;
    text-align: center;
    background: rgba(0,0,0,0.8);
    color: purple;
    position: fixed;
    z-index: 1;
    top: 0px;
    left: 0px;
    right: 0px;
    padding: 0.5em;
  }
  main {
    margin: 0 auto;
    max-width: 666;
  }
  footer {
    margin-top: 3rem;
    font-size: smaller;
    text-align: right;
    color: yellow;
  }
  
  h2::before, h3::before {
    content: "💥"
  }
</style>
<header>✨ Mauve's Blog ✨</header>
<main>
 <h1>My Post title!</h1>
 <p>Lorem ipsum, etc, etc etc,</p>
</main>
<footer>
<marquee>
  Copyright RangerMauve 2018
</marquee>
</footer>
```

First we'll put together what we want a post to look like.
This will give us an idea of what the general feel for the page will be if somebody reads one of our blog posts.

---

> Layout template: `template.js`

```javascript
export default (title, content) => `
<title>${title}</title>
<style>
  @import url("/style.css");
</style>
<header>✨ Mauve's Blog ✨</header>
<main>${content}</main>
<footer>
<marquee>
  Copyright RangerMauve 2018
</marquee>
</footer>
`
```

Now that we have a general feel for how it should look, we should split it up into something reusable.
As I mentioned earlier, we'll use the new javascript JavaScript template literal syntax for the content, and we'll use JavaScript modules for encapsulation.

---

> ✍ The editor 📝

Now that we have a way to stamp out HTML pages for our posts, let's make an editor to actually compose them.

```html
<title>Post Editor</title>
<style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  body {
    display: flex;
    flex-direction: column;
  }

  #editor {
    flex: 1;
    padding: 0.5em;
  }
  
  #savebutton {
    border: none;
  }
</style>
<header>✨ Mauve's Blog - Editor ✨</header>
<pre id="editor" contenteditable>
 # Post Title
 
 Post Body **Here**
</pre>
<button id="savebutton">Save 💾</button>
<footer>
<marquee>
  Copyright RangerMauve 2018
</marquee>
</footer>
<script>
  import template from "/template.js";
  
  const url =  new URL(window.location.href);
  
  document.getElementById("savebutton").onclick = async function() {
    
    const text = document.getElementById("editor").innerText

    const tokens = marked.lexer(text)
    
    const title = tokens.find(({type}) => type === "heading");
    
    if(!title) title = {text: "New Post " + Date.now()}
    
    const fileName = title.text.toLowerCase().replace(/\s+/g, "-");
    
    const archive = DatArchive.load(url.origin);
    
    await archive.writeFile(`/posts/${fileName}.md`, text);
    
    await archive.writeFile(`/posts/${fileName}.html`, marked(text))
    
    window.location = `/posts/${fileName}`
  }
</script>
```

---

> 😲 🦄 🌈

And there you have it! Your first blog.

---

> 😵❔❔

The URL for our blog looks kind of gross, though.
Although we can send the URL to somebody, or have it embeded in a web page, it'd be nice if we had a more human-readable option.
Also, what happens if our computer is offline and there's nobody to download it through the peer to peer network?
Also also, how do I get legacy (non p2p) browsers to load my blog? This stuff isn't exactly widespread yet and I don't want my content to fade into obscurity.

---

> TODO: Hashbase logo here

That's what Hashbase is for.
It acts as a peer for your p2p content which is always online.
That means that even if there are no online peers that have your content cached, hashbase will have a peer running so that new peers can download content from it.
In addition to keeping your content online, it gives you the option to register your own subdomain on hashbase which will also act as a bridge to the centralized web.
**demo doing this with the new blog**

---

> - Make some posts!
> - A homepage
> - Add new posts to homepage
> - RSS feed
> - Magic ✨?

Now that you have the bare bones for a blog, it's time to make some posts, and plan the future of your blog.

Here's some ideas on what you can do next for improving your blog.

---

Thank you

