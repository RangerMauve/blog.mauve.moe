# Making A Text Editor

Hey folks, today we'll putting together our own text editors for loading and editing files on the peer to peer web with Agregore.

In order to get the most out of this presentation, it'll be good to have at least basic understanding of web programming like HTML, CSS, and JavaScript.

You will be able to copy paste examples if you need, but it can be useful to understand what's actually going on.

## Downloading and installing

- Go to https://agregore.mauve.moe/
- Click on "Download" in the header
- Click "Assets" to see the installers
- Download the exe if you're in Windows
- Download the Universal DMG for MacOS
- Download the deb for Ubunti Linux
- Download the APK for arch Linux
- Download the AppImage for other Linux flavors

Now before we continue, lets make sure we've got Agregore installed on our computers.

For this workshop we'll be using the desktop version of Agregore since it's got built in devtools which is a work in progress for mobile.

If you'd like to follow along, please install it while I go over what Agregore is.

## How does Agregore Work

`Web Browser + P2P Protocols = Agregore`

Before we get into the details, lets look at how  Agregore works.

It's like a regular web browser, but with the added ability of being able to talk to peer to peer protocols in the same way you would a web server.

### P2P URLs

```
http://example.com/whatever.txt
hyper://example.com/whatever.txt
ipns://example.com/whatever.txt
```

Everywhere that you might normally see a URL for an HTTP server, be it a web page, an image, or an API for uploading files, you can now also use URLs for peer to peer protocols like Hypercore or IPFS.

### Fetch

```JavaScript
await fetch('hyper://myeditor/example.txt', {
  method: 'put',
  body: 'Hello World!'
})
```

This goes hand in hand with web APIs for sending requests to servers from JavaScript, namely the `fetch()` API.

Here's an example of how you can send a file to the hypercore protocol handler and add it to a dataset.

## Uploading a page with devtools

Devtools: `ctrl+shift+i` or `File > Open Devtools`

```JavaScript
response = await fetch('hyper://myeditor/index.html', {
  method: 'put',
  body: `
<!DOCTYPE html>
<title>P2P Editor</title>
<h1>Hello World!</h1>
  `
})
console.log(await response.text())
```

Here we can see how we can upload a page to hypercore and create a new website.

We're using the `fetch()` API to PUT some new data in a hypercore URL.

Note that `myeditor` is a "name" which will be used to generate a unique URL for your website.

With names you can have applications using well known names for webistes without needing to have an extra step of saving the public key URL somewhere.

In this request, we're saying that we want to PUT some data into `index.html` of our hypercore website.

The `body` of the request is a template literal which can contain the HTML we want our file to contain.

For now we'll have a basic hello world.

Notice how after I hit enter, I got a proper `hyper://` URL in the console.
This is the public URL for my website and it's what I'll be sending to people for them to be able to view it.

Feel free to post your links in the Discord chat to show folks your results!

## Structuring the UI


```JavaScript
response = await fetch('hyper://myeditor/index.html', {
  method: 'put',
  body: `
<!DOCTYPE html>
<title>P2P Editor</title>
<section id="controls">
  <input type="text" id="currentURL">
  <button id="saveButton">Save</button>
  <button id="loadButton">Load</button>
</section>
<textarea id="editor"></textarea>
  `
})
console.log(await response.text())
```

Next, let's look into structuring our text editor some more.

Lets add the basic UI elements we'll need for saving and loading files, and for editing the text itself.

## Styling

```JavaScript
response = await fetch('hyper://myeditor/index.html', {
  method: 'put',
  body: `
<!DOCTYPE html>
<title>P2P Editor</title>
<style>
  @import "agregore://theme/style.css";

  body, html {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  #editor {
    flex: 1;
  }

  #controls {
    display: flex;
    flex-direction: row;
  }
  #currentURL {
    flex: 1
  }
</style>
<section id="controls">
  <input type="text" id="currentURL">
  <button id="saveButton">Save</button>
  <button id="loadButton">Load</button>
</section>
<textarea id="editor"></textarea>
  `
})
console.log(await response.text())
```

Now we can see we have something that's starting to look recognizable, but how about we add some styling to make it look nicer.

First, we'll import Agregore's default styles which can be configured to have different color schemes to match the rest of the browser.

Next, we'll change the styling of the page itself so that it stretches to fit the content and turns into a "flexbox" container which is easier to arrange items inside.

Next, we'll set the textarea to expand to fill up as much space as it can below the form controls.

Finally, we'll turn the controls section into a flexbox and set the text input to fill up as much space as it can within.

With all that in place, we've got a UI which could be a passable text editing interface.

## Loading content with Fetch

```JavaScript
response = await fetch('hyper://myeditor/index.html', {
  method: 'put',
  body: `
<!DOCTYPE html>
<title>P2P Editor</title>
<style>
  @import "agregore://theme/style.css";

  body, html {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  #editor {
    flex: 1;
  }

  #controls {
    display: flex;
    flex-direction: row;
  }
  #currentURL {
    flex: 1
  }
</style>
<section id="controls">
  <input type="text" id="currentURL">
  <button id="saveButton">Save</button>
  <button id="loadButton">Load</button>
</section>
<textarea id="editor"></textarea>
<script type="module">
  loadButton.onclick = async () => {
    const response = await fetch(currentURL.value)
    const content = await response.text()
    editor.value = content
  }
</script>
  `
})
console.log(await response.text())
```

Now that we have the interface figured out, lets make it interactive with some JavaScript.

We'll add a script tag at the bottom of the page and add an onclick listener to the saveButton which will fetch the contents of the URL in the text input and put it into the textarea.

With this, we have a basic view source and can start viewing different pages, for example, we can view the editor's source within the editor if we past in its URL.

## Saving changes


```JavaScript
response = await fetch('hyper://myeditor/index.html', {
  method: 'put',
  body: `
<!DOCTYPE html>
<title>P2P Editor</title>
<style>
  @import "agregore://theme/style.css";

  body, html {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  #editor {
    flex: 1;
  }

  #controls {
    display: flex;
    flex-direction: row;
  }
  #currentURL {
    flex: 1
  }
</style>
<section id="controls">
  <input type="text" id="currentURL">
  <button id="saveButton">Save</button>
  <button id="loadButton">Load</button>
</section>
<textarea id="editor"></textarea>
<script type="module">
  loadButton.onclick = async () => {
    const response = await fetch(currentURL.value)
    const content = await response.text()
    editor.value = content
  }
  saveButton.onclick = async () => {
    const content = editor.value
    const response = await fetch(currentURL.value, {
      method: 'PUT',
      body: content
    })

    alert("saved to " + await response.text())
  }
</script>
  `
})
console.log(await response.text())
```

Next, lets add the ability to save changes back into the URL by adding a listener to the saveButton which will do the opposite of the load Button and will take the same approach we've had to uploading data.

Note that we can only post to URLs for websites that we've created ourselves.

## Self Editing

Now we can actually ditch devtools and start editing the editor from within itself!

Here I can load the editor's source code into the textarea, add a change, and then save it back and see the change.

Ain't that cool?

## Making copies of files

https://agregore.mauve.moe

More like

https://myeditor/example.html

As I said before, we can't edit other people's websites and can only change things we have locally.

So, lets try cloning someone else's page and saving it to hypercore.

For example, let's save agregore.mauve.moe to our website under the new page example.html

We'll paste the agregore URL into our editor, click Load, then change the URL to point at our domain, and click save.

Now if we navigate to that URL, we'll see that the page got copied over, and we can start changing things.

## Tracking the edited file in the URL


```JavaScript
response = await fetch('hyper://myeditor/index.html', {
  method: 'put',
  body: `
<!DOCTYPE html>
<title>P2P Editor</title>
<style>
  @import "agregore://theme/style.css";

  body, html {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  #editor {
    flex: 1;
  }

  #controls {
    display: flex;
    flex-direction: row;
  }
  #currentURL {
    flex: 1
  }
</style>
<section id="controls">
  <input type="text" id="currentURL">
  <button id="saveButton">Save</button>
  <button id="loadButton">Load</button>
</section>
<textarea id="editor"></textarea>
<script type="module">
  loadButton.onclick = async () => {
    trackURL(currentURL.value)
    const response = await fetch(currentURL.value)
    const content = await response.text()
    editor.value = content
  }
  saveButton.onclick = async () => {
    const content = editor.value
    const response = await fetch(currentURL.value, {
      method: 'PUT',
      body: content
    })

    const resultURL = await response.text()
    currentURL.value = resultURL
    trackURL(resultURL)

    alert("saved to " + resultURL)
  }

  function trackURL(url) {
    const currentURL = new URL(location.href)
    if(currentURL.searchParams.get('url') === url) return
    currentURL.searchParams.set('url', url)
    history.pushState({}, '', currentURL.href)
  }

  const pageParams = new URL(location.href).searchParams
  if(pageParams.has('url')) {
    currentURL.value = pageParams.get('url')
    loadButton.click()
  }
</script>
  `
})
console.log(await response.text())
```

One last thing we should do in order to make this useful, is to make it easy to share links to people so they can view files in the editor and make changes themselves.

For that, we'll use the URL's searchParams and the History API.

First, we'll see if the page URL has the "url" parameter when we load.
If it does, we'll set the currentURL input to its value, and trigger a load by simulating a click on the load button.

Next, we'll add a function that will track new URLs, and if they aren't currently in the search parameters, we'll push a new state which will add it to the search parameters.

We'll also have the save button take the resolved version of the URL and save it back to the currentURL box to make it easier to share.

Finally, we'll have the save button and the load button add the URL they're using to the parameters.

With this in place, we can now easily link people to pages we'd like them to edit.

## Takeaways

So! After a bit of hacking around we've now got a basic text editor in just over 60 lines of code on a single page.

With this in place you can start doing more advanced things like splitting your editor into separate files with javascript and CSS being on their own, or you can start importing more robust text editing libraries to replace the basic textarea we used here.

And what's coolest to me is that this is running entirely without needing to use the cloud or any extra developer environements.

Any pages you author with this editor will exist for you offline and can be shared with people over local networks without needing to figure out an extra hosting provider or needing constant access to the internet.

Some friends and I are going to be working on making some more tools and tutorials along these lines, and I'm excited to work with more people to start making smaller scale tools that individuals can build for themselves and their communities based on open standards, and local-first software principles.

Thank you for attending, now go out there and make something!
