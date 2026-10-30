#!/usr/bin/env bash
# Builds dist/mikebrawl-itch.zip (upload to itch.io as an HTML game) and dist/site/ (what GitHub Pages serves).
set -euo pipefail
cd "$(dirname "$0")/.."

FILES=(index.html manifest.json sw.js icon.svg src data)
[ -d assets ] && FILES+=(assets)

rm -rf dist
mkdir -p dist/site
cp -R "${FILES[@]}" dist/site/
(cd dist/site && zip -qr ../mikebrawl-itch.zip .)
echo "Built dist/mikebrawl-itch.zip ($(du -h dist/mikebrawl-itch.zip | cut -f1)) and dist/site/"
