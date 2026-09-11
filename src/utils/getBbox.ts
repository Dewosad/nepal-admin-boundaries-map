type NestedCoordinates = GeoJSON.Position | NestedCoordinates[];

export function getBbox(geoJson: GeoJSON.FeatureCollection): [number, number, number, number] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const scanCoordinates = (coords: NestedCoordinates) => {
    if (typeof coords[0] === "number") {
      const [lon, lat] = coords as GeoJSON.Position;
      minX = Math.min(minX, lon);
      minY = Math.min(minY, lat);
      maxX = Math.max(maxX, lon);
      maxY = Math.max(maxY, lat);
      return;
    }

    for (let i = 0; i < coords.length; i++) {
      scanCoordinates(coords[i] as NestedCoordinates);
    }
  };

  const scanGeometry = (geometry: GeoJSON.Geometry | null) => {
    if (!geometry) return;

    if (geometry.type === "GeometryCollection") {
      geometry.geometries.forEach(scanGeometry);
      return;
    }

    scanCoordinates(geometry.coordinates);
  };

  geoJson.features.forEach(f => scanGeometry(f.geometry));
  return [minX, minY, maxX, maxY];
}
