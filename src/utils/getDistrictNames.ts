export function getDistrictNames(geoJson: GeoJSON.FeatureCollection): string[] {
    const names = new Set<string>()
    geoJson.features.forEach(f => {
      const name = f.properties?.DISTRICT
      if (name) names.add(name as string)
    })
    return Array.from(names).sort()
  }