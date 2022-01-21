import { useState } from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";

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

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
