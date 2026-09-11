interface Layer {
  id: string;
  label: string;
  visible: boolean;
}

interface LegendProps {
  layers: Layer[];
  mapMode: "current" | "historical" | "heat";
}

const layerColors: Record<string, string> = {
  boundry: "#4da3ff",
  states: "#ffa64d",
  districts: "#FF7F7F",
  municipalities: "#7FFF7F",
  wards: "#7FFF7F",
  "old-regions": "#c084fc",
  "old-zones": "#facc15",
  "old-districts": "#fb7185",
};

const heatLegendLabels = [">40", "40", "30", "20", "10", "0", "-10", "-20", "-30", "<-30"];
const heatLegendGradient =
  "linear-gradient(to bottom, #8a0629 0%, #c91f16 11%, #f04e38 25%, #ff9165 38%, #fff36e 52%, #d0f5d9 64%, #85e4ed 76%, #649be2 89%, #481581 100%)";

const Legend = ({ layers, mapMode }: LegendProps) => {
  const visibleLayers = layers.filter((layer) => layer.visible);

  return (
    <div
      className={`absolute bottom-3 left-3 z-10 rounded-xl border border-white/60 bg-white/90 p-3 shadow-xl backdrop-blur sm:left-auto sm:bottom-6 sm:right-5 sm:p-4 ${
        mapMode === "heat" ? "w-28" : "right-3 sm:w-56"
      }`}
    >
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Legend
        </p>
        <h4 className="text-sm font-bold text-slate-900">
          {mapMode === "current"
            ? "Current Layers"
            : mapMode === "historical"
              ? "Historical Layers"
              : "Heat Map"}
        </h4>
      </div>
      <div className="flex flex-col gap-2">
        {mapMode === "heat" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-700">°C</span>
            <div className="flex items-stretch gap-3">
              <span
                className="h-44 w-3 shrink-0 rounded-full shadow-inner ring-1 ring-slate-900/10"
                style={{ background: heatLegendGradient }}
              />
              <div className="flex h-44 flex-col justify-between text-sm leading-none text-slate-900">
                {heatLegendLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {mapMode !== "heat" && visibleLayers.length === 0 && (
          <p className="text-sm text-slate-500">No active layers</p>
        )}
        {mapMode !== "heat" && visibleLayers.map((layer) => (
          <div
            key={layer.id}
            className="flex items-center justify-between gap-3 text-sm text-slate-700"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm border border-slate-300"
                style={{ backgroundColor: layerColors[layer.id] }}
              />
              <span>{layer.label}</span>
            </div>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
