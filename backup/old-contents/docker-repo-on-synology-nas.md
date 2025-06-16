---
title: Host Docker Registry on a Synology NAS
author: Brendon Otto
datetime: 2022-03-06T06:03:34Z
slug: docker-repo-on-synology-nas
featured: true
draft: false
tags:
  - Docker
  - NAS
description: "I've been working on a project off and on that I wanted to host and run on my Synology NAS (I have a DS920+). The best way to host custom software on it is to run Docker images but I didn't want to push this to a public repo, I have a local server after all 😁."
---

I've been working on a project off and on that I wanted to host and run on my Synology NAS (I have a DS920+). The best way to host custom software on it is to run Docker images but I didn't want to push this to a public repo, I have a local server after all 😁.

### Get Docker Repo image

This step is pretty simple, run the Docker Repository image on your NAS. It can be found searching the registry:

![Synology Docker Registry search](/assets/images/docker-repo-synology-ui.jpg)

Once the registry container is started we need to do two things, one on your machine creating your Docker images and one on the server (or NAS in my case)

### Local changes

Open up your Docker Desktop client and navigate to Settings -> Docker Engine. On this screen we'll add a property to the JSON object for `insecure-registries`. It's an array of strings, below is an example:

```json
"insecure-registries": [
    "192.168.1.123:9500"
]
```

I'm running my registry on port 9500 so I'll need to specify it in the URL. Use the port you mapped when starting the container. Now that's done you should be able to push to that registry with:

```bash
docker image push 192.168.1.123:9500/{imageName}:{version}
```

At this point you should have a running registry with an image in it!

### Server / NAS Changes

This part gets a bit inception-y. We have to tell the NAS that there's an insecure registry we'd like to use to retrieve images from that it's hosting itself. This means SSH'ing into the Synology and updating a configuration file. Once SSH'd in we'll need to update `/var/packages/Docker/etc/dockerd.json` as sudo so that we can write the changes back to the file system. Once in this file is open (I use vi for quick changes like this) we can add an entry for the same property that we added client side: `insecure-registries` with the same array parameter with one value. What I found weird and is most likely a fluke is that I had to add the new entry into the correct alphabetically ordered location in the JSON object. It **shouldn't** matter but it did 🤷‍♂️.

Once the update is done to the file, save and close it. We'll need to restart the Docker service in order for it to recognize the change in configuration. You can do this two ways:

```bash
sudo systemctl restart pkgctl-Docker
```

or

```bash
synopkgctl restart pkgctl-Docker
```

The first one is standard systemd on Linux, the second one being Synology's command line tool for managing their packages.

Once this is done use a tool like Portainer or open the settings for the Docker view in your Synology dashboard and add your new repo!

![Synology use local Docker Registry](/assets/images/use-local-docker-registry.jpg)

Thanks for reading!
