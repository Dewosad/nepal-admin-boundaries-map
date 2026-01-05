import React, { useState } from "react";
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
}

const LeftPanel = ({
  layers = [],
  onOpacityChange = () => {},
  onToggle = () => {},
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
}: LeftPanelProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="h-screen w-64 bg-white p-4 overflow-y-auto shadow-lg z-10 ">
      <div
        onClick={() => setShow(!show)}
        className="flex justify-between items-center cursor-pointer mb-4"
      >
        <span className="font-bold text-xl">Filter</span>
        <svg
          className={`w-6 h-6 transform transition-transform ${
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
      {show &&
        layers.map((layer) => (
          <div key={layer.id} className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{layer.label}</span>
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

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1>Province Filter</h1>
          <Selector
            admin={provinces}
            selected={selectedProvince}
            onSelect={setSelectedProvince}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1>District Filter</h1>
          <Selector
            admin={district}
            selected={selectedDistrict}
            onSelect={setSelectedDistrict}
            disabled={!selectedProvince}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1>Municipality Filter</h1>
          <Selector
            admin={municipalities}
            selected={selectedMunicipality}
            onSelect={setSelectedMunicipality}
            disabled={!selectedDistrict}
          />
        </div>
         <div className="flex flex-col gap-2">
          <h1>Ward Filter</h1>
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
