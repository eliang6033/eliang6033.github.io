# Earth surface

`earth-day.webp` is a locally compressed, slightly desaturated derivative of
NASA's [Blue Marble land, shallow water and shaded topography mosaic](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg).

Credit: Reto Stöckli, NASA Goddard Space Flight Center (land surface and shallow
water); USGS EROS Data Center (topography). See the
[Blue Marble project](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/)
and [NASA's imagery guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).

## China and United States regional maps

The three `terrain-*.webp` crops use the July 2004 composite from NASA Earth
Observatory's [Blue Marble: Next Generation, with shaded topography](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/).
They are historical land imagery, not a live map. Only the requested regional
view loads its crop(s); the website does not contact a map service.

To reproduce, download the [July 5400 × 2700 JPEG](https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x5400x2700.jpg)
and run `python3 scripts/generate-regional-terrain.py /path/to/world.topo.200407.3x5400x2700.jpg`
with Pillow installed. The cropper and both boundary generators share the geographic
extents in `scripts/terrain-extents.json`; the Alaska inset wraps across 180°.
