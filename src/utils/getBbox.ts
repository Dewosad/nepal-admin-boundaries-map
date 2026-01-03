export function getBbox(geoJson: GeoJSON.FeatureCollection): [number, number, number, number] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const scan = (coords: any) => {
    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      if (Array.isArray(c[0])) {          // nested (MultiPolygon etc.)
        scan(c);
      } else {                            // simple [lon, lat]
        const [lon, lat] = c;
        minX = Math.min(minX, lon);
        minY = Math.min(minY, lat);
        maxX = Math.max(maxX, lon);
        maxY = Math.max(maxY, lat);
      }
    }
  };

  geoJson.features.forEach(f => scan(f.geometry.coordinates));
  return [minX, minY, maxX, maxY];
}