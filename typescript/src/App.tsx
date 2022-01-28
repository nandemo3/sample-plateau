import { useState, useEffect } from "react";
import DeckGL, { FirstPersonView, View } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { MVTLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "@deck.gl/layers";
import { tooltipHandler } from "./utils";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const view = new FirstPersonView({
  controller: true,
  fovy: 75,
});

// DeckGL react component
function App() {
  const [layers, setLayers] = useState<any>(null);
  const [viewState, setViewState] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 35.6720975,
    longitude: 139.762097,
    zoom: 18,
    position: [-150.54515584329803, 381.95179234704807, 185.46131980856774],
    pitch: 1.4191513016472443,
    bearing: 137.7514330380407,
  });

  useEffect(() => {
    setLayers(
      new MVTLayer({
        data: `https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf`,
        minZoom: 0,
        maxZoom: 23,
        highlightColor: [0, 0, 128, 128],
        autoHighlight: true,
        renderSubLayers: (props) => {
          return new GeoJsonLayer(props, {
            pickable: true,
            extruded: true,
            wireframe: true,
            getFillColor: [140, 170, 180],
            getElevation: (d: any) => {
              return d.properties.measuredHeight;
            },
          });
        },
        opacity: 0.6,
      })
    );
    const handleResize = () => {
      setViewState((v) => {
        return {
          ...v,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DeckGL
      // @ts-ignore
      views={view}
      viewState={viewState}
      onViewStateChange={(v) => setViewState(v.viewState)}
      layers={layers}
      getTooltip={tooltipHandler}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
