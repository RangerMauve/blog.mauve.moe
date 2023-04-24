# Agregore in Unity

One thing that recently got brought up in the [Agregore Discord](https://discord.gg/QMthd4Y) was that it would be nice if we could use Agregore on Virtual Reality headsets like the Oculus Quest.
Sadly, porting all the Electron-based code isn't doable since the Quest runs on Android, but it got me thinking about what it would take to reimplement Agregore with, say, Unity.
Here are some of the thoughts I had and some pointers to how it could be implemented.

## WebView + P2P protocols

The first thing that would need to be tackled is the actual Android Webview that will handle custom protocols.

As some may have seen in my [secret blog post about p2p web browsers](https://blog.mauve.moe/posts/making-a-browser.md), this can be done on Android by hacking their standard WebView class.

One limitation of the [hypercore-protocol](https://hypercore-protocol.org/) is that it's only been fully implemented in Node.js thus far.
With that in mind, we'll need to embed [nodejs-mobile](https://code.janeasystems.com/nodejs-mobile/getting-started-android) in our project and expose it to Java.

Ideally, we should have an HTTP server running on a local port which proxies the various [`fetch` APIs](https://github.com/AgregoreWeb/agregore-browser/tree/master/app/protocols) that Agregore hooks up to Electron on different URL paths.

After that we'll need to initialize a Webview and intercept any requests that it gets on the various protocols we support using the [shouldInterceptRequest](https://developer.android.com/reference/android/webkit/WebViewClient#shouldInterceptRequest(android.webkit.WebView,%20android.webkit.WebResourceRequest)) API
We'll want it to detect when a protocol we support gets invoked, create a [request](https://developer.android.com/reference/java/net/HttpURLConnection) to our Node.js proxy, and return a [WebResourceResponse](https://developer.android.com/reference/android/webkit/WebResourceResponse) from the response.

With this we should have a basic webview that can load content from all the protocols that Agregore supports.
I'm not 100% sure, but I think this will also enable the `fetch()` API to be used with custom protocols, too.

This could act as a sort of basic alternative to [Gateway Browser](https://gitlab.com/gateway-browser/gateway) which comes with a lot more bells and whistles than just protocol handlers.

Another alternative we could use for webviews is the [GeckoView](https://wiki.mozilla.org/Mobile/GeckoView) library, however I'm not sure whether it supports intercepting requests in Java, though it has the advantage of having WebExtension support.

## Rendering in Unity

Luckily, webviews are something that folks have already thought about rendering in Unity, and [this post on stack overflow shows how we can render to a texture](https://stackoverflow.com/questions/46479953/render-website-as-texture-in-unity3d-on-android/53582886#53582886).

Essentially, the WebView class can render to a custom `canvas`, and from there you can export a bitmap which can be shoved into a unity `RawImage` class which can then be put into a texture on screen.
After that, we'll need to simulate mouse and keyboard events on the WebView based on where a pointer intersects / have a virtual keyboard.
Simulating mouse events can be done through the `dispatchTouchEvent` API [directly on the webview](https://github.com/IanPhilips/UnityOculusAndroidVRBrowser/blob/259e80f5dcbcd882505a4ee9ae757705b7db5474/AndroidViewToGLRendering-master/unitylibrary/src/main/java/com/unityexport/ian/unitylibrary/MainGL.java#L154).

We can probably reuse the code from [this version of the UnityOculusAndroidVRBrowser project](https://github.com/IanPhilips/UnityOculusAndroidVRBrowser/tree/259e80f5dcbcd882505a4ee9ae757705b7db5474) before they migrated to use GeckoView as a basis.

With that in place we'll be able to render content off of P2P Networks on any virtual or augmented reality device that supports Unity and Android.

For example, this could let us use something like the [NReal Light](https://nreal.ai/) to render p2p web pages in AR that are loaded from p2p networks.
Since it's Android we could probably extend this with ad-hoc mesh networks and all sorts of goodies that would be useful for [local-first cyberspace](https://github.com/RangerMauve/local-first-cyberspace).

## WebXR

Rendering web pages in AR is already cool, but sadly it'll limit us to 2D frames that can load basic web content.

It'd be nice if we could render entire VR or AR scenes within the same space from the tabs themselves.
This is something that can be done in most built-in web browsers for headsets like the Oculus Browser, or Firefox Reality and it works via the [WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Fundamentals) API.

This API gives you acess to input devices from your headset sich as the head and hand position and provides APIs for rendering to the headset display.

Sadly, this API isn't built into the Android WebView, and what's more it wouldn't help if it was built in since we'd need to delegate to whatever APIs Unity provides.

It should be possible to inject a JS API into these WebViews via the [webView.addJavascriptInterface](https://developer.android.com/reference/android/webkit/WebView#addJavascriptInterface(java.lang.Object,%20java.lang.String)) API.
However, this would be avery big undertaking and you'd need to account for how different Unity plugins for VR have their own methods of rendering to the screen, as well as finding a way to unify all the interfaces.

Perhaps, once the Unity [Open XR](https://docs.unity3d.com/Packages/com.unity.xr.openxr@0.1/manual/index.html?_ga=2.31133754.429102726.1613167416-1349562428.1606597328#supported-platforms) Plugin matures, this will be a more doable task.

Of course I'd love to be proven wrong if somebody thinks this would be easier to do than I expected. 😁

## Next Steps

Sadly I don't think I have time to work on this with the dozens of other things on my plate, but I'd be happy to help give pointers to folks if they want to take it on.

Alternately if you want to fund work on this, feel free to DM me so we can sketch something out. 😁
