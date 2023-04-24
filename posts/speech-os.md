# Speech OS 🗨

I really like the wave of speech-based assistants that have gained popularity.
Devices like the Amazon Echo, Google Home, etc, are a new paradigm for how people can interact with computers, and what a computer really means to people.

One of the things I really like about these devices is the speech aspect.
In order to interact with the device, you don't need to be able to stare at a screen, operate a keyboard, or even pay direct attenion to the device outside of listening for it's responses.
This means that people with visual and physical impairments can likely use the device without any extra accessability features.
This also extends to people that don't have these impairments, too.
You can speak to the machine, and it will speak back to you.

## The Cloud Sucks ☁

The main issue I have with all of these devices is that they're cloud-native.
When you speak to it, it sends your voice to a third party's servers, the command gets processed by those servers, and the servers generate the response.
This is great in a way since it lets your device be very low power and it abstracts the interaction with the service away from specific devices and to a users account.
It also allows the provider to updated and add services without any action on behalf of the user.

Although I appricate the benefits of this model, there's three things that make it a deal breaker: The inability to work offline, the lack of privacy, and the difficulty in customizing your assistant.

### Not everything is online 📴

I've got ADD and it's sometimes hard to keep track of things or to stay on tasks.
That's one of the reasons I really like using the Google Assistant on my phone.
If there's a task that I need to remember to do, I can just say "Ok Google, Remind me to get cat food tomorrow at eighteen thirty" and move on with whatever I'm doing.
Then, once the task needs to be done, I'll have a reminder ready for me so that I don't forget.
Of course I could use other methods like writing notes in my phone, or using a calendar app of some sort, but this hands-free and speech based approach works well with how my head works.
This makes it extra frusterating when I'm in a parking garage or an elevator and after saying my reminder, my phone spits back the phrase "Sorry, I can't do that while you're offline".

Why is it that I can't add a reminder on my phone or take a note? Why is it that I can't use _any_ speech based apps unless I talk to Google first?
I think that a lot of applications are better off being offline-first. If my data isn't being pulled from somewhere, and it doesn't explicitly have to be shared with a third party to work, I shouldn't need the internet.
In fact, even if it does need to be shared with an online service, it should still work offline as much as possible.
If twitter needs an internet connection to send a tweet, my device should be able to defer sending it until I'm online.

Although we get a lot of benefits of having speech applications exist in the cloud, it makes speech based applications a second class citizen with regards to the sort of programs that can be created.

### Don't analyze me 🔏

Cue `tinfoil hat`.

Another obvious problem with sending all your data to a third party, is that they now have access to all of your habits.
I'm not going to go too far into it, but the Amazons and Googles of the world are pretty sketchy when it comes to analyzing people and selling their personal information to third parties for who knows what.

When you send all your voice data to a third party, they get the ability to not only fingerprint you by your voice, but use it for things like speech synthesis that can impersonate you.

It's OK if you don't mind these things, but the technology doesn't give you a way to opt-out at the moment, and I beleive it should.

### Let me make scripts 📜

If you have an idea for an app to run over these assistants you need to first:
* Create an account with the service
* Create an HTTP server somewhere (probably a few sets if you don't have one)
* Configure the service to use webhooks on your server for commands
* Associate your test device with the service and your new app
* Write your code

This works, if you're ready to go through all that effort and don't mind making HTTP servers.
I get that it's there to let people use their own infrastructure and own code stack, but it's much more daunting for a beginner than creating a script and running it right away.

It'd be cool if the device acted like a shell like Bash, but with speech. Then you could write small text based programs that could invoke and interpret other text based programs.
You could have a note taking program, and have another program prompt you to take a note on a given schedule.
Note that I don't expect these programs to work the same as a chat bot.
Chat bots are cool, but I'd really like to have something that's more akin to giving orders to a robot. Although it might be less "intuitive", commands could be documented and it'd be a lot more obvious as to what your device can and can't do, in addition to being able to explore the commands a program has.

This should be paired with the ability to have actual programs installed on the device which is what you can do with pretty much any other computer you own.

## MVP 😀

Although I don't have the time or money to invest in making this into an actual product, I want to design how it would work if I could. Feel free to steal my idea and follow my design. 😉

### Hardware support 💻

In order for this device to be useful, it would need some basic hardware to actually run on.

- An optional physical microphone
- Bluetooth support for external headsets (unless it's being embedded in one)
- An OK CPU so you can run programs and speech recognition
- WiFi or Cellular connectivity, for internet access when we need it.

I think that to start, a [Raspberry PI](https://www.raspberrypi.org/products/raspberry-pi-3-model-a-plus/) would be sufficient, or any other popular SBC like the [Khadas VIM2](https://www.khadas.com/vim) or a [Rock64](https://www.pine64.org/?page_id=7147).

### Kernel / OS 🖥

Since SBCs usually support Linux, and Linux gives us a lot of flexability with what we include in the OS, it's the way to go.

It should have something installed for interacting with bluetooth, audio, and networking.

Since this is going to be speech based, it doesn't need to support graphics at all.

### Loading apps 🏗

Similar to how Android works, apps should probably run as separate users to have security boundries between them.

Apps shouldn't be actual executible binaries in order to avoid platform-specific compilation issues.
As such, I think that focusing on JavaScript and [WebAssembly](https://webassembly.org/) is the way to go.
JS is a general purpose language that gives people a lot of flexability, and there are a lot of different flavors of languages that compile down to it.
WebAssembly is there to fill in the gaps where JS is too slow.
It lets you compile C/C++/Rust programs into a binary instruction set that is easy to translate into machine code, but is constrained to prevent malicious code from escaping it's provided sandbox and accessing memory it shouldn't.

Apps should be folders which contain an `speech.json` manifest which contains metadata about the application like the permissions it requires and the set of commands that it supports.
Each app should have a main `activation command` and describe it's subcommands. The subcommands will then map to `.js` or `.wasm` files which will be envoked when the command is spoken.
Installing an app should involve creating a folder somewher, and running a command to associate it's commands with the OS.
It should be possible to for users to remap the `activation command` to something else after installing the application.

When a command is invoked, it can reply with a sentance (need to add a limit on size) and wait for more input.

### Speech Scripting ⌨

Not entirely sure what to put here yet, but it should be possible to have a high level programming language in English which a person could speak instead of coding.

This language should primarily rely on executing commands, and doing basic conditional logic and string manipulation with them.

Separating statements should use the keyword "period". Whitespace in the scripts should be processed out.

Scripts should be started with the command `define a script called <name>`, and will invoke commands with the `say` command.
Whenever a command is run, the output will be saved to a temporary variable, which will stay until another `say` command runs.
It will be possible to make `if -- otherwise` statements here.
Not sure what sort of questions can be asked about the results yet, but basic things like interpreting the result as text, asking about specific indexes of words, seeing if a word is within the statement, and basic greater than / less than questions about numbers.
When running `say`, it should be possible to add `out loud` in order to have the result output to the user instead of parsed by the script.
Scripts can run `speak` with any text in order to have that text output to the user.

e.g. 

```
define a script called what's the mesage of the day.
say read somewebsite.com.
say out loud second paragraph.
finish.

---
or
---

define a script called is it daytime.
say what hour is it.
if greater than six and less than nineteen.
speak Daytime.
otherwise.
speak Nighttime.
```

### Nesting / Prompts 💬

It should be possible for a script to invoke another script and get it's results.
However, scripts may want to access prompts from the user directly for security purposes.
Some scripts, for example, might be priviledged and it would be dangerous to invoke it without the user's consent.

### Scheduler ⌚

Some sort of service (probably [cron](https://crontab.guru/) or event based?) should be in place to allow scheduling things to happen at certain times.
This should be available to JS/WASM as well as a high level command for users.
The scheduler should have limits on how precise it is and have limits on how often an app can schedule things and should require user input to confirm schedules when they're created.
All scheduled actions and the name of their origin app should be available to the user and should be cancellable.

Example events that would be useful in addition to cron schedules:

- `restart` - Runs when the device has restarted and initialized
- `reconnected` - Runs when the device reconnects to the network
- `sync` a user configurable / high level event that should be used for applications trying to sync data

### Alerts 💥

Now, most speech based apps should be unable to grab a user's attention without their consent, but it should still be possible for an app to queue up a notification to users in the background.

As such, there should be three levels of alerts: `None`, `Passive`, `Active`.
`Passive` alerts will be buffered up in the background, and will be waiting there for the user to ask for the status.
`Active` alerts will be pushed to the user as soon as they're created. Users should be able to configure what level of alert an app has.

### Speech emphasis ❗

Similar to how ANSI escape codes can be used to send hints to TTY for adding colors to a screen, there should be escape sequences for hinting at emphasis on certain words with either volume or pitch.

No idea how to do this yet, but I think it'd be cool.

### Structured text / Documents 📚

When screen readers interact with graphical OSs, they build up a tree of headers which help people navigate large amounts of data.
Speech OS should have a standard for representing higharchies of data

### Caching 📦

The OS should support loading content from different protocols like `https:`, `dat:`, `magnet:`, and `ipfs:` / `ipns:`.

This will be built into a high level fetch API available to JS and WASM, and should handle offline caching with a Least Recently Used mechanism for deleting old data.

### Interacting graphically 🖼

Devices that support video output should have a basic commandline-like shell which takes in speech commands from a keyboard, and outputs the results as text and 

### Built-in (OS) commands 🏠

- `install <path> - <confirmation>` installs an application from a given path in the FS, asks the user to confirm before installing
- `read <url>` Reads a URL, attempts to convert it to a structured document, and provides commands for navigating it.
- `play <url>` Reads a URL, attempts to interpret it as an audio file, and play it.
- `schedule - <command> - <schedule>` Asks the user for a command to schedule, and then which schedule should be used.
- `what's the your status` Gives a status report about the device, lists the time, network status, battery (if it exists), and number of alerts.
- `open configuration` Starts an interactive session for configuring OS settings like scheduler and alert preferences and app specific permissions.
- `finish` This can be said at any time in order to exit the current application and go back to the root command interface.

### Permissions

As mentioned before, apps will need to list all permissions that they want to access. Here's some ideas for what those would be.

- `network`: Should list URLs or URL paterns for requests an app wants to make
- `schedule`: Should be present if the app will want to attempt to schedule commands to run later. Should list CRON patterns or events that this script wants to bind on.
- `files`: Should be present if the script wants to save files. Should specify the amount of data it wants allocated to it in MB. This can be adjusted by the user at runtime and the app should have APIs for querying it's storage quota.
- `notifications`: Should be present if the script wants to send alerts to the user. This is configurable by the user and the app has no way of knowing what level it's been granted or if it even has it granted.

## Nice 👌

Hopefully this was an interesting read, and if you're interested in making this happen, hit me up on Twitter or send me an email.



