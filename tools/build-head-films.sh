#!/bin/sh
# Builds the films behind the inner page heads (components/inner/parts.jsx, lib/site.js filmOf), one
# per product line and section, made like the hero film (tools/build-hero-video.sh): blurred, slightly
# desaturated and darkened once, here, at 960x540 and 25 fps, in AV1 and H.264, with the first frame
# as the still (shown until the film plays, and instead of it with reduced motion or Save-Data).
#
# Free Pexels clips (Pexels licence: commercial use allowed, no credit required; credited in NOTES.md):
#   head-pq          pexels.com/video/30295544  worker at the electrical panels of a plant
#   head-hvac        pexels.com/video/9339477   cooling tower fans and steam, from above
#   head-automation  pexels.com/video/38779095  control room with a video wall
#   head-ev          pexels.com/video/9790000   charging plug in an electric car
#   head-solutions   pexels.com/video/9874596   glass office tower at dusk
#   head-services    pexels.com/video/3466611   measuring on an electronics bench
#   head-sectors     pexels.com/video/35972202  Dubai skyline at dusk
#
# Two kinds of loop, so none of them jumps:
#   fade  a still camera: the end crossfades into the start (as the hero film)
#   swing a moving camera (or a slow pan added here): the clip plays forward, then backward
#
# Writes public/assets/video/<stem>-960x540.{av1,h264}.mp4 and public/assets/img/<stem>-960.{webp,avif}.
# Needs ffmpeg with libx264 and libsvtav1 (FFMPEG=/path/to/ffmpeg to pick one), and python3 + Pillow.
set -e
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
mkdir -p tools/.cache public/assets/video public/assets/img
TMP="$(mktemp -d)"
GRADE="eq=saturation=0.8:brightness=-0.03:contrast=0.95"
BLUR="scale=960:540:flags=lanczos,gblur=sigma=3,$GRADE"

# encode <stem> <filter graph ending in [v]> <AV1 crf>: busy pictures (fans, video walls) take a higher
# crf to stay near 200 KB; under the page head's scrim the difference doesn't show. H.264 follows it.
encode() {
  out="public/assets/video/$1"
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -filter_complex "$2;[v]format=yuv420p10le[o]" -map "[o]" -an \
    -c:v libsvtav1 -preset 4 -crf "$3" -svtav1-params tune=0 -movflags +faststart "$out-960x540.av1.mp4"
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -filter_complex "$2;[v]format=yuv420p[o]" -map "[o]" -an \
    -c:v libx264 -preset veryslow -crf $(($3 - 13)) -profile:v high -x264-params aq-mode=3 -movflags +faststart "$out-960x540.h264.mp4"
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -filter_complex "$2" -map "[v]" -frames:v 1 "$TMP/$1.png"
}

# source <pexels id> <file name on videos.pexels.com>
source_clip() {
  SRC="tools/.cache/pexels-video-$1-1920.mp4"
  [ -s "$SRC" ] || curl -sfL -A "Mozilla/5.0" -o "$SRC" "https://videos.pexels.com/video-files/$1/$2.mp4"
}

# fade <stem> <start s> <length s> <crf>: plays <length> seconds from <start>, then crossfades (1.48 s) into
# the 1.52 s just before them, which lead back into the start: frame for frame as the hero film
fade() {
  s=$(python3 -c "print(round($2 * 25))"); n=$(python3 -c "print(round($3 * 25))")
  a0=$((s + 38)); a1=$((a0 + n)); off=$(python3 -c "print(($n - 37) / 25)")
  encode "$1" "[0:v]fps=25,split=2[a0][b0];[a0]trim=start_frame=$a0:end_frame=$a1,setpts=PTS-STARTPTS[a];[b0]trim=start_frame=$s:end_frame=$a0,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=1.48:offset=$off,$BLUR[v]" "$4"
}

# swing <stem> <start s> <length s> <pan> <crf>: plays forward, then backward. pan: 0 for the clip as it is,
# or a fraction of the frame to pan across while it plays forward (a slow pan for a still shot)
swing() {
  n=$(python3 -c "print(round($3 * 25))")
  if [ "$4" = "0" ]; then pan=""; else pan="crop=w=iw*(1-$4):h=ih*(1-$4):x=(iw-ow)*t/$3:y=(ih-oh)/2,"; fi
  encode "$1" "[0:v]trim=start=$2:duration=$3,setpts=PTS-STARTPTS,fps=25,${pan}$BLUR,split=2[f][r0];[r0]reverse,trim=start_frame=1:end_frame=$((n - 1)),setpts=PTS-STARTPTS[r];[f][r]concat=n=2:v=1[v]" "$5"
}

# ONLY=<stem> builds just that film
build() { [ -z "$ONLY" ] || [ "$ONLY" = "$1" ]; }
build head-pq && { source_clip 30295544 12987963_1920_1080_30fps; swing head-pq 2 8 0.14 44; }
build head-hvac && { source_clip 9339477 9339477-hd_1920_1080_24fps; fade head-hvac 20 11 49; }
build head-automation && { source_clip 38779095 16477662_1920_1080_25fps; swing head-automation 0.4 9.4 0 47; }
build head-ev && { source_clip 9790000 9790000-hd_1920_1080_30fps; swing head-ev 1 8 0.16 44; }
build head-solutions && { source_clip 9874596 9874596-hd_1920_1080_30fps; swing head-solutions 1 10 0 47; }
build head-services && { source_clip 3466611 3466611-hd_1920_1080_30fps; fade head-services 4 13 44; }
build head-sectors && { source_clip 35972202 15252518_1920_1080_50fps; swing head-sectors 0.5 10 0 44; }

python3 - "$TMP" <<'EOF'
import sys, glob, os
from PIL import Image
for png in glob.glob(f"{sys.argv[1]}/*.png"):
    stem = os.path.basename(png)[:-4]
    im = Image.open(png).convert("RGB")
    base = f"public/assets/img/{stem}-960"
    im.save(base + ".webp", "WEBP", quality=72, method=6)
    im.save(base + ".avif", "AVIF", quality=60, speed=4)
EOF
rm -rf "$TMP"
ls -l public/assets/video/head-*
