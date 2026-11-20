"""Produce the three optional regional map textures (offline; requires Pillow)."""
import argparse
import json
from pathlib import Path

from PIL import Image

scripts = Path(__file__).resolve().parent
output = scripts.parent / "src/assets/journey"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("source", type=Path, help="NASA Blue Marble world.topo.200407.3x5400x2700.jpg")
args = parser.parse_args()

with Image.open(args.source) as world:
    if world.size != (5400, 2700):
        parser.error("Expected the 5400 × 2700 equirectangular July mosaic.")
    # Integer-degree edges coincide with pixel edges at 15 source pixels/degree.
    for region, (west, south, east, north) in json.loads((scripts / "terrain-extents.json").read_text()).items():
        left, top = (west + 180) * 15, (90 - north) * 15
        width, height = (east - west) * 15, (north - south) * 15
        left %= world.width  # The Alaska inset spans the antimeridian.
        first_width = min(width, world.width - left)
        tile = Image.new("RGB", (width, height))
        tile.paste(world.crop((left, top, left + first_width, top + height)))
        if first_width < width:
            tile.paste(world.crop((0, top, width - first_width, top + height)), (first_width, 0))
        if region == "alaska":
            tile.thumbnail((480, 240), Image.Resampling.LANCZOS)
        tile.save(output / f"terrain-{region}.webp", quality=80, method=6)
