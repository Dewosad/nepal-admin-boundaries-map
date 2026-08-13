import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Legend from "../components/Legend";
import LeftPanel from "../leftpanel";
import { registerYrHeatProtocol } from "../lib/yrHeatProtocol";
import type { FeatureCollection } from "geojson";

type MapMode = "current" | "historical" | "heat";

interface LayerConfig {
  id: string;
  label: string;
  opacity: number;
  visible: boolean;
}

interface YrAvailableTiles {
  maxzoom?: number;
  times?: {
    tiles?: {
      webp?: string;
      png?: string;
    };
  }[];
}

const layerConfigs: Record<MapMode, LayerConfig[]> = {
  current: [
    { id: "boundry", label: "Country Boundary", opacity: 0.8, visible: false },
    { id: "states", label: "Province", opacity: 0.5, visible: true },
    { id: "districts", label: "Districts", opacity: 0.2, visible: false },
    {
      id: "municipalities",
      label: "Municipalities",
      opacity: 0.2,
      visible: false,
    },
    { id: "wards", label: "Wards", opacity: 0.2, visible: false },
  ],
  historical: [
    { id: "old-regions", label: "Old Regions", opacity: 0.4, visible: true },
    { id: "old-zones", label: "Old Zones", opacity: 0.3, visible: false },
    {
      id: "old-districts",
      label: "Old Districts",
      opacity: 0.2,
      visible: false,
    },
  ],
  heat: [],
};

const getStreetMapStyleUrl = (maptilerKey: string) => {
  return `https://api.maptiler.com/maps/topo-v2/style.json?key=${maptilerKey}`;
};

const addMapLayer = (map: maplibregl.Map, id: string) => {
  if (map.getSource(id)) return;

  if (id === "boundry") {
    // boundary source and layers
    map.addSource("boundry", {
      type: "geojson",
      data: "/geojsons/nepal-boundary.geojson",
    });
    map.addLayer({
      id: "boundry-fill",
      type: "fill",
      source: "boundry",
      layout: { visibility: "none" },
      paint: { "fill-color": "#4da3ff", "fill-opacity": 0.5 },
    });
    map.addLayer({
      id: "boundry-line",
      type: "line",
      source: "boundry",
      layout: { visibility: "none" },
      paint: { "line-color": "#003366", "line-width": 4 },
    });
  }

  if (id === "states") {
    // states/provinces source and layers
    map.addSource("states", {
      type: "geojson",
      data: "/geojsons/provinces.geojson",
    });
    map.addLayer({
      id: "states-fill",
      type: "fill",
      source: "states",
      paint: { "fill-color": "#ffa64d", "fill-opacity": 0.5 },
    });
    map.addLayer({
      id: "states-line",
      type: "line",
      source: "states",
      paint: { "line-color": "#003366", "line-width": 3 },
    });
    map.addLayer({
      id: "states-label",
      type: "symbol",
      source: "states",
      layout: {
        "text-field": ["get", "state"],
        "text-size": 20,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: { "text-color": "#ffffff" },
    });
  }

  if (id === "districts") {
    // districts source and layers
    map.addSource("districts", {
      type: "geojson",
      data: "/geojsons/districts.geojson",
    });
    map.addLayer({
      id: "districts-fill",
      type: "fill",
      source: "districts",
      layout: { visibility: "none" },
      paint: { "fill-color": "#FF7F7F", "fill-opacity": 0.2 },
    });
    map.addLayer({
      id: "districts-line",
      type: "line",
      source: "districts",
      layout: { visibility: "none" },
      paint: { "line-color": "#003366", "line-width": 2 },
    });
    map.addLayer({
      id: "districts-label",
      type: "symbol",
      source: "districts",
      layout: {
        visibility: "none",
        "text-field": ["get", "DISTRICT"],
        "text-size": 12,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    });
  }

  if (id === "municipalities") {
    // municipal source and layers
    map.addSource("municipalities", {
      type: "geojson",
      data: "/geojsons/municipal.geojson",
    });
    map.addLayer({
      id: "municipalities-fill",
      type: "fill",
      source: "municipalities",
      layout: { visibility: "none" },
      paint: { "fill-color": "#7FFF7F", "fill-opacity": 0.2 },
    });
    map.addLayer({
      id: "municipalities-line",
      type: "line",
      source: "municipalities",
      layout: { visibility: "none" },
      paint: { "line-color": "#003366", "line-width": 1 },
    });
    map.addLayer({
      id: "municipalities-label",
      type: "symbol",
      source: "municipalities",
      layout: {
        visibility: "none",
        "text-field": ["get", "GaPa_NaPa"],
        "text-size": 8,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: { "text-color": "#000000" },
    });
  }

  if (id === "wards") {
    // wards source and layers
    map.addSource("wards", {
      type: "geojson",
      data: "/geojsons/nepal-wards.geojson",
    });
    map.addLayer({
      id: "wards-fill",
      type: "fill",
      source: "wards",
      layout: { visibility: "none" },
      paint: { "fill-color": "#7FFF7F", "fill-opacity": 0.2 },
    });
    map.addLayer({
      id: "wards-line",
      type: "line",
      source: "wards",
      layout: { visibility: "none" },
      paint: { "line-color": "#003366", "line-width": 0.5 },
    });
    map.addLayer({
      id: "wards-label",
      type: "symbol",
      source: "wards",
      layout: {
        visibility: "none",
        "text-field": ["get", "SURVEY_NAM"],
        "text-size": 8,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: { "text-color": "#000000" },
    });
  }

  if (id === "old-regions") {
    // historic regions source and layers
    map.addSource("old-regions", {
      type: "geojson",
      data: "/historicalgeojsons/nepal-old-regions.geojson",
    });
    map.addLayer({
      id: "old-regions-fill",
      type: "fill",
      source: "old-regions",
      layout: { visibility: "none" },
      paint: { "fill-color": "#c084fc", "fill-opacity": 0.4 },
    });
    map.addLayer({
      id: "old-regions-line",
      type: "line",
      source: "old-regions",
      layout: { visibility: "none" },
      paint: { "line-color": "#581c87", "line-width": 3 },
    });
    map.addLayer({
      id: "old-regions-label",
      type: "symbol",
      source: "old-regions",
      layout: {
        visibility: "none",
        "text-field": ["get", "name_1"],
        "text-size": 18,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    });
  }

  if (id === "old-zones") {
    // historic zones source and layers
    map.addSource("old-zones", {
      type: "geojson",
      data: "/historicalgeojsons/nepal-old-zones.geojson",
    });
    map.addLayer({
      id: "old-zones-fill",
      type: "fill",
      source: "old-zones",
      layout: { visibility: "none" },
      paint: { "fill-color": "#facc15", "fill-opacity": 0.3 },
    });
    map.addLayer({
      id: "old-zones-line",
      type: "line",
      source: "old-zones",
      layout: { visibility: "none" },
      paint: { "line-color": "#854d0e", "line-width": 2 },
    });
    map.addLayer({
      id: "old-zones-label",
      type: "symbol",
      source: "old-zones",
      layout: {
        visibility: "none",
        "text-field": ["get", "name_2"],
        "text-size": 12,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    });
  }

  if (id === "old-districts") {
    // historic districts source and layers
    map.addSource("old-districts", {
      type: "geojson",
      data: "/historicalgeojsons/nepal-old-districts.geojson",
    });
    map.addLayer({
      id: "old-districts-fill",
      type: "fill",
      source: "old-districts",
      layout: { visibility: "none" },
      paint: { "fill-color": "#fb7185", "fill-opacity": 0.2 },
    });
    map.addLayer({
      id: "old-districts-line",
      type: "line",
      source: "old-districts",
      layout: { visibility: "none" },
      paint: { "line-color": "#881337", "line-width": 1.5 },
    });
    map.addLayer({
      id: "old-districts-label",
      type: "symbol",
      source: "old-districts",
      layout: {
        visibility: "none",
        "text-field": ["get", "district"],
        "text-size": 10,
        "text-offset": [0, 0.6],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1,
      },
    });
  }
};

const addHeatLayer = (map: maplibregl.Map, tileUrl: string, maxzoom = 6) => {
  const decodedTileUrl = `yrheat://${tileUrl}`;
  const backgroundLayerIndex = map
    .getStyle()
    .layers?.findIndex((l) => l.type === "hillshade");
  const backgroundLayerId =
    backgroundLayerIndex !== undefined && backgroundLayerIndex >= 0
      ? map.getStyle().layers?.[backgroundLayerIndex + 1].id
      : undefined;

  console.log("test layers", map.getStyle());

  const layersToRemove = [
    // Custom
    "boundry-line",
    "states-fill",
    "states-line",
    "states-label",

    // Water
    "Water",
    "Water intermittent",
    "River",
    "River intermittent",
    "River tunnel",
    "Waterway",
    "Waterway intermittent",

    // Roads
    "Minor road outline",
    "Major road outline",
    "Highway outline",
    "Minor road",
    "Major road",
    "Highway",
    "Path minor",
    "Path",
    "State labels",
    // "City labels",
    "Town labels",
    // "Country labels",
    "Continent labels",

    // Boundaries
    "Other border",
    "Disputed border",
    // "Country border",
  ];

  layersToRemove.forEach((layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  if (!map.getSource("yr-heat-map")) {
    // yr air temperature source and layer
    map.addSource("yr-heat-map", {
      type: "raster",
      tiles: [decodedTileUrl],
      tileSize: 256,
      maxzoom,
    });
    map.addLayer(
      {
        id: "yr-heat-map-layer",
        type: "raster",
        source: "yr-heat-map",
        paint: {
          "raster-opacity": 0.75,
          "raster-fade-duration": 0,
        },
      },
      backgroundLayerId,
    );
    return;
  }

  const source = map.getSource("yr-heat-map") as maplibregl.RasterTileSource & {
    setTiles: (tiles: string[]) => void;
  };
  source.setTiles([decodedTileUrl]);
};

const hideConfiguredMapLayers = (map: maplibregl.Map) => {
  const allLayers = [
    ...layerConfigs.current,
    ...layerConfigs.historical,
    ...layerConfigs.heat,
  ];

  allLayers.forEach((layer) => {
    if (map.getLayer(`${layer.id}-fill`)) {
      map.setPaintProperty(`${layer.id}-fill`, "fill-opacity", 0);
      map.setLayoutProperty(`${layer.id}-fill`, "visibility", "none");
    }
    if (map.getLayer(`${layer.id}-line`)) {
      map.setLayoutProperty(`${layer.id}-line`, "visibility", "none");
    }
    if (map.getLayer(`${layer.id}-label`)) {
      map.setLayoutProperty(`${layer.id}-label`, "visibility", "none");
    }
  });
};

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  const [mapMode, setMapMode] = useState<MapMode>("current");
  const [layers, setLayers] = useState(layerConfigs.current);
  const [heatTileUrl, setHeatTileUrl] = useState<string | null>(null);
  const [heatMaxZoom, setHeatMaxZoom] = useState(6);
  const [heatMapError, setHeatMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [allProvinces, setAllProvinces] = useState<
    { name: string; fid: string | number }[]
  >([]);
  const [allDistricts, setAllDistricts] = useState<
    { name: string; provinceCode: string | number }[]
  >([]);
  const [allMunicipalities, setAllMunicipalities] = useState<
    { name: string; districtName: string }[]
  >([]);
  const [allWards, setAllWards] = useState<
    { name: string; municipalityName: string; districtName: string }[]
  >([]);

  const [selectedProvince, setSelectedProvince] = useState<
    string | number | null
  >(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  useEffect(() => {
    registerYrHeatProtocol();
  }, []);

  // for dropdowns
  const provinces = allProvinces.map((p) => p.name);

  // filter districts by selected province's fid
  const districts = selectedProvince
    ? allDistricts
        .filter((d) => String(d.provinceCode) === String(selectedProvince))
        .map((d) => d.name)
    : [];

  // filter municipalities by selected district NAME
  const municipalities = selectedDistrict
    ? allMunicipalities
        .filter((m) => m.districtName === selectedDistrict)
        .map((m) => m.name)
    : [];

  // filter wards by selected district
  const wards = selectedDistrict
    ? allWards
        .filter(
          (w) =>
            w.districtName?.toUpperCase() === selectedDistrict?.toUpperCase(),
        )
        .map((w) => w.name)
    : [];

  const handleMunicipalityChange = (municipalityName: string | null) => {
    setSelectedMunicipality(municipalityName);
    setSelectedWard(null);

    if (municipalityName && allWards.length === 0) {
      fetch("/geojsons/nepal-wards.geojson")
        .then((r) => r.json())
        .then((gj: FeatureCollection) => {
          const wards = gj.features.map((f) => ({
            name: f.properties?.SURVEY_NAM,
            municipalityName: f.properties?.VDC_NAME,
            districtName: f.properties?.DISTRICT,
          }));
          setAllWards(wards);
        });
    }
  };

  const handleOpacityChange = (id: string, val: number) =>
    setLayers((p) => p.map((l) => (l.id === id ? { ...l, opacity: val } : l)));

  const handleToggle = (id: string) =>
    setLayers((p) =>
      p.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    );

  const handleMapModeChange = (mode: MapMode) => {
    if (mode === "heat" && mapRef.current?.isStyleLoaded()) {
      hideConfiguredMapLayers(mapRef.current);
    }

    setMapMode(mode);
    setLayers(layerConfigs[mode]);
  };

  const handleResetLayers = () => {
    setLayers(layerConfigs[mapMode]);
  };

  // cascading handlers - reset children when parent changes
  const handleProvinceChange = (provinceName: string | null) => {
    // find the province fid from the name
    const province = allProvinces.find((p) => p.name === provinceName);
    setSelectedProvince(province?.fid || null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedWard(null);

    if (provinceName && allDistricts.length === 0) {
      fetch("/geojsons/districts.geojson")
        .then((r) => r.json())
        .then((gj: FeatureCollection) => {
          const districts = gj.features.map((f) => ({
            name: f.properties?.DISTRICT,
            provinceCode: f.properties?.SCode,
          }));
          setAllDistricts(districts);
        });
    }
  };

  const handleDistrictChange = (districtName: string | null) => {
    setSelectedDistrict(districtName);
    setSelectedMunicipality(null);
    setSelectedWard(null);

    if (districtName && allMunicipalities.length === 0) {
      fetch("/geojsons/municipal.geojson")
        .then((r) => r.json())
        .then((gj: FeatureCollection) => {
          const municipalities = gj.features.map((f) => ({
            name: f.properties?.GaPa_NaPa,
            districtName: f.properties?.DISTRICT,
          }));
          setAllMunicipalities(municipalities);
        });
    }
  };

  const handleResetFilters = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedWard(null);
  };

  // load province data on mount
  useEffect(() => {
    // load all provinces with name and fid
    fetch("/geojsons/provinces.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const provinces = gj.features.map((f) => ({
          name: f.properties?.state,
          fid: f.properties?.fid,
        }));
        setAllProvinces(provinces);
      });
  }, []);

  // initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getStreetMapStyleUrl(MAPTILER_KEY),
      center: [84.124, 28.3949],
      zoom: 7,
    });
    mapRef.current = map;

    map.on("load", () => {
      setIsMapLoaded(true);
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapMode !== "heat" || heatTileUrl) return;

    fetch("https://prod.yr-maps.met.no/api/air-temperature/available.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Yr metadata failed: ${r.status}`);
        return r.json();
      })
      .then((availableTiles: YrAvailableTiles) => {
        const latestTileUrl = availableTiles.times?.[0]?.tiles?.png;
        // ??
        // availableTiles.times?.[0]?.tiles?.webp;

        if (!latestTileUrl) {
          setHeatMapError("No Yr heat tiles available.");
          return;
        }

        setHeatTileUrl(latestTileUrl);
        setHeatMaxZoom(availableTiles.maxzoom ?? 6);
        setHeatMapError(null);
      })
      .catch((error) => {
        setHeatMapError("Failed to load Yr heat tiles.");
        console.error("Failed to load Yr heat tiles", error);
      });
  }, [mapMode, heatTileUrl]);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (mapMode !== "heat") {
      if (map.getLayer("yr-heat-map-layer")) {
        map.setLayoutProperty("yr-heat-map-layer", "visibility", "none");
      }
      return;
    }

    if (!heatTileUrl) return;

    addHeatLayer(map, heatTileUrl, heatMaxZoom);
    map.setLayoutProperty("yr-heat-map-layer", "visibility", "visible");
  }, [mapMode, heatTileUrl, heatMaxZoom, isMapLoaded]);

  // filter and zoom when province selected
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedProvince) {
      // reset province filter
      if (map.getLayer("states-fill")) map.setFilter("states-fill", undefined);
      if (map.getLayer("states-line")) map.setFilter("states-line", undefined);
      if (map.getLayer("states-label"))
        map.setFilter("states-label", undefined);
      map.flyTo({ center: [84.124, 28.3949], zoom: 7 });
      return;
    }

    // find province name from fid
    const provinceName = allProvinces.find(
      (p) => String(p.fid) === String(selectedProvince),
    )?.name;
    if (!provinceName) return;

    fetch("/geojsons/provinces.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.state === provinceName,
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const geometry = f.geometry as any;
          const coords = geometry.coordinates;
          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });

        const filterProv = ["==", ["get", "state"], provinceName];
        if (map.getLayer("states-fill"))
          map.setFilter(
            "states-fill",
            filterProv as maplibregl.FilterSpecification,
          );
        if (map.getLayer("states-line"))
          map.setFilter(
            "states-line",
            filterProv as maplibregl.FilterSpecification,
          );
        if (map.getLayer("states-label"))
          map.setFilter(
            "states-label",
            filterProv as maplibregl.FilterSpecification,
          );
      });
  }, [selectedProvince, allProvinces, isMapLoaded]);

  // filter and zoom when district selected
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedDistrict) {
      // reset district filter
      if (map.getLayer("districts-fill"))
        map.setFilter("districts-fill", undefined);
      if (map.getLayer("districts-line"))
        map.setFilter("districts-line", undefined);
      if (map.getLayer("districts-label"))
        map.setFilter("districts-label", undefined);
      return;
    }

    addMapLayer(map, "districts");

    fetch("/geojsons/districts.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.DISTRICT === selectedDistrict,
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const geometry = f.geometry as any;
          const coords = geometry.coordinates;
          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });

        const filterDist = ["==", ["get", "DISTRICT"], selectedDistrict];
        map.setFilter(
          "districts-fill",
          filterDist as maplibregl.FilterSpecification,
        );
        map.setFilter(
          "districts-line",
          filterDist as maplibregl.FilterSpecification,
        );
        map.setFilter(
          "districts-label",
          filterDist as maplibregl.FilterSpecification,
        );
      });
  }, [selectedDistrict, isMapLoaded]);

  // filter and zoom when municipality selected
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedMunicipality) {
      // reset municipality filter
      if (map.getLayer("municipalities-fill"))
        map.setFilter("municipalities-fill", undefined);
      if (map.getLayer("municipalities-line"))
        map.setFilter("municipalities-line", undefined);
      if (map.getLayer("municipalities-label"))
        map.setFilter("municipalities-label", undefined);
      return;
    }

    addMapLayer(map, "municipalities");

    fetch("/geojsons/municipal.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.GaPa_NaPa === selectedMunicipality,
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const geometry = f.geometry as any;
          const coords = geometry.coordinates;
          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });

        const filterMuni = ["==", ["get", "GaPa_NaPa"], selectedMunicipality];
        map.setFilter(
          "municipalities-fill",
          filterMuni as maplibregl.FilterSpecification,
        );
        map.setFilter(
          "municipalities-line",
          filterMuni as maplibregl.FilterSpecification,
        );
        map.setFilter(
          "municipalities-label",
          filterMuni as maplibregl.FilterSpecification,
        );
      });
  }, [selectedMunicipality, isMapLoaded]);

  // filter and zoom when ward selected
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedWard) {
      // reset ward filter
      if (map.getLayer("wards-fill")) map.setFilter("wards-fill", undefined);
      if (map.getLayer("wards-line")) map.setFilter("wards-line", undefined);
      if (map.getLayer("wards-label")) map.setFilter("wards-label", undefined);
      return;
    }

    addMapLayer(map, "wards");

    fetch("/geojsons/nepal-wards.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.SURVEY_NAM === selectedWard,
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const geometry = f.geometry as any;
          const coords = geometry.coordinates;
          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });

        const filterWard = ["==", ["get", "SURVEY_NAM"], selectedWard];
        map.setFilter(
          "wards-fill",
          filterWard as maplibregl.FilterSpecification,
        );
        map.setFilter(
          "wards-line",
          filterWard as maplibregl.FilterSpecification,
        );
        map.setFilter(
          "wards-label",
          filterWard as maplibregl.FilterSpecification,
        );
      });
  }, [selectedWard, isMapLoaded]);

  // update layer opacity and visibility
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (mapMode === "heat") {
      hideConfiguredMapLayers(map);
      return;
    }

    const activeLayerIds = layers.map((l) => l.id);
    const allLayers = [
      ...layerConfigs.current,
      ...layerConfigs.historical,
      ...layerConfigs.heat,
    ];

    allLayers.forEach((l) => {
      const activeLayer = layers.find((layer) => layer.id === l.id);
      const isActiveMapLayer = activeLayerIds.includes(l.id);
      const isVisible = isActiveMapLayer && activeLayer?.visible;

      if (isVisible) {
        addMapLayer(map, l.id);
      }

      if (map.getLayer(`${l.id}-fill`))
        map.setPaintProperty(
          `${l.id}-fill`,
          "fill-opacity",
          activeLayer?.opacity ?? l.opacity,
        );
      if (map.getLayer(`${l.id}-fill`))
        map.setLayoutProperty(
          `${l.id}-fill`,
          "visibility",
          isVisible ? "visible" : "none",
        );
      if (map.getLayer(`${l.id}-line`))
        map.setLayoutProperty(
          `${l.id}-line`,
          "visibility",
          isVisible ? "visible" : "none",
        );
      if (map.getLayer(`${l.id}-label`))
        map.setLayoutProperty(
          `${l.id}-label`,
          "visibility",
          isVisible ? "visible" : "none",
        );
    });
  }, [layers, mapMode, isMapLoaded]);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <LeftPanel
        layers={layers}
        onOpacityChange={handleOpacityChange}
        onToggle={handleToggle}
        onResetLayers={handleResetLayers}
        provinces={provinces}
        selectedProvince={
          allProvinces.find((p) => String(p.fid) === String(selectedProvince))
            ?.name || null
        }
        setSelectedProvince={handleProvinceChange}
        district={districts}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={handleDistrictChange}
        municipalities={municipalities}
        selectedMunicipality={selectedMunicipality}
        setSelectedMunicipality={handleMunicipalityChange}
        wards={wards}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
        onResetFilters={handleResetFilters}
      />
      <div className="relative w-full">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute right-5 top-5 z-10 rounded-xl border border-white/60 bg-white/90 p-1 shadow-xl backdrop-blur">
          <div className="grid grid-cols-3 gap-1">
            <button
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mapMode === "current"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => handleMapModeChange("current")}
            >
              Current
            </button>
            <button
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mapMode === "historical"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => handleMapModeChange("historical")}
            >
              Historical
            </button>
            <button
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mapMode === "heat"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => handleMapModeChange("heat")}
            >
              Heat Map
            </button>
          </div>
        </div>
        {mapMode === "heat" && heatMapError && (
          <div className="absolute right-5 top-20 z-10 rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-xl backdrop-blur">
            {heatMapError}
          </div>
        )}
        <Legend layers={layers} mapMode={mapMode} />
      </div>
    </div>
  );
};

export default Map;
