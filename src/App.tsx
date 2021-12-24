import { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";

import { CoordinateType } from "./types";
import { getRouteLayer } from "./layers/RouteLayer";

type DirectionType = "from" | "to";
type CoordinateStateType = CoordinateType | null;

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
  const [direction, setDirection] = useState<DirectionType>("from");
  const [fromCoordinate, setFromCoordinate] =
    useState<CoordinateStateType>(null);
  const [toCoordinate, setToCoordinate] = useState<CoordinateStateType>(null);

  useEffect(() => {
    if (fromCoordinate !== null && toCoordinate !== null) {
      getRouteLayer(fromCoordinate, toCoordinate).then((res: any) => {
        setLayers(res);
      });
    }
  }, [fromCoordinate, toCoordinate]);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      onClick={(info: any) => {
        if (direction === "from") {
          setFromCoordinate(info.coordinate);
          setDirection("to");
        } else {
          setToCoordinate(info.coordinate);
          setDirection("from");
        }
      }}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
