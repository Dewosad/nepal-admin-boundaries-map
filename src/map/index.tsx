import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Legend from "../components/Legend";
import LeftPanel from "../leftpanel";
import { getProvinceNames } from "../utils/getProvinceNames";
import { getDistrictNames } from "../utils/getDistrictNames";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  const [layers, setLayers] = useState([
    { id: "boundry", label: "Country Boundary", opacity: 0.8, visible: true },
    { id: "states", label: "Province", opacity: 0.5, visible: true },
    { id: "districts", label: "Districts", opacity: 0.2, visible: true },
    {
      id: "municipalities",
      label: "Municipalities",
      opacity: 0.2,
      visible: true,
    },
    { id: "wards", label: "Wards", opacity: 0.2, visible: true },
  ]);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [wards, setWards] = useState<string[]>([]);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);


  const handleOpacityChange = (id: string, val: number) =>
    setLayers((p) => p.map((l) => (l.id === id ? { ...l, opacity: val } : l)));

  const handleToggle = (id: string) =>
    setLayers((p) =>
      p.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
      center: [84.124, 28.3949],
      zoom: 7,
    });
    mapRef.current = map;

    map.on("load", () => {
      // boundary source and layers
      map.addSource("boundry", {
        type: "geojson",
        data: "/geojsons/nepal-boundary.geojson",
      });
      map.addLayer({
        id: "boundry-fill",
        type: "fill",
        source: "boundry",
        paint: { "fill-color": "#4da3ff", "fill-opacity": 0.5 },
      });
      map.addLayer({
        id: "boundry-line",
        type: "line",
        source: "boundry",
        paint: { "line-color": "#003366", "line-width": 4 },
      });

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

      /// districts source and layers
      map.addSource("districts", {
        type: "geojson",
        data: "/geojsons/districts.geojson",
      });
      map.addLayer({
        id: "districts-fill",
        type: "fill",
        source: "districts",
        paint: { "fill-color": "#FF7F7F", "fill-opacity": 0.2 },
      });
      map.addLayer({
        id: "districts-line",
        type: "line",
        source: "districts",
        paint: { "line-color": "#003366", "line-width": 2 },
      });
      map.addLayer({
        id: "districts-label",
        type: "symbol",
        source: "districts",
        layout: {
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

      // municipal source and layers
      map.addSource("municipalities", {
        type: "geojson",
        data: "/geojsons/municipal.geojson",
      });
      map.addLayer({
        id: "municipalities-fill",
        type: "fill",
        source: "municipalities",
        paint: { "fill-color": "#7FFF7F", "fill-opacity": 0.2 },
      });
      map.addLayer({
        id: "municipalities-line",
        type: "line",
        source: "municipalities",
        paint: { "line-color": "#003366", "line-width": 1 },
      });
      map.addLayer({
        id: "municipalities-label",
        type: "symbol",
        source: "municipalities",
        layout: {
          "text-field": ["get", "GaPa_NaPa"],
          "text-size": 8,
          "text-offset": [0, 0.6],
          "text-anchor": "top",
        },
        paint: { "text-color": "#000000" },
      });

      // wards source and layers
      map.addSource("wards", {
        type: "geojson",
        data: "/geojsons/nepal-wards.geojson",
      });
      map.addLayer({
        id: "wards-fill",
        type: "fill",
        source: "wards",
        paint: { "fill-color": "#7FFF7F", "fill-opacity": 0.2 },
      });
      map.addLayer({
        id: "wards-line",
        type: "line",
        source: "wards",
        paint: { "line-color": "#003366", "line-width": 0.5 },
      });
      map.addLayer({
        id: "wards-label",
        type: "symbol",
        source: "wards",
        layout: {
          "text-field": ["get", "SURVEY_NAM"],
          "text-size": 8,
          "text-offset": [0, 0.6],
          "text-anchor": "top",
        },
        paint: { "text-color": "#000000" },
      });
    });

    return () => map.remove();
  }, []);

  // province list for province dropdown
  useEffect(() => {
    fetch("/geojsons/provinces.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) =>
        setProvinces(getProvinceNames(gj))
      );
  }, []);

  // fly + filter when province picked
  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedProvince) {
      /* reset */
      map.setFilter("states-fill", undefined);
      map.setFilter("states-line", undefined);
      map.setFilter("states-label", undefined);
      map.flyTo({ center: [84.124, 28.3949], zoom: 7 });
      return;
    }

    fetch("/geojsons/provinces.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.state === selectedProvince
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const coords = f.geometry.coordinates;

          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });
        // const [minX, minY, maxX, maxY] = getBbox(filtered);
        // map.fitBounds(
        //   [ [minX, minY], [maxX, maxY] ],
        //   { padding: 40 }
        // );

        const filterProv = ["==", ["get", "state"], selectedProvince];
        map.setFilter("states-fill", filterProv);
        map.setFilter("states-line", filterProv);
        map.setFilter("states-label", filterProv);
      });
  }, [selectedProvince]);

  // for district filter

  useEffect(() => {
    fetch("/geojsons/districts.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) =>
        setDistrict(getDistrictNames(gj))
      );
  }, []);

  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedDistrict) {
      map.setFilter("districts-fill", undefined);
      map.setFilter("districts-line", undefined);
      map.setFilter("districts-label", undefined);
      map.flyTo({ center: [84.124, 28.3949], zoom: 7 });
      return;
    }

    fetch("/geojsons/districts.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.DISTRICT === selectedDistrict
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const coords = f.geometry.coordinates;

          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });
        const filterProv = ["==", ["get", "DISTRICT"], selectedDistrict];
        map.setFilter("districts-fill", filterProv);
        map.setFilter("districts-line", filterProv);
        map.setFilter("districts-label", filterProv);
      });
  }, [selectedDistrict]);

  // municipalities filter
  useEffect(() => {
    fetch("/geojsons/municipal.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) =>
        setMunicipalities(gj.features.map((f) => f.properties?.GaPa_NaPa))
      );
  }, []);

   useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedMunicipality) {
      map.setFilter("municipalities-fill", undefined);
      map.setFilter("municipalities-line", undefined);
      map.setFilter("municipalities-label", undefined);
      map.flyTo({ center: [84.124, 28.3949], zoom: 7 });
      return;
    }

    fetch("/geojsons/municipal.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.GaPa_NaPa === selectedMunicipality
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const coords = f.geometry.coordinates;

          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });
        const filterProv = ["==", ["get", "GaPa_NaPa"], selectedMunicipality];
        map.setFilter("municipalities-fill", filterProv);
        map.setFilter("municipalities-line", filterProv);
        map.setFilter("municipalities-label", filterProv);
      });
  }, [selectedMunicipality]);

  // wards filter
  useEffect(() => {
    fetch("/geojsons/nepal-wards.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) =>
        setWards(gj.features.map((f) => f.properties?.SURVEY_NAM))
      );
  }, []);

  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedWard) {
      map.setFilter("wards-fill", undefined);
      map.setFilter("wards-line", undefined);
      map.setFilter("wards-label", undefined);
      map.flyTo({ center: [84.124, 28.3949], zoom: 7 });
      return;
    }

    fetch("/geojsons/nepal-wards.geojson")
      .then((r) => r.json())
      .then((gj: GeoJSON.FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.SURVEY_NAM === selectedWard
          ),
        };

        const bounds = new maplibregl.LngLatBounds();
        filtered.features.forEach((f) => {
          const coords = f.geometry.coordinates;

          const flat = coords.flat(Infinity);
          for (let i = 0; i < flat.length; i += 2) {
            bounds.extend([flat[i], flat[i + 1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });
        const filterProv = ["==", ["get", "SURVEY_NAM"], selectedWard];
        map.setFilter("wards-fill", filterProv);
        map.setFilter("wards-line", filterProv);
        map.setFilter("wards-label", filterProv);
      });
  }, [selectedWard]);
  

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    layers.forEach((l) => {
      if (map.getLayer(`${l.id}-fill`))
        map.setPaintProperty(`${l.id}-fill`, "fill-opacity", l.opacity);
      if (map.getLayer(`${l.id}-fill`))
        map.setLayoutProperty(
          `${l.id}-fill`,
          "visibility",
          l.visible ? "visible" : "none"
        );
      if (map.getLayer(`${l.id}-line`))
        map.setLayoutProperty(
          `${l.id}-line`,
          "visibility",
          l.visible ? "visible" : "none"
        );
      if (map.getLayer(`${l.id}-label`))
        map.setLayoutProperty(
          `${l.id}-label`,
          "visibility",
          l.visible ? "visible" : "none"
        );
    });
  }, [layers]);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <LeftPanel
        layers={layers}
        onOpacityChange={handleOpacityChange}
        onToggle={handleToggle}
        provinces={provinces}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        district={district}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        municipalities={municipalities}
        selectedMunicipality={selectedMunicipality}
        setSelectedMunicipality={setSelectedMunicipality}
        wards={wards}
        selectedWard={selectedWard}
        setSelectedWard={setSelectedWard}
      />
      <div className="relative w-full">
        <div ref={mapContainerRef} className="w-full h-full" />
        <Legend />
      </div>
    </div>
  );
};

export default Map;
