# Migrating Mastodon

Here's a quick writeup of the steps I took to move my Mastodon [One Click Digital Ocean](https://marketplace.digitalocean.com/apps/mastodon) deployment to use a separate volume for storing data in order to avoid maxing out my disk usage.

## Intiial Setup

I followed the handy wizard that the one click deploy gives you and set up my DNS settings to point at the server and configured the email account needed for it to send invites and notifications.

## Folders to track:

- `/var/lib/redis`: Where the redis database is stored
- `/etc/redis/redis.conf`: Where the redis config is stored
- `/etc/postgresql/`: Where the Postgres config is stored, not gonna touch it directly
- `/etc/postgresql-common/`: Not sure but more configuration stuff?
- `/var/lib/postgresql/`: The data for postgres
- `/home/mastodon/live`: The bulk of the configuration and source code for mastodon
- `/home/mastodon/live/.env.production`: The actual config file with the bulk of info

## Approach

Scaling up my DO droplet's SSD whenever I ran out of disk isn't very cost effective and is annoying to reverse.
As such the goal here is to migrate the bulk of the data to a [Digital Ocean Volume](https://docs.digitalocean.com/products/volumes/) which I can scale independenty and save a bunch of money.
Having all the data on an external volume also makes it a bit easier to run backups on the data that I actually care about so in the future I can make restoring or migrating to a different VM that much easier.

The first step I took was to back up all the most important data to the external volume.

Before copying the data, I made sure to stop all the mastodon related services and databases.

```
systemctl stop mastodon-*
systemctl stop redis*
systemctl stop postgresql*
```

I used `cp -r` to copy over folders.

```
# Create folder structure
mkdir /mnt/mastodon_data/var/lib -p
mkdir /mnt/mastodon_data/etc

# Copy over important data and configs
cp -pr /var/lib/redis /mnt/mastodon_data/var/lib/
cp -pr /var/lib/postgresql /mnt/mastodon_data/var/lib/
cp -pr /etc/postgresql /mnt/mastodon_data/etc/
cp -pr /etc/postgresql-common/ /mnt/mastodon_data/etc/
cp -pr /home/mastodon/live /mnt/mastodon_data/live
```

One thing I found was that even though I mounted the new volume, it wasn't taking up it's full size.
To account for that I had to run `resize2fs /dev/sda` to make the volume fit.
I found that from [this help doc](https://www.digitalocean.com/community/questions/disk-size-not-enlarged-after-upgrade).

After checking that the copy wasn't missing data (with ls), I renamed the old folders, and created symlinks to the volume folders.

```
mv /var/lib/redis /var/lib/redis-old
ln -s /mnt/mastodon_data/var/lib/redis /var/lib/redis
chmod -R --reference=/var/lib/redis-old/ /mnt/mastodon_data/var/lib/redis
chown -R --reference=/var/lib/redis-old/ /mnt/mastodon_data/var/lib/redis

mv /var/lib/postgresql/ /var/lib/postgresql-old
ln -s /mnt/mastodon_data/var/lib/postgresql /var/lib/postgresql
chown -R --reference=/var/lib/postgresql-old/ /mnt/mastodon_data/var/lib/postgresql/
chmod -R --reference=/var/lib/postgresql-old/ /mnt/mastodon_data/var/lib/postgresql/
chmod -R 0700 /var/lib/postgresql/10/main/
```

Make sure that the folders have the same ownership as before so that the system services may still access them.
(This is the purpose of the chmod and chown commands)
I skipped over the etc bits and focused on the actual data.

Then, I tried to run all the usual Mastodon services as a sanity check that it could actually run.
I had to fiddle a bit with making sure the permissions worked, but eventually I got my Mastodon server booting up again.

Once I confirmed that it worked, I went ahead and created a new droplet based on the one click deploy.

I then went through all of the setup again, just to get it out of the way.
The only thing I really need from this new droplet is for all the system services to be set up and linked up.
For my use case I'd be replacing all the "important" folders in the new droplet with symlinks anyway, so it doesn't even need to be fully configured.

Sadly, when I did this I realized I created the volume and new droplet on different regions.
So instead I decided to use rsync to clone the data between the VMs.
First I set up a duplicate volume on my new VM, then I create an SSH key on it and added it to the authorized_keys on the old VM.

Then I ran:

```
rsync -a root@oldvm:/mnt/mastodon_data/** /mnt/mastodon_data/
```

With this in place I could now set up the new symlinks.

```
ln -s /mnt/mastodon_data/var/lib/redis/ /var/lib/redis
ln -s /mnt/mastodon_data/var/lib/postgresql/ /var/lib/postgresql
```

One thing I found was that since I had initially set up Mastodon, the default image had upgraded to Postgress 15 whereas my old instance was using Postgres 10.

In order to work around it, I tried renaming the `10` folder to `15`

```
mv /mnt/mastodon_data/var/lib/postgresql/10 /mnt/mastodon_data/var/lib/postgresql/15
```

Doing this didn't work however so I had to do a regular dump of the database.

I followed [this guide](https://www.netguru.com/blog/how-to-dump-and-restore-postgresql-database) for creating a dump.

Once I re-enabled the old postgres DB, I use `su - postgres` to log into the DB user, and ran a dump:

```
pg_dump mastodon_production > /mnt/mastodon_data/var/lib/postgresql/dump.sql
```

I then use `rsync` to load it into the same location on the new machine.

Then used `su - postgres` on the new machine to log into _its_ postgres instance.
Before loading the dump I needed to drop all the existing data.
I followed [this stackoverflow comment](https://stackoverflow.com/a/13823560) and ran the followign commands to clear all the data and start from fresh:

(first I launched `psql` to get an SQL shell)

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Once I had this I exited the shell and imported the dump.

```
psql mastodon_production < dump.sql
```

With this in place my databases were restored and it came time to link the mastodon source into the home directory.

```
ln -s /mnt/mastodon_data/live /home/mastodon/live
```

After getting that done I had to wrestle with a mismatch between the ruby and node versions installed by default and what I had on my old VM.

I floundered around for a few hours on this tryint go get node ugpraded, then I spend some more hours trying to get bundle install working.

In the end I decided to go to bed and try again the next day.

---

In the morning I noticed that `bundle install` was timing out due to some dependencies using the `git://` protocol for submodules which is insecure and I think is getting dropped by Github now.

To fix this I decided to upgrade mastodon to 3.5.

First I checked out the latest [stable 3.5](https://github.com/mastodon/mastodon/releases/tag/v3.5.2) version.
Then I ran through it's migration docs.
Luckily I just needed to change the ruby version to the one specified in their configs using `rbenv install`.

From there I ran the pre-deployment migration:

```
SKIP_POST_DEPLOYMENT_MIGRATIONS=true RAILS_ENV=production bundle exec rails db:migrate
```

Then I ran the asset precompile:

```
RAILS_ENV=production bundle exec rails assets:precompile
```

Then I started up all my systemd service for mastodon-web, mastodon-sidequik (sp?) and mastodon-streaming.

Afterwards I ran the migration:

```
RAILS_ENV=production bundle exec rails db:migrate
```

Once the migration ran, my mastodon instance was back, but now I had the bulk of my data on an external volume that I can scale up more cheaply, and can keep my lower end VM for running the data. (with a now mostly empty SSD).

## Lessons learned:

- Dependencies are hell
- Symlinks are pretty easy
- Always use the `-p` flag when copying data to retain permissions
- When dependencies are causing trouble, sometimes upgrading helps
- Sleep is good for you
