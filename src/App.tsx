import { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { MVTLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "@deck.gl/layers";
import { tooltipHandler } from "./utils";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

// DeckGL react component
function App() {
  const [layers, setLayers] = useState<any>(null);

  useEffect(() => {
    setLayers(
      new MVTLayer({
        data: `https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf`,
        highlightColor: [0, 0, 128, 128],
        autoHighlight: true,
        renderSubLayers: (props) => {
          return new GeoJsonLayer(props, {
            pickable: true,
            getFillColor: [140, 170, 180],
            getElevation: (d: any) => {
              return d.properties.measuredHeight;
            },
            extruded: true,
          });
        },
        opacity: 0.6,
      })
    );
  }, []);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      getTooltip={tooltipHandler}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
