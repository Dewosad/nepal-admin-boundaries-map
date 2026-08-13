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

const Legend = ({ layers, mapMode }: LegendProps) => {
  const visibleLayers = layers.filter((layer) => layer.visible);

  return (
    <div className="absolute bottom-6 right-5 z-10 w-56 rounded-xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur">
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
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="h-3 w-8 rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500" />
            <span>Yr air temperature</span>
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
