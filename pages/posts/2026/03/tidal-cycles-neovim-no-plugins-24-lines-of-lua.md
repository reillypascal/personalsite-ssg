---
title: "Tidal Cycles/Neovim: No Plugins, 24 Lines of Lua"
description:
fedi_url:
og_image:
og_image_width:
og_image_height:
og_image_alt:
date: 2026-03-04T18:54:29-0500
tags:
  - haskell
  - neovim
  - post
  - programming
  - tidal-cycles
post_series:
draft: true
---

<!-- <link rel="stylesheet" type="text/css" href="/styles/notes-photos.css"> -->

<link rel="stylesheet" type="text/css" href="/styles/code/prism-perf-custom.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

## The Neovim Configuration

First, we want Neovim to recognize .tidal as a file type. We can add a `tidal.lua` file in the `ftdetect/` folder with the following code:

ftdetect/tidal.lua

```lua
vim.filetype.add({
	extension = {
		tidal = "tidal",
	},
})
```

Next, Tidal Cycles just uses Haskell's [GHCi](https://wiki.haskell.org/GHC/GHCi) environment started with a custom file titled `BootTidal.hs`. GHCi is the interactive version of the Glasgow Haskell Compiler (GHC). You can enter Haskell expressions at the prompt, and they will be evaluated on the fly. All we need to do is start GHCi in a Neovim terminal window using the correct boot file, and then enter the code at the prompt, followed by a `<CR>` character (the “Enter”/“Return” key). We can add keymaps that only apply to a buffer with a .tidal file by putting them in `ftplugin/tidal.lua` and adding the `buffer = true` option as shown below.

ftplugin/tidal.lua

```lua
-- open GHCi REPL in term split using Tidal boot file
vim.keymap.set(
	"n",
	"<localleader>b",
	"<cmd>10 split term://ghci -ghci-script=$TIDAL_BOOT_PATH/BootTidal.hs %<cr>:startinsert<cr>",
	{ desc = "[B]oot Tidal server and open in terminal split", noremap = true, buffer = true }
)
```

Since this keymap is local to the buffer, we use the `<localleader>` key, which I have mapped to “,“. The command that this keymap runs enters command mode (`:`); creates a terminal split that's 10 characters high; runs GHCi with the Tidal boot file; and then switches to insert mode (Neovim's terminal defaults to normal mode).

`$TIDAL_BOOT_PATH` here could be replaced with a hardcoded path to the Tidal boot file, but using an environment variable like this lets me use my configuration on multiple computers/OSes. You can set this variable with the following line in your .bashrc or .zshrc file. Note that this is under `~/.cabal/share/` (at least on my setup), but contains install-specific details, so you will need to locate the `BootTidal.hs` file for your installation.

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

ftplugin/tidal.lua

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

Finally, I add the following line to associate .tidal files with Haskell syntax. This works well, but note that the Haskell Language Server (HLS) may throw a fit on Tidal files. HLS is not needed for Tidal Cycles itself, but if you also want to write vanilla Haskell, be aware of this. I ended up using [this function](https://github.com/reillypascal/nvim/blob/d84f72ada230811b0879cba3e2e92b4e8c5f4ca4/lua/config/lsp.lua#L12-L16) and [this line](https://github.com/reillypascal/nvim/blob/d84f72ada230811b0879cba3e2e92b4e8c5f4ca4/lua/config/lsp.lua#L29) in my LSP configuration to prevent HLS from loading unless there is at least one Haskell project root marker in the folder. A bit of a hack, but it works for now.

ftplugin/tidal.lua

```lua
-- enables highlighting
vim.cmd("set ft=haskell")
```
