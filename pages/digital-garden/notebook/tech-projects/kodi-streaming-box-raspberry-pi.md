---
title: Kodi Streaming Box on a Raspberry Pi
description: Setting up a Raspberry Pi as a streaming box for Hulu, Netflix, etc., as well as viewing shows from my Jellyfin server
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-05-14T22:56:00-0400
octothorpes: 
tags:
  - digital-garden
  - notebook
  - tech-projects
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

### Guide (Some Natalie's Blog)
- [Kodi setup on a Raspberry Pi 4](https://some-natalie.dev/blog/kodi-setup/)
	- Includes how to start Kodi on startup

### Setting up Pi
- Install OS; use `sudo raspi-config` to do the following:
  - Username and password
  - Localization settings
  - Console auto-login (what you want in order to automagically start Kodi on boot)
  - Network setup, if needed
  - Enable SSH (optional)
- Update everything:
```sh
sudo apt update
sudo apt dist-upgrade
sudo reboot
```

### Install Kodi
- Install Kodi and desktop manager
```sh
sudo apt install kodi lightdm
```
- "Now have it automatically launch at boot using systemd. Use `sudo` to create a file at `/lib/systemd/system/kodi.service` with the following contents:

```sh
[Unit]
Description = Kodi Media Center
After = remote-fs.target network-online.target
Wants = network-online.target

[Service]
User = pi
Group = pi
Type = simple
ExecStart = /usr/bin/kodi-standalone
Restart = on-abort
RestartSec = 5

[Install]
WantedBy = multi-user.target
```
- "Note you will need to edit the `user` and `group` to match the username you created. Enable the service to start Kodi automatically at boot:"
```sh
sudo systemctl enable kodi.service
```
- "Then reboot and configure Kodi as you’d like. Here’s the official [quick start guide](https://kodi.wiki/view/Quick_start_guide) to get going."

---

### Adding Streaming Extensions to Kodi

#### [Hulu](https://www.ivacy.com/blog/how-to-install-hulu-on-kodi/) in Kodi
- Enable unknown sources
	- Settings > System > Add-ons, turn on Unknown Sources option
- Add source
	- Settings > File Manager
	- Click on Add Source > Click on **None**
	- Type “[http://k.slyguy.xyz/](http://k.slyguy.xyz/)“
	- Hit **Done**
- Hulu addon
	- Go to the main menu and select “Addons.”
	- Click on the “Package Installer” icon (usually looks like an open box) at the top left corner.
	- Choose “Install from zip file.”
	- Select **Sly Guy.**
	- Now click on **slyguy.zip**
	- Wait for the notification stating, “**Sly Guy Repo has been installed.**“
	- Head back to the home screen and go to
	- Now click on **Install from Repository** > **SlyGuy Repository (slyguy.uk)** > **Video Addons**
	- Choose **Hulu** > **Install** > OK
	- Now, click on **Hulu** > **Login** 

---

### [Netflix](https://www.vpnmentor.com/blog/ultimate-guide-install-netflix-kodi/) on Kodi
- Install [CastagnaIT](https://github.com/CastagnaIT/plugin.video.netflix) repo, Netflix plugin
- Create an [authentication key](https://github.com/CastagnaIT/plugin.video.netflix/wiki/Login-with-Authentication-key) to log in
- Python [virtual environment](https://stackoverflow.com/questions/75608323/how-do-i-solve-error-externally-managed-environment-every-time-i-use-pip-3)

---
### [Subtitles](https://www.comparitech.com/kodi/kodi-subtitles/) in Kodi
- **N.B., I don't have this set up yet — just notes for my records**
- First, visit Opensubtitles.org and create an account.
- On Kodi’s main menu, click **Add-ons**, then **Download**, then **Subtitles**
- Install OpenSubtitles.org, then click it again and hit **Configure**
- Enter your Opensubtitles login details, then click **OK**
- Return to Kodi’s main menu and click the gear icon
- Select **Player.** On the left side of the screen, move your cursor over **Language**, then move over to the right, scroll down, and select **Default TV show service**
- By default, there are no subtitle addons listed. Click **Get more…** to see more options
- Select the subtitle addon you want to install. OpenSubtitles.org is the one we recommend for most people, but you should try out multiple addons until you find the one that is best for you. Whichever one you choose will now be set to search for subtitles anytime you are watching a TV show
- Scroll down the **Language** submenu again and select **Default movie service**
- Select the same subtitle addon for movies or click **Get more…** to choose a different one
- Start playing your movie or TV show and click the subtitles icon in the lower-right corner
- Select **Download subtitle…** (if the **Enable** subtitle button can be checked, it means that this particular film already has subtitles available. However, it’s still a good idea to install a subtitle addon because this won’t always be the case)
- After searching for a few seconds, you’ll see a list of subtitle sets. Sets with five stars are the most highly rated. Select the subtitle set you want to use

---
### YouTube
- Not yet working!
- Best information seems to be here: <https://github.com/anxdpanic/plugin.video.youtube/wiki/Personal-API-Keys>

---