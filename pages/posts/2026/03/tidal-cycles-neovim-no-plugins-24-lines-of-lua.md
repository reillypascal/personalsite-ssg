---
title: "Tidal Cycles/Neovim: No Plugins, 24 Lines of Lua"
description: I made a simple, easy-to-maintain way to do “algorave” musical live-coding from Neovim, without needing to depend on other people's plugins staying updated.
fedi_url:
  - https://hachyderm.io/@reillypascal/116183454269059518
  - https://bsky.app/profile/reillypascal.bsky.social/post/3mgfubx5gdc2h
og_image: /media/blog/2026/03/tidal-ftplugin-hero.jpg
og_image_width: 1200
og_image_height: 630
og_image_alt: Lua code in Neovim, showing Neovim keybindings for running Tidal Cycles code
date: 2026-03-06T12:30:00-0500
tags:
  - haskell
  - neovim
  - post
  - programming
  - tidal-cycles
post_series:
---

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I've been enjoying writing music using code in Neovim — I [recently talked about using Lilypond to write sheet music this way, for example](/posts/2026/02/friendly-lilypond-with-neovim-audacity/). Another way of writing music with code is [Tidal Cycles](https://tidalcycles.org/). This is a set of pattern-sequencing tools that talk to the [SuperCollider](https://supercollider.github.io/) synthesizer. Tidal Cycles allows a highly compact way of notating musical patterns, and one aimed at [live-coding](https://www.youtube.com/watch?v=Db0QJo1eaoI) or “algorave” events, where performers' screens are projected, showing code being typed in real time.

Today, let's look at how I bypassed the need for plugins when writing Tidal Cycles code, and created something simple and self-sufficient that also gave me more understanding of my tools!

## Existing Tidal Cycles Tools

The officially-recommended plugin [vim-tidal](https://github.com/tidalcycles/vim-tidal) hasn't been updated since 2020, and whenever I quit the Tidal interpreter in this plugin, I wasn't able to start it again without quitting and re-opening my terminal. [tidal.nvim](https://github.com/grddavies/tidal.nvim) was pretty nice and somewhat newer, but development doesn't seem to be particularly active, and my next experience made me question if I even needed that.

I was playing with the [conjure](https://github.com/Olical/conjure) plugin, [^1] which provides interactive [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) support for many languages, including Scheme, which I've been using with Lilypond. I saw that it was pretty easy to set this up with the [`lilypond scheme-sandbox`](https://lilypond.org/doc/v2.24/Documentation/extending/scheme-sandbox) command, instead of the suggested MIT Scheme or GNU Guile REPLs — you can [see my Neovim configuration for this here](https://github.com/reillypascal/nvim/blob/d84f72ada230811b0879cba3e2e92b4e8c5f4ca4/lua/plugins/conjure.lua#L14-L15).

This got me thinking: how hard could it be to set something like this up myself for Tidal Cycles? It turned out that I only needed a little bit of Lua! I always prefer small, simple scripts that I wrote and understand, since I know I can keep these maintained without relying on someone else to write a plugin (or having to dig through a plugin's worth of code myself in order to fork/maintain it).

Additionally, it's extremely easy to stop/start the Tidal interpreter with this configuration, and even more so than in the more recent tidal.nvim plugin. Tidal Cycles just uses Haskell's [GHCi](https://wiki.haskell.org/GHC/GHCi) environment started with a custom file titled `BootTidal.hs`. GHCi is the interactive version of the Glasgow Haskell Compiler (GHC). You can enter Haskell expressions at the prompt, and they will be evaluated on the fly. The standard way to quit GHCi is ctrl + D, and since we will just be running GHCi in a Neovim terminal pane, this works great here.

## My Neovim Configuration

First, we want Neovim to recognize “.tidal” as a file type. We can add a `tidal.lua` file in the `ftdetect/` folder with the following code, which lets Neovim know about that file type.

<span class="code-file">

[ftdetect/tidal.lua](https://github.com/reillypascal/nvim/blob/main/ftdetect/tidal.lua)

</span>

```lua
vim.filetype.add({
	extension = {
		tidal = "tidal",
	},
})
```

Next, as mentioned previously, Tidal Cycles uses Haskell's GHCi. All we need to do is start GHCi in a Neovim terminal window using the correct boot file, and then enter the code at the prompt, followed by a `<CR>` character (the “Enter”/“Return” key). We can add keymaps that only apply to a buffer with a .tidal file by putting them in `ftplugin/tidal.lua` and adding the `buffer = true` option as shown below.

<span class="code-file">

[ftplugin/tidal.lua](https://github.com/reillypascal/nvim/blob/main/ftplugin/tidal.lua)

</span>

```lua
-- open GHCi REPL in term split using Tidal boot file
vim.keymap.set(
	"n",
	"<localleader>b",
	"<cmd>10 split term://ghci -ghci-script=$TIDAL_BOOT_PATH/BootTidal.hs %<cr>:startinsert<cr>",
	{ desc = "Boot Tidal interpreter and open in terminal split", noremap = true, buffer = true }
)
```

Since this keymap is local to the buffer, we use the `<localleader>` key, which I have mapped to “,“. The command that this keymap runs enters command mode (`:`); creates a terminal split that's 10 characters high; runs GHCi with the Tidal boot file; and then switches to insert mode (Neovim's terminal defaults to normal mode).

`$TIDAL_BOOT_PATH` here could be replaced with a hardcoded path to the Tidal boot file, but using an environment variable like this lets me use my configuration on multiple computers/OSes. You can set this variable with the following line in your .bashrc or .zshrc file. Note that this is under `~/.cabal/share/` (at least on my setup), but contains install-specific details, so you will need to locate the `BootTidal.hs` file for your installation. If you want or need, you can manually copy [the code for `BootTidal.hs`](https://tidalcycles.org/docs/configuration/boot-tidal/) into a file and use the directory where you store that file.

```sh
export TIDAL_BOOT_PATH="$HOME/.cabal/share/aarch64-osx-ghc-9.12.2-ea3d/tidal-1.10.1"
```

Next, I added two keymaps to let me run the current line and the current block. For the first one:

- `yy` “yanks” the current line.
- `Control-w` accesses window-related commands, and from here, `j` will go down a window.
- `p` pastes the yanked line, `a` enters insert mode _after_ the line (“append”), and `<CR>` sends the line to GHCi.
- `Control-\` and `Control-n` are needed together to exit insert mode in the terminal.
- `Control-w p` goes to the previous window location.

Running all this from one keymap smoothly takes the current line and runs it in the terminal split.

Next, we want to do a similar thing for a block of text, potentially including line breaks. (Neo)vim has the concept of [text objects](https://martinlwx.github.io/en/learn-to-use-text-objects-in-vim/), and a block of text with blank lines before and after is a “paragraph” object. `yip` (“yank inner paragraph“) will copy the required type of text block. I precede it with `"*` to copy to the system clipboard instead of the unnamed [register](https://www.brianstorti.com/vim-registers/) used by default. This makes it easier for me to edit the contents of the register before pasting them.

In order for GCHi/Tidal to accept a block with line breaks, the block needs to be preceded by `:{` and followed by `:}`, both on separate lines from the block. We can assign things to a register with e.g., `:let @* =`, and I chain the required strings together with the existing contents of the register (represented with `@*`). Vimscript uses the dot (`.`) to chain text together. All told, here are the differences:

- We use `yip` instead of `yy` to yank the paragraph.
- We yank it to/paste it from the `"*` register, rather than the default.
- We use `:let` to edit the contents of the register.

<span class="code-file">

[ftplugin/tidal.lua](https://github.com/reillypascal/nvim/blob/main/ftplugin/tidal.lua)

</span>

```lua
-- yank current line; move to term; paste, enter append mode, <CR>; back to normal mode; return to previous location
vim.keymap.set(
	"n",
	"<localleader>ee",
	[[ yy<C-w>jpa<CR><C-\><C-n><C-w>p ]],
	{ desc = "Evaluate current line", noremap = true, buffer = true }
)
-- yank current block to "*; wrap in :{/:}; move to term; paste from "*, enter append mode, <CR>; back to normal mode; return to previous location
vim.keymap.set(
	"n",
	"<localleader>er",
	[[ "*yip <cmd>let @* = "\:\{\n" . @* . "\:\}"<cr> <C-w>j"*pa<CR><C-\><C-n><C-w>p ]],
	{ desc = "Evaluate current block", noremap = true, buffer = true }
)
```

Finally, I add the following line to associate .tidal files with Haskell syntax. This works well, but note that the Haskell Language Server (HLS) may throw a fit on Tidal files — this has been an issue with some Vim/Neovim plugins, but weirdly not others. HLS is not needed for Tidal Cycles itself, but if you also want to write vanilla Haskell, be aware of this. I ended up using [this function](https://github.com/reillypascal/nvim/blob/d84f72ada230811b0879cba3e2e92b4e8c5f4ca4/lua/config/lsp.lua#L12-L16) and [this line](https://github.com/reillypascal/nvim/blob/d84f72ada230811b0879cba3e2e92b4e8c5f4ca4/lua/config/lsp.lua#L29) in my LSP configuration to prevent HLS from loading unless there is at least one Haskell project root marker in the folder. A bit of a hack, but it works for now.

<span class="code-file">

[ftplugin/tidal.lua](https://github.com/reillypascal/nvim/blob/main/ftplugin/tidal.lua)

</span>

```lua
-- enables highlighting
vim.cmd("set ft=haskell")
```

## Postscript

The tidal.nvim plugin is certainly still quite nice, and may be more your taste. The benefits I found from this project are 1\) more flexibility over the default terminal split size, 2\) direct access to the GHCi Tidal process in the resulting terminal, 3\) a better understanding of my tools in general, and 4\) the knowledge that all my setup depends on is the [base Tidal code](https://codeberg.org/uzu/tidal) staying maintained. In general, I find it fun and reassuring to make minimalist scripts to accomplish tasks, and this project was similarly satisfying.

I plan to keep tinkering and writing about Tidal Cycles/Neovim, as well as Lilypond (which I mentioned at the beginning). I hope to see you then — until next time!

[^1]: In addition to the Conjure plugin, [iron.nvim](https://github.com/Vigemus/iron.nvim) is another general-purpose REPL plugin you could try.
