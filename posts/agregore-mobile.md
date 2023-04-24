# Agregore Mobile

This post will talk about a design for an Android based web browser which will support all the peer to peer functions of Agregore.

## Why

Agregore is nice in that it supports Windows, MacOS, and Linux all in one go.
This works for people that use Laptops and Dektops as their daily drivers, but it doesn't account for all the other scenarios.
Most people's experience with computing these days is a phone, and if we want the Peer to Peer web to be viable, we need to bring it there.
That said, making a custom web browser for iOS is a bit of a non-starter, and I'm going to focus on Android first.

## Android WebView?

So, the obvious place to look for making a web browser on Android is the built-in [WebView class](https://developer.android.com/reference/android/webkit/WebView).
In fact, there have been a few attempts to use this for peer to peer browsers in the past.
Namely [Bunsen Browser](https://github.com/bunsenbrowser) and more recently [Gateway](https://gitlab.com/gateway-browser/gateway/) which used React Native to not only support Android, but also iOS.
They use a trick using an API called [shouldIntercceptRequest](https://developer.android.com/reference/android/webkit/WebViewClient#shouldInterceptRequest(android.webkit.WebView,%20android.webkit.WebResourceRequest) which lets you intercept requests that a webview makes and return some custom data rather than what it would have done by default.

This works great for loading data, but it falls short when you want more advanced features.
Even if you can load `ipns://` URLs, they won't be recognized by the rest of the browser.
This means that the browser won't be able to detect the `origin` of the URL, the `URL` constructor won't be able to parse the URLs correctly, and any APIs that require secure origins (like ServiceWorkers) won't be available in your custom protocol.

If we want to have full integration, we'll need to go lower level in the web stack and access the same APIs that Electron uses to enable these functions.
Specifically, we'd want to have access to the [AddStandardScheme API](https://source.chromium.org/chromium/chromium/src/+/master:url/url_util.h;l=63?q=AddStandardScheme&ss=chromium%2Fchromium%2Fsrc:url%2F) and other URL-related functions.

## Chromium

So, luckily Chrome is open source and Google has been gracious enough to release all of the code needed to compile the WebView class.
With the Chromium source code we can access those C++ portions of the WebView which we couldn't otherwise.
Specifically, I propose creating an alternative system WebView based on Agregore which will enable the same protocols as the desktop app.
With the WebView approach, a person can install Agregore as the default system WebView which will then get embedded in any applications on the phone.

In addition to this, I think it would make sense to have a minimal browser shell that works along the same lines as Agregore on the desktop.
I think that since I enjoy privacy, and don't enjoy most of the creepy stuff Google does, it'd be useful to base the WebView off of [Ungoogled Chromium](https://github.com/ungoogled-software/ungoogled-chromium-android/) which will give us a nice starting point.
Potentially this is where we can get Extension support into the system, too.

## Node.js and Unix Sockets

So, in order to make the peer to peer stuff work, we'll want to reuse the Node.js modules used in Agregore.
We can simplify some of the code by using UNIX domain sockets and make HTTP requests over them from the Java side / handle them on the node side.
With this we can bundle a Node.js binary with the project and run it inside a basic Android service.
It will listen on domain sockets for different protocols and pipe connections into Node's HTTP parser to handle incoming requests.
The Webview will be able to make requests to the domain sockets without needing to mess too much with inter-process communication.
Potentially we could provide client libraries for other Android apps to talk to the service, but that's a TODO for the future.

## Changes to Agregore Desktop

In fact, this Unix Socket thing could be useful for Agregore in general since it means we can offload protocol handling code from the main Electron thread and avoid bottlenecks in the event loop.
It might be useful to play around with this on desktop OSs first, and then port it to Android once it's stable.

## Next Steps

Sadly this is a big undertaking and I don't have time to work on it in my spare time.
So if anybody wants to fund a fancy P2P-enabled Webview, or wants to take a shot at doing this themselves, hit me up. 😁
