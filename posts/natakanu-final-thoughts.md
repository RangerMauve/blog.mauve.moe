# Final Thoughts about Natakanu

Following from my [previous post about Natakanu](./natakanu), I'd like to talk about my experiences working on the project and what I think some future steps could look like.

## Thoughts about the process

Working on Natakanu has been really fun. The folks at [Wapikoni Mobile](http://www.wapikoni.ca/home) were really kind and inspiring.

I liked their approach of talking to various indigenous groups and figuring out what sort of workflows they had and what sorts of pain points this software could help with.

Overall our workflow looked like:

- Having a session to talk about ideas and what would be useful
- Summarizing ideas as features
- Splitting up the features into steps
- Putting them on a roadmap
- Implementing a set of features  as a release
- Reviewing what we have and repeating the cycle

Throughout this process, we were thinking about how to keep the user experience as simple as possible and to make srue stuff would work on the local network as well as the internet.

I think one thing that would have been nice would have been to get it in front of users more frequently throughout the process, but the few group calls we had were very useful for finding areas that needed improvement.

I was pretty happy with how it went since it led to each version of the app resulting in something that was usable and would take us further to our final goal.

## Room for improvements

Although working on Natakanu was overall fun, there were some things that got in the way around the code structure in general.

Before I had joined up, there was an initial boilerplate that was put together based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate) which was probably useful for getting a React + Electron app together out of the box, but made a lot of other things harder.

Redux is a useful library and it provides a lot of interesting developer feautres such as time travel debugging.
However, this comes with a bunch of added complexity, especially when it comes to using async code (which the app has a lot of due it's p2p stack).
Eventually, I ripped it out and repalced all the redux code with regular [React Hooks](https://reactjs.org/docs/hooks-intro.html) which made the code a lot easier to work with and easier to understand.
In addition to hooks, I added in [React-Async](https://docs.react-async.com/) which provided high level modules for waitng for stuff to load, and [use-async-generator](https://www.npmjs.com/package/use-async-generator) for watching changes over time. 

Another thing that needed to be wreslted with was the jest testing framework. At one point the tests started hanging and there was no way to run them in a debugger or to output console logs.
In the end I had to figure out the bugs within the app instead instead of in the unit tests.

These high level tools can seem appealing, but when they have issues they make everything that much harder to work around compared to putting together lower level tools yourself.

In the future I'd probably try to avoid boilerplates that pack so many things in one place.

## Feelings about the result

When I was adding in some last minute features last week, I was feeling almost giddy when I saw the features coming together.

Here's what it looked like:

- I installed the app on two of my computers
- I launched them and created "accounts" on each device
- Then I opened up the Online Accounts page
- They were already seeing each other so I could browse files
- I decided to test the new Private Circles feature and change my circle name on both computers
- All other online accounts went away and I could just see my two comptuers
- I switched back to the default circle and everyone came back

One thing that felt nice about this process is taht everything was very reactive and I could see changes happening right away, all while knowing that behind thes scenes there were no servers being involved and it was all happening locally between the computers of the people I saw on the screen.

Another thing that felt magical was our implementation of collaborative editing of a single project folder.

If I wanted to allow people to add files to one of my projects, all I had to do was press a checkbox.

Then, anyone that was connected to me while looking at my project could click a button to request access, and be automatically added to the project.

From there either one of us could modify it and it'd propogate changes to everyone that had the project loaded.

It doesn't sound like much, but I was really happy with how it Just Works™️ .

I think that what we came up with is fairly versetile while having a minimal set of functions that needed to be implemented and maintained.

It'll be nice to hear how groups find it when they start deploying the app in their daily workflows and pushing the limits a little.

## Looking forward

I think that putting together Natakanu has been useful for getting a conversation started on how local-first and peer to peer technology can start empowering indigenous groups, and people around the world in general.

It shows us that we can connect people together within their communities without having to have all our data owned by a third party cloud-based company.

Going forward I think it would be nice to leverage some more of the strengths of local-first software beyond it's ability to do the same data sharing as the cloud.

Specifically, I think it would be useful to reach out to groups that have very little internet or overly expensive internet connections and see how we could enable them to use local-first tech within their local networks so that they could be productive without needing to worry about the costs.

Ideally, it would be nice to experiment with [community mesh networks](https://tomesh.net/) or [ad-hoc phone based mesh networks](https://github.com/calm-rad/MeshTest) and then using local-first software on top of it to leverage the strengths of both.

With this combination people can carry their important data with them and share them with communities the same way information can propogate by word of mouth or oral traditions.

Lastly, one thing that I'd like to address is how Natakanu needed to be an [Electron](https://www.electronjs.org/) app and required us to fiddle around with native dependencies and package distributions accross Linux, Windows, and MacOS.
This poses a higher barrier to entry for applications than I'd like.
I think in the future it would be nice to partner with groups on making local-first web apps with P2P-enabled web browsers such as [Agregore](https://github.com/RangerMauve/agregore-browser) and [Gateway](https://gitlab.com/gateway-browser/gateway).

What this will enable us to do is to worry about the platform-specific code within these browsers, and when it comes time for folks to actually make an app, they can put together a Web app, and use the p2p protocols to distribute it across all devices.
An interesting thing that comes out of this is that applications are now another form of data and can be authored and transmitted just like anything else.
I'd love to talk to people and instead of telling then "tell us what you need and we'll make it for you", saying "Tell us what you need and we'll help you make it".

I think that a big factor of local-first tech to me is strengthening communities and bringing power back in their hands from corporations / external groups.
I'd love it if I could give people tools for making their own tools and decisions and to give their communities the creative freedom to decide what they want technology to look like and to decide what it should do for them.

Ultimately I'm excited to see these first steps, and I'm even more excited to see how we can empower people in the coming years.
