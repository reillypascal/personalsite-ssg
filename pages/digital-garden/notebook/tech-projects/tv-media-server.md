---
title: TV & Media Server
description: Setting up a home server using an old laptop, and running Jellyfin on it
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-15T01:10:00-0400
octothorpes: 
tags:
  - digital-garden
  - notebook
  - tech-projects
  - media-center
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

Here are my notes on setting up an old laptop as a home server. This discussion pairs nicely with the Raspberry Pi/Kodi TV streaming box I discuss [[kodi-streaming-box-raspberry-pi|here]], and I also use this server to update my website with new webmentions as I discuss [[webmention-tutorial|here]].

## Guide (Ubuntu Server):
- [The Zero Dollar Home Server](https://chriskalos.notion.site/The-0-Home-Server-Written-Guide-5d5ff30f9bdd4dfbb9ce68f0d914f1f6)
  - Includes how to run with lid closed


## Jellyfin
### Kodi
- https://jellyfin.org/docs/general/clients/kodi/
### Media
- Guide [link](https://forum.jellyfin.org/t-from-disc-to-drive-a-beginner-s-guide-to-preparing-your-media-for-jellyfin)
  - Software:
    - [MakeMKV](https://www.makemkv.com/download/) for ripping
    - [MKVToolNix](https://mkvtoolnix.download/downloads.html) for transcoding


## Copying Files

```bash
# find disk:
sudo fdisk -l
# or 
df
# or find device path with either `lsblk` or `sudo blkid` and then mount:
udisksctl mount -b /dev/sdb

# mount:
sudo mount /dev/sdb1 /media/usb/

# copy files:
cp -v -r /media/usb/DVDs/Watchmen /media/myfiles/Shows

# copy contents of folder without copying folder
# https://unix.stackexchange.com/questions/180985/how-to-copy-files-from-the-folder-without-the-folder-itself
cp -r /home/username/A/. /usr/lib/B/
```

### Force-Unmount USB Drive
- “find every process that is accessing the /mnt/share mount point and kill it,” then run `umount` as usual
```bash
sudo fuser -km /media/usb
sudo umount /media/usb

# old notes - don't remember why
sudo fuser -km /mnt/share
sudo umount /mnt/share
```

## Finding DVDs
- [DVDCompare](https://www.dvdcompare.net/)


## YouTube
- http://191.168.1.66:50152/youtube/api
- https://github.com/anxdpanic/plugin.video.youtube/issues/1016


## Misc
- <https://turner.enemyterritory.org/shared/repo/user/carrvo/website/homeserver-bom-calculator.html>