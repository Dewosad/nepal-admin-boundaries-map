import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Legend from "../components/Legend";
import LeftPanel from "../leftpanel";
import type { FeatureCollection } from "geojson";

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
            w.districtName?.toUpperCase() === selectedDistrict?.toUpperCase()
        )
        .map((w) => w.name)
    : [];

  const handleMunicipalityChange = (municipalityName: string | null) => {
    setSelectedMunicipality(municipalityName);
    setSelectedWard(null);
  };

  const handleOpacityChange = (id: string, val: number) =>
    setLayers((p) => p.map((l) => (l.id === id ? { ...l, opacity: val } : l)));

  const handleToggle = (id: string) =>
    setLayers((p) =>
      p.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );

  // cascading handlers - reset children when parent changes
  const handleProvinceChange = (provinceName: string | null) => {
    // find the province fid from the name
    const province = allProvinces.find((p) => p.name === provinceName);
    setSelectedProvince(province?.fid || null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedWard(null);
  };

  const handleDistrictChange = (districtName: string | null) => {
    setSelectedDistrict(districtName);
    setSelectedMunicipality(null);
    setSelectedWard(null);
  };

  // load ALL geographic data on mount
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

    // load all districts with province SCode reference (links to province fid)
    fetch("/geojsons/districts.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const districts = gj.features.map((f) => ({
          name: f.properties?.DISTRICT,
          provinceCode: f.properties?.SCode,
        }));
        setAllDistricts(districts);
      });

    // load all municipalities with district NAME reference
    fetch("/geojsons/municipal.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const municipalities = gj.features.map((f) => ({
          name: f.properties?.GaPa_NaPa,
          districtName: f.properties?.DISTRICT,
        }));
        setAllMunicipalities(municipalities);
      });

    // load all wards with municipality NAME reference
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
  }, []);

  // initialize map
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

      // districts source and layers
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

  // filter and zoom when province selected
  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedProvince) {
      // reset province filter
      map.setFilter("states-fill", undefined);
      map.setFilter("states-line", undefined);
      map.setFilter("states-label", undefined);
      map.flyTo({ center: [84.124, 28.3949], zoom: 7 });
      return;
    }

    // find province name from fid
    const provinceName = allProvinces.find(
      (p) => String(p.fid) === String(selectedProvince)
    )?.name;
    if (!provinceName) return;

    fetch("/geojsons/provinces.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.state === provinceName
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
        map.setFilter(
          "states-fill",
          filterProv as maplibregl.FilterSpecification
        );
        map.setFilter(
          "states-line",
          filterProv as maplibregl.FilterSpecification
        );
        map.setFilter(
          "states-label",
          filterProv as maplibregl.FilterSpecification
        );
      });
  }, [selectedProvince, allProvinces]);

  // filter and zoom when district selected
  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedDistrict) {
      // reset district filter
      map.setFilter("districts-fill", undefined);
      map.setFilter("districts-line", undefined);
      map.setFilter("districts-label", undefined);
      return;
    }

    fetch("/geojsons/districts.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.DISTRICT === selectedDistrict
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
          filterDist as maplibregl.FilterSpecification
        );
        map.setFilter(
          "districts-line",
          filterDist as maplibregl.FilterSpecification
        );
        map.setFilter(
          "districts-label",
          filterDist as maplibregl.FilterSpecification
        );
      });
  }, [selectedDistrict]);

  // filter and zoom when municipality selected
  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedMunicipality) {
      // reset municipality filter
      map.setFilter("municipalities-fill", undefined);
      map.setFilter("municipalities-line", undefined);
      map.setFilter("municipalities-label", undefined);
      return;
    }

    fetch("/geojsons/municipal.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.GaPa_NaPa === selectedMunicipality
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
          filterMuni as maplibregl.FilterSpecification
        );
        map.setFilter(
          "municipalities-line",
          filterMuni as maplibregl.FilterSpecification
        );
        map.setFilter(
          "municipalities-label",
          filterMuni as maplibregl.FilterSpecification
        );
      });
  }, [selectedMunicipality]);

  // filter and zoom when ward selected
  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return;
    const map = mapRef.current;

    if (!selectedWard) {
      // reset ward filter
      map.setFilter("wards-fill", undefined);
      map.setFilter("wards-line", undefined);
      map.setFilter("wards-label", undefined);
      return;
    }

    fetch("/geojsons/nepal-wards.geojson")
      .then((r) => r.json())
      .then((gj: FeatureCollection) => {
        const filtered = {
          ...gj,
          features: gj.features.filter(
            (f) => f.properties?.SURVEY_NAM === selectedWard
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
          filterWard as maplibregl.FilterSpecification
        );
        map.setFilter(
          "wards-line",
          filterWard as maplibregl.FilterSpecification
        );
        map.setFilter(
          "wards-label",
          filterWard as maplibregl.FilterSpecification
        );
      });
  }, [selectedWard]);

  // update layer opacity and visibility
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
      />
      <div className="relative w-full">
        <div ref={mapContainerRef} className="w-full h-full" />
        <Legend />
      </div>
    </div>
  );
};

export default Map;
