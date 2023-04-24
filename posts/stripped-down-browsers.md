# Stripped Down Browsers

## The web is great

I started learning programming in High School by using a toy language with graphics.

Instead of just following along with the class, I'd read up on the documentation to see just what the environment could do.

Copying examples, making changes, and combining them with other examples was fun and let me iterate quickly and let my imagination do it's thing.

After I made something, that's when the hard part would start. Different people in my life had different devices and operating systems.

This meant that if I wanted to share something, I'd need to create a binary per-platform, and have to convince people to install it.

Naturally, this was a pain for everyone involved, and it meant that I was pretty much the only one that saw the stuff I made.

Luckily, I started learning JavaScript and the web stack. Now, if I wanted to show somebody a thing that I made, I'd upload an HTML file somewhere, and send somebody a link. It didn't matter what device or OS they were using. They needed to click the link, and everything would Just Work™.

This kickstarted my programming carreer and I've been fiddling around with JavaScript and applications since.

The web gives us a lot of high level APIs, with great [documentation](https://developer.mozilla.org/en-US/), and with the promise that you can share your content with anybody in the world.

## Browsers are complicated

The thing is, even though we can build applications that run anywhere, it comes at a price.

Applications targeting the web are actually targeting a complicated operating system called "The Browser".

Each operating system supports some number of browsers, and the different browsers out there have minor differences and might support nor not support different APIs.

Since all the major browsers (except Firefox with Servo) basically all originated from the same codebases, and because they support multiple platforms, browsers are really heavy and take up a lot of resources to run.

This means that a simple application which might take kilobytes of RAM to run if done using the native APIs provided by an OS would take at megabytes of RAM to run in a browser.

A big part of this is that JavaScript applications have no choice but to make use of the Document Object Model (DOM) APIs provided by the browser, which was really geared towards creating and manipulating documents using HTML.

The DOM API surface is huge, and this means that any element you see on the screen has to support every single method and property that's defined for a DOM node.

This also means that you don't have much choice but to use the layout engine, another huge API with legacy support, provided by CSS in order to control how your application should work.

Unlike OS-level UI frameworks, we don't really get a lower level than this in browsers.

The default UI elements we have, are very bare-bones and look bad compared to modern applications because it's made for the UIs of the 90's and 00's.

Application developers and graphical designers want their applications to feel good, and as a result we have tonens of CSS frameworks and custom component libraries that have to hack CSS layout and the DOM in order to make the UI palitable to users.

This is in contrast with `native` applications where the OS provides you with a set of high level components which let you accomplish many of the tasks you'd want, along with a way to dig down into the lower level of the UI if you want to make something custom.

The reduced API footprint, and low level access of native applications means you can use far less resources to make the same kind of application.

This is complicated further with the introduction of stuff like Electron where people want to use the cross-platform benefits of the web, but end up taking up huge amounts of RAM because of the CPU and RAM cost of running a web browser.

The other problem here is that creating a new browser to address some of these concerns is impossible without dedicated teams due to the sheer size of the API surface and need for backwards compatability.

These "problems" are actually features which let people do whatever they want, without having to think too much about the details of how it works or whether it's going to be efficient.

This is great for getting something out there with little effort, but it's awful for making good use of computing power and battery usage.

## ANSI / Terminal graphics

Before we had Netscape and graphical interfaces were the norm, applications were written to be used within a terminal, and if they wanted a GUI, they had to use text to draw it.

The interface for a user would be what's called a TTY, or Terminal. This would either be a physical device with a printer, or in more modern times, it'd be a monitor. This would be paired with a keyboard to provide text input to an application.

In order to make it efficient to update the screen, developers would use a standard set of [ANSI escape codes](dat://0a9e202b8055721bd2bc93b3c9bbc03efdbda9cfee91f01a123fdeaadeba303e/posts/stripped-down-browsers) which are special sequences of characters the the terminal would interpret as commands for drawing on the screen, or moving the cursor around.

Terminals and ANSI grapics are **fast**.

One of the reasons they're so fast is the fact that the API surface for what you can do with the graphics is so low.

You can draw a character with some minimal styling anywhere on the screen, and you can get input from the keyboard.

There's no DOM or CSS layout engine to sit in between the application and the user. There's legacy support for older terminals, but it's not that big and the fallback is fairly graceful.

When you load a command-line application, you don't have to wait for Electron to boot up and load millions of lines of code for the UI to initialize. You don't have to worry about complex layout reflows taking time to render anything on the screen. You just start the application, and it's up. Your main bottleneck is the IO to the disk and network, and whatever computation the program is actually performing.

Of course, CLI applications have some flaws. You can't do fancy, non-text, graphics, you're limtied by how fast you can generate changes that can be processed by your terminal, any layout or interactivity has to be done by hand or by a framework, and accesability for different input devices and screen readers is difficult and left as an afterthought.

Also, terminal graphics were great when the main input device for computers was a keyboard. But these days users are using mice, or more likely, a touch screen.

Even though it probably doesn't make sense to go back to ANSI just yet, we can lear a lot by constraining what we can do, and limiting the API surface to improve performance and do more with less power.

## AMP / Text-only views

Modern web pages, especially on content-centric websites are needlessly bloated. They have huge amounts of javascript and CSS loaded for social media widgets and advertisements, and as a result web pages take up huge amounts of bandwidth and don't show enough content.

This sucks, but it especially sucks for people on weak devices or metered internet connections.

Luckily people have noticed that this is a problem, and there's been an effort with [Accelerated Mobile Pages (AMP)](https://www.ampproject.org/learn/overview/)  which is mostly led by Google to help content creators constrain their applications to a subset of the web so that their pages can load quickly.
It works by providing a set of custom elements, and automated testing which restricts the amount of JS a website can load, and provides a few high level components for presenting content to users.

On paper this is great, but there are still some issues with this appraoch.
The main one is the sketchyness of Google wanting to pull data from AMP pages and show it under their own domain, along with how Google is enabling tracking and seizing control for themselves.
The less tinfoil-hat problem is that even though we're supporting more constraints, this only applies to content-centric websites and doesn't scale well for applications.
We also are still relying on Browser engines which as mentioned earlier, take up a lot of resources right out of the box.

In addition to tools provided to content creators, browser vendors themselves are trying to tackle the problem of getting rid of the clutter on the web.

[Firefox](https://support.mozilla.org/en-US/kb/firefox-reader-view-clutter-free-web-pages), [Chrome](https://www.ctrl.blog/entry/chrome-simplified-view-android), [Edge](https://www.laptopmag.com/articles/turn-reading-mode-microsoft-edge), and [Safari](https://www.cnet.com/how-to/customize-the-appearance-of-safaris-reader-mode-on-ios-9/) all support some form of "reader mode" where the browser strips out everything from a webpage that isn't strictly related to it's content in oder to provide users with a clean interface without cruft blocking everything.
This simplified view also drastically improves performance because the browser can ignore all the extra APIs and focus on rendering just what's needed in the most efficient way possible.

This is a great step in the right direction for making it easy to share raw content, but for applications we'll still need a little more.

## ARIA / Accessability

An important thing tha the modern web is getting right is a focus on accessibility. Aside from the [design guidlines](https://www.material.io/design/usability/accessibility.html) published to help web developers make their designs visually accessible, there is also a strong focus on supporting screen readers within the DOM itself.

The short of it is that screen readers parse the DOM on a page into something that's semantically meaningful. It takes you tree of div spaghetti and turns it into something you can jump around with using heading titles, or reading sections of the page aloud when using a touch screen.

This is accomplished by having the DOM elements on the screen make use of semantics that help a machine process what kind of information is being displayed in order to give visually impaired users a view of the content that's easier for them to process.

The basic guidlines for this is to use the `Button` tag for buttons, use `h1-6` tags for headings, and group logical sections of text in the `section` element.

In addition to semantic HTML elements, browser vendors have added special HTML attributes which can help a screen reader understand what your app is doing when you're creating interactions using JavaScript and CSS.
These attributes and APIs fall under the name [Accessible Rich Internet Applications (ARIA)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) and are supported in all major browsers.

An important example is the situation of adding `display:none` to an element when you don't want it visible on a screen. To a visual user, it's obvious that the element isn't relevant as it's not visible on the screen. To a machine reading the contents of a site, it still sees the element in the DOM. In order to help screen readers, you should add the `aria-hidden` attribute to your element which will inform the screen reader to ignore it when describing the page to the user.

In addition to attributes describing dynamic states for elements, ARIA defines a set of [roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) for elements on the screen.
These roles define a set of standard user interface items such as Buttons, TextBoxes, and items which the web doesn't have out of the box like dialogs or switches.
These `aria-role=""` attributes allow developers to give semantic meaning to custom widgets which would otherwise look like a bunch of divs with CSS attributes to a machine.

These roles cover most of the user interface patterns you see in apps both on the web, and in native applications.

If anything else, I suggest people reading this article consider designing their applications using ARIA roles as their inital design goals insead of trying to fit ARIA in their code after the fact. Accessiblity isn't too hard, and thinking about how impaired users will interact with your system will help you design interfaces that are good for everybody.

## MVP cross platform UI

What if instead of providing a high level API with a lot of bloat, we provided a high level API with a focus on minimalism.

I believe that something similar to the DOM using the component types defined in ARIA roles should be the actual high level building blocks of the web instead of forcing developers to rebuild them using less efficient methods like pyramids of divs with loads of CSS.
[Android](https://developer.android.com/reference/android/view/View) and [iOS](https://developer.apple.com/documentation/uikit/uiview) both have the concept of a "View" which is the basic building block for UI elements.
This class provides some basic interfaces for grouping stuff together, and a way to define how the element should be displayed on the page.

React-Native made great progress in abstracting away platform-specific UI code with a high level component library.
The same could be done for the web as a whole.

The MVP would focus on loading content from the web and just rendering the semantic information like reading mode.

From there, one would need to create a minimal DOM-like API for working with the component higharchy on the screen.
At this point you'd start introducing JavaScript and various other Web APIs to the new browser so that developers can start making applications that they can distribute using the same mechanisms as the rest of the web.

With a smaller component and API footprint, it should be easier to port this technology to different platforms.
A lot of the logic used to render a web page using Android APIs, could be converted to instead render components on OSX.

In addition to supporting native components, this would be a great place to start building a modern text-mode browser with support for JavaScript by using an ANSI component library to render the UI instead of the heavy graphics we're used to.

## Backwards compatability

Before even giving access to this UI in JavaScript, it'd be useful to take the approach of Simplified views, and have that, along with ARIA-compatible UI components be the building block for the legacy web.

What if you had a browser that ignored the CSS and extra DOM, and instead parsed out just the semantic content of the page.
You could take that semantic content and render it to native UI elements which would make all web content feel like a first-class feature of the OS, and would help performance since you wouldn't need to bother with layout engines outside of what the OS provides out of the box.

This would of course break most of the web.

However, a lot of the web could still work, and some apps would still be usable if they're already following ARIA guidelines.

The goal is to degrade semi-gracefully so that at the very least content will still work.

## But what about creativity?

So, one of the things I love about the web is how easy it is to sketch up a cool UI or game by hacking around with CSS and shoving some divs on a page.

I have no idea what to put here yet other than using canvas. 😭

## Security, Privacy, and Advertisements

## Roadmap

- Identify ARIA roles for common UI elements on the web
- Build tool for converting HTML to simplified elements (ESM)
- Build text-mode browser to view simplified elements (Use Webrun / JSDOM)
- Support legacy HTML in browser (Convert HTML to elements, render the elements)
- Add JS and common browser APIs
- P2P web!!
- Build desktop app to render elements using [libui](https://github.com/parro-it/libui-node)
- Build a mobile app using native UI components (Nativescript?)



