---
title: macOS Terminal Commands
description: macOS terminal commands I find useful
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-14T02:48:00-0400
octothorpes:
  - 
tags:
  - digital-garden
  - notebook
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

## Gatekeeper
- [Remove Gatekeeper](https://www.igorski.nl/on-plugins-and-macos) from individual plugin
    - Security policy control: add rule
```sh
spctl --add <path>
```
- Globally disable Gatekeeper
```sh
sudo spctl --master-disable
sudo spctl --master-enable
```
- Remove Gatekeeper recursively on folder
    - Extended attributes: recursively clear all
```sh
xattr -rc <foldername>
```
- Command also useful on app, for error "\<program\> is damaged and can't be opened" (<https://www.betterbird.eu/downloads/index.php>), e.g., 
```sh
xattr -cr /Applications/Betterbird.app
```
- Remove Quarantine (run in folder) ([link](https://github.com/acids-ircam/nn_tilde#puredata))
```sh
xattr -r -d com.apple.quarantine .
```

## Get Rid of Update Notifications
- https://macperformanceguide.com/blog/2024/20240215_1700-macOSSonoma-blockForcedUpdates.html
	- Referenced: https://eclecticlight.co/2024/02/12/can-you-avoid-a-forced-upgrade-to-sonoma/
		- https://lapcatsoftware.com/articles/2024/2/2.html
- I also ended up setting `UserNotificationDate` to the same value — can read/confirm with `defaults read com.apple.SoftwareUpdate` 
```sh
defaults read com.apple.SoftwareUpdate MajorOSUserNotificationDate

defaults write com.apple.SoftwareUpdate MajorOSUserNotificationDate -date "2026-02-15 22:00:00 +0000"

defaults read com.apple.SoftwareUpdate
```

## iTerm2
- <https://iterm2.com/features.html>
- <https://iterm2.com/documentation.html>
- <https://iterm2.com/faq.html>