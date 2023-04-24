# Self Contained Seeding (Pinning) Services

Currently, Hashbase is the ideal place to go if you want a reliable host to seed your data.

This is great for getting people started with seeding, but it introduces a point of centralization that relies on connectivity to the hashbase servers, and it makes it harder to migrate lists of seeded archvies away to other providers or your own hosts.

Adding a Dat URL to be seeded by some service should be as easy as creating the Dat in the first place.

I think that a person's seed list should be contained in a dat archive, and you should share that archive URL with a seeding service in order for it to start seeding your stuff.

This will make it even easier to switch between seeding services since you won't have to try to manually copy all of your URLs to the new provider.

This also opens up the possability for the list to be self hosting.

The idea is that within the seed list archive, you have a JS file which uses `import.meta.url` to get its archive URL and creates `DatArchive`s for each URL being seeded, and listens for changes in the list using `archive.watch()`.

This can then be opened in [Beaker](https://beakerbrowser.com), or [webrun](https://github.com/RangerMauve/webrun).

If somebody wants to start using a seed list, then can open up the template seeder archive, fork it, and send the new URL somewhere (webrun, or a seeder service).

If a person wants to set up a personal seeding service, they would no longer need to figure out how to set up [homebase](https://github.com/beakerbrowser/homebase) and get something going with a forked Dat and a single command line command.

After you have the URL shared somewhere, you can use a web page within the archive itself to start adding and removing archives from the list.

You can do this while offline and it will eventually get synced with whatever is seeding the content thanks to Dat's built-in replication.

With all this in place you now have a standard way of managing your seeded archives, and it's all offline / p2p first.