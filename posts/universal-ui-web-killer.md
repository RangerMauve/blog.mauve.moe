# Universal UI - The Web Killer

This post will go over some ideas I have about a post-web approach to universal GUI applications with a focus on accessibility and OS integration.

## Background

A lot of people love to complain about how the web is bloated and how we should be using native apps instead.
Often time people will point to how bundling the entirety of [Electron](https://electronjs.org/) into their app makes apps huge and wastes a lot of space on systems.
They'll also point out how Chromium based apps end up taking up loads of RAM and CPU spread accorss several processes for something that a native app could do in a few kilobytes of ram.
People also love to shit on JavaScript in general, but I don't want to get into that here.

These are all reasonable critiques, but they pale in comparison to the difficulty in getting a similar level of application distribution without using the web.
Specifically, I'm thinking about distributing applications that can run on either Windows, Mac OS, Linux, Android, and iOS.
Maybe not all of them at once, but probably a few of them.
Even though native apps can lead to more efficient applications, they all end up having vastly different approaches to the APIs used for the UI structure as well as how applications are fundamentally structured.
In some cases like Windows, there ends up being a bunch of GUI "backends" coexisting at once from the Windows XP era, Windows 7 era, and the zany stuff that Microsoft came up with for Windows 8/10/11.
In the case of MacOS, they end up deprecating old GUI frameworks which result in developers being forced to do major rewrites.
Similar issues exist on iOS and Android.

Some cross platform GUI toolkits sidestep this issue by completely ignoring the native UI libraries and focusing on rendering native-looking UIs instead.
This is the approach of tools like GTK and QT.
As a result, they give app developers a path to running *their* GUI code on whatever platforms are supported, but the apps end up *feeling* like they don't belong due to the subtle differences.

The other issue with getting cross-platform UIs working is that even if there is a tookit that fits your needs, it might not have the bindings for your language of choice.
I recently tried to try out some Rust based GUI bindings, and the common theme was that bindings either didn't exist, were extremely limited, or didn't produce UIs that matched the native os theme.

The nice thing about the web is that it focuses on a specific set of features, and has implementations that run on different OSs.
The less nice thing is that it ends up creating a sort of OS of it's own with it's own ways of doing everything which end up not feeling "native".
I believe we can have something similar to the web in that the UI elements are commonly defined and we can have dynamic scripting.
However, I propose focusing on Accessibility-First primitives, and WebAssembly instead of the traditional DOM or HTML model.

## Accessibility

## UI Component List

- Text
	- labels / paragraphs
	- rich text
	- lists
- Hyperlinks
- Buttons
- Image
- Video
- 3D Model
- Canvas
- Inputs
	- single-line inout
	- text area (rich text?)
	- slider
	- checkbox
	- etc

## API needs

- Permissions API
- Interact with the UI
	- Create and delete components on the fly
- Networking

## Backwards compatibility

- Basic HTML rendering
