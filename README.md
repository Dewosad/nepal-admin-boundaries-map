# Nepal Administrative Boundary Map (React + MapLibre)

An interactive web map for visualizing **Nepal’s administrative boundaries**
including **country, provinces, districts**, with support for **layer controls,
opacity adjustment, and zoom-based selection**.

Built using **React, MapLibre GL JS, and GeoJSON**, with MapTiler basemaps.

---

## 🚀 Features

### ✅ Implemented

- Country and province boundary visualization
- Province and district boundary layers
- Toggle layers on/off (country, province, district)
- Adjust layer opacity dynamically
- Click/select province or district to:
  - Zoom to the selected area
  - Focus on the selected layer
  - Hide non-relevant layers
- Clean map lifecycle handling in React (no re-initialization)
- Uses MapTiler basemap styles via API key

### 🛠 Planned / In Progress

- Municipality-level boundaries
- Ward-level boundaries
- Drill-down navigation:
  - Province → District → Municipality → Ward
- Reset / back-to-country view
- Sidebar-based layer and filter controls
- Feature hover highlights and labels

---

## 🗺 Data Sources

- Nepal administrative boundaries (GeoJSON):
  https://github.com/opentechcommunity/map-of-nepal

Data includes:
- Provinces
- Districts
- Municipalities
- Wards

---

## 🛠 Tech Stack

- React + TypeScript
- Vite
- MapLibre GL JS
- MapTiler (basemap provider)
- GeoJSON
- Turf.js (for zoom-to-feature bounding boxes)

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
