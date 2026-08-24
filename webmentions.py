#!/usr/bin/env python3

import json
import os
import urllib.request
from dotenv import load_dotenv
from subprocess import run
from typing import Any, Dict

# parse .env, load all as environment variables
load_dotenv()

# read token from general pool of env variables
wm_token = os.getenv("WEBMENTION_IO_TOKEN")

# get response from URL
with urllib.request.urlopen(
    f"https://webmention.io/api/mentions.jf2?token={wm_token}&per-page=1000"
) as response:
    res = response.read()

# decode response as utf-8 JSON
json_dict = json.loads(res.decode("utf-8"))

# push response JSON into webmentions Dict; specify type
webmentions: Dict[str, Any] = {"mentions": []}
for entry in json_dict.get("children"):
    if ("https://brid.gy/" not in entry.get("wm-source")) and (
        "https://bsky.brid.gy/" not in entry.get("wm-source")
    ):
        webmentions["mentions"].append(entry)

# use filename both for writing and loading in $EDITOR
output_filename = "webmentions.json"

# write webmentions dict into output file as JSON
with open(output_filename, "w", encoding="utf-8") as output_file:
    json.dump(webmentions, output_file, ensure_ascii=False, indent=4)

# open resulting file in $EDITOR
editor = os.getenv("EDITOR")
if editor != None:
    run([editor, output_filename])
