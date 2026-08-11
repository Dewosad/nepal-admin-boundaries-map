import { useState } from "react";
import OpacitySlider from "../components/opacityslider/OpacitySlider";
import ToggleButton from "../components/togglebutton/ToggleButton";
import Selector from "../components/Selector";

interface Layer {
  id: string;
  label: string;
  opacity: number;
  visible: boolean;
}

interface LeftPanelProps {
  layers: Layer[];
  onOpacityChange: (id: string, val: number) => void;
  onToggle: (id: string) => void;
  onResetLayers: () => void;
  provinces: string[];
  selectedProvince: string | null;
  setSelectedProvince: (p: string | null) => void;
  district: string[];
  selectedDistrict: string | null;
  setSelectedDistrict: (p: string | null) => void;
  municipalities: string[];
  selectedMunicipality: string | null;
  setSelectedMunicipality: (p: string | null) => void;
  wards: string[];
  selectedWard: string | null;
  setSelectedWard: (p: string | null) => void;
  onResetFilters: () => void;
}

const LeftPanel = ({
  layers = [],
  onOpacityChange = () => {},
  onToggle = () => {},
  onResetLayers,
  provinces,
  selectedProvince,
  setSelectedProvince,
  district,
  selectedDistrict,
  setSelectedDistrict,
  municipalities,
  selectedMunicipality,
  setSelectedMunicipality,
  wards,
  selectedWard,
  setSelectedWard,
  onResetFilters,
}: LeftPanelProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="h-screen w-72 bg-slate-50 p-4 overflow-y-auto shadow-xl z-10 border-r border-slate-200">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Controls
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Nepal Map</h1>
      </div>
      <div
        onClick={() => setShow(!show)}
        className="flex justify-between items-center cursor-pointer mb-4 rounded-lg bg-white px-3 py-3 shadow-sm border border-slate-200 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <div>
          <span className="font-semibold text-slate-900">Map Layers</span>
          <p className="text-xs text-slate-500">Visibility and opacity</p>
        </div>
        <svg
          className={`w-5 h-5 text-slate-500 transform transition-transform ${
            show ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {show && (
        <button
          type="button"
          className="mb-3 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          onClick={onResetLayers}
        >
          Reset Layers
        </button>
      )}
      {show &&
        layers.map((layer) => (
          <div
            key={layer.id}
            className="mb-3 rounded-lg bg-white p-3 shadow-sm border border-slate-200 transition hover:border-slate-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm text-slate-800">
                {layer.label}
              </span>
              <ToggleButton
                isActive={layer.visible}
                onClick={() => onToggle(layer.id)}
              />
            </div>
            <OpacitySlider
              title="Opacity"
              value={layer.opacity}
              handler={(e: any) =>
                onOpacityChange(layer.id, parseFloat(e.target.value))
              }
            />
          </div>
        ))}

      <div className="flex flex-col gap-4 rounded-lg bg-white p-3 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">Admin Filters</h2>
            <p className="text-xs text-slate-500">Narrow the current map</p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onResetFilters}
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-medium text-slate-700">
            Province Filter
          </h1>
          <Selector
            admin={provinces}
            selected={selectedProvince}
            onSelect={setSelectedProvince}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-medium text-slate-700">
            District Filter
          </h1>
          <Selector
            admin={district}
            selected={selectedDistrict}
            onSelect={setSelectedDistrict}
            disabled={!selectedProvince}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-medium text-slate-700">
            Municipality Filter
          </h1>
          <Selector
            admin={municipalities}
            selected={selectedMunicipality}
            onSelect={setSelectedMunicipality}
            disabled={!selectedDistrict}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-medium text-slate-700">Ward Filter</h1>
          <Selector
            admin={wards}
            selected={selectedWard}
            onSelect={setSelectedWard}
            disabled={!selectedMunicipality}
          />
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
