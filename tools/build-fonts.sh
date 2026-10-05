#!/bin/sh
# Rebuilds public/assets/fonts from the full OFL fonts on GitHub (google/fonts).
# Keeps only the axes and characters the site uses: about 94 KB instead of 208 KB,
# and it includes ≤ ≥ → ₂, which Google's "latin" subset leaves out.
# Needs fonttools + brotli:  python3 -m venv .venv && .venv/bin/pip install fonttools brotli
set -e
cd "$(dirname "$0")/.."
BIN="${FONTTOOLS_BIN:-.venv/bin}"
TMP="$(mktemp -d)"
curl -sL -o "$TMP/Archivo.ttf" "https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf"
curl -sL -o "$TMP/SourceSerif4.ttf" "https://github.com/google/fonts/raw/main/ofl/sourceserif4/SourceSerif4%5Bopsz,wght%5D.ttf"
curl -sL -o "$TMP/SourceSerif4-Italic.ttf" "https://github.com/google/fonts/raw/main/ofl/sourceserif4/SourceSerif4-Italic%5Bopsz,wght%5D.ttf"
UNI="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,U+2044,U+20AC,U+2122,U+2192,U+2212,U+2264-2265,U+2082,U+00B3,U+00D7,U+00B7,U+00B0"
FEAT="kern,liga,calt,ccmp,locl,mark,mkmk,tnum,lnum,pnum,case"
"$BIN/fonttools" varLib.instancer "$TMP/Archivo.ttf" wght=400:700 wdth=100:125 -o "$TMP/a.ttf" -q
"$BIN/pyftsubset" "$TMP/a.ttf" --unicodes="$UNI" --layout-features="$FEAT" --flavor=woff2 --output-file=public/assets/fonts/archivo-var.woff2
"$BIN/fonttools" varLib.instancer "$TMP/SourceSerif4.ttf" wght=400 opsz=12:32 -o "$TMP/s.ttf" -q
"$BIN/pyftsubset" "$TMP/s.ttf" --unicodes="$UNI" --layout-features="$FEAT" --flavor=woff2 --output-file=public/assets/fonts/source-serif-4-var.woff2
# italic: only for the last word of display headings, so one weight and the display optical sizes
"$BIN/fonttools" varLib.instancer "$TMP/SourceSerif4-Italic.ttf" wght=480 opsz=24:60 -o "$TMP/si.ttf" -q
"$BIN/pyftsubset" "$TMP/si.ttf" --unicodes="$UNI" --layout-features="$FEAT" --flavor=woff2 --output-file=public/assets/fonts/source-serif-4-italic-var.woff2
rm -rf "$TMP"
ls -l public/assets/fonts/*.woff2
