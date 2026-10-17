#!/bin/sh
# Builds the hero's background video and its still frames from a free Pexels clip:
# "Industrial Factory Workers Operating Machinery" by Usman AbdulrasheedGambo
# (pexels.com/video/32243444, Pexels licence: commercial use allowed, no credit required).
#
# The clip is blurred, slightly desaturated and darkened here, once, so the browser doesn't have to
# blur every frame. A blurred picture has no fine detail left, so 960x540 at 25 fps looks the same as
# full HD and costs a fraction of the bytes. The end crossfades into the start, so the loop has no jump.
#
# Writes public/assets/video/hero-plant-room-{960x540,360x640}.{av1,h264}.mp4 (AV1 for current
# browsers, H.264 for the rest; 360x640 is a portrait crop for phones) and the still frames
# public/assets/img/hero-plant-room-{960,360}.{avif,webp} (shown before the video plays, and instead of
# it with reduced motion or Save-Data).
# Needs ffmpeg with libx264 and libsvtav1 (FFMPEG=/path/to/ffmpeg to pick one), and python3 + Pillow.
set -e
cd "$(dirname "$0")/.."
FF="${FFMPEG:-ffmpeg}"
SRC=tools/.cache/pexels-video-32243444-1920.mp4
mkdir -p tools/.cache public/assets/video
[ -s "$SRC" ] || curl -sfL -A "Mozilla/5.0" -o "$SRC" "https://videos.pexels.com/video-files/32243444/13751394_1920_1080_50fps.mp4"
TMP="$(mktemp -d)"
OUT=public/assets/video/hero-plant-room
# At 25 fps: frames 38-412 play, and over their last 1.48 s they fade into frames 0-37, so the
# 15 s loop ends on frame 37 and starts again on frame 38, with no jump.
LOOP="fps=25,split=2[a0][b0];[a0]trim=start_frame=38:end_frame=413,setpts=PTS-STARTPTS[a];[b0]trim=end_frame=38,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=1.48:offset=13.52"
GRADE="eq=saturation=0.8:brightness=-0.03:contrast=0.95"
# landscape: the whole frame. portrait: a 9:16 crop around the two workers in the middle
LAND="scale=960:540:flags=lanczos,gblur=sigma=3,$GRADE"
PORT="crop=608:1080:766:0,scale=360:640:flags=lanczos,gblur=sigma=3.5,$GRADE"

for v in "960x540:$LAND" "360x640:$PORT"; do
  size="${v%%:*}"; chain="${v#*:}"
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -filter_complex "[0:v]$LOOP,$chain,format=yuv420p10le[v]" -map "[v]" -an \
    -c:v libsvtav1 -preset 4 -crf 42 -svtav1-params tune=0 -movflags +faststart "$OUT-$size.av1.mp4"
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -filter_complex "[0:v]$LOOP,$chain,format=yuv420p[v]" -map "[v]" -an \
    -c:v libx264 -preset veryslow -crf 29 -profile:v high -x264-params aq-mode=3 -movflags +faststart "$OUT-$size.h264.mp4"
  # the loop's first frame, as the still
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -filter_complex "[0:v]$LOOP,$chain[v]" -map "[v]" -frames:v 1 "$TMP/$size.png"
done

python3 - "$TMP" <<'EOF'
import sys
from PIL import Image
tmp = sys.argv[1]
for size, w in (("960x540", 960), ("360x640", 360)):
    im = Image.open(f"{tmp}/{size}.png").convert("RGB")
    base = f"public/assets/img/hero-plant-room-{w}"
    im.save(base + ".webp", "WEBP", quality=72, method=6)
    im.save(base + ".avif", "AVIF", quality=60, speed=4)
EOF
rm -rf "$TMP"
ls -l public/assets/video/hero-plant-room-* public/assets/img/hero-plant-room-*
