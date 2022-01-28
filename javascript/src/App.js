import { useState, useEffect } from "react";
import DeckGL, { FirstPersonView } from "deck.gl";
import { StaticMap } from "react-map-gl";
import renderLayers from "./RenderLayers.js";
import { LightingEffect, AmbientLight } from "@deck.gl/core";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

//fps viewオブジェクトを設定　デフォルトコントローラーをonに
const view = new FirstPersonView({ id: "pov", controller: true });

//ライト設定
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 30,
});

const lightingEffect = new LightingEffect({ ambientLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5];

// DeckGL react component
function App() {
  //ビューステイタス
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

  //resize
  useEffect(() => {
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
    <div>
      <DeckGL
        views={view}
        effects={[lightingEffect]}
        layers={renderLayers()}
        viewState={viewState}
        onViewStateChange={(v) => setViewState(v.viewState)}
      >
        {/* <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} /> */}
      </DeckGL>
    </div>
  );
}

export default App;
