#!/usr/bin/env python3

import json
import os
import urllib.request  # , subprocess
from dotenv import load_dotenv
from subprocess import run
from typing import Any, Dict

load_dotenv()

wm_token = os.getenv("WEBMENTION_IO_TOKEN")

with urllib.request.urlopen(
    f"https://webmention.io/api/mentions.jf2?token={wm_token}&per-page=1000"
) as response:
    res = response.read()

json_dict = json.loads(res.decode("utf-8"))

webmentions: Dict[str, Any] = {"mentions": []}
for entry in json_dict.get("children"):
    if ("https://brid.gy/" not in entry.get("wm-source")) and (
        "https://bsky.brid.gy/" not in entry.get("wm-source")
    ):
        webmentions["mentions"].append(entry)

output_filename = "webmentions.json"

with open(output_filename, "w", encoding="utf-8") as output_file:
    json.dump(webmentions, output_file, ensure_ascii=False, indent=4)

editor = os.getenv("EDITOR")
# subprocess.run() over subprocess.call() https://stackoverflow.com/a/51950538
if editor != None:
    run([editor, output_filename])
