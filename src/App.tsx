import React, { useState, useEffect } from "react";
import axios from "axios";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { LineLayer } from "@deck.gl/layers";

type DirectionType = "from" | "to";
type CoordinateType = [number, number] | null;

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const MIXWAY_ENDPONT = process.env.REACT_APP_MIXWAY_ENDPONT;
const MIXWAY_ACCESS_KEY = process.env.REACT_APP_MIXWAY_ACCESS_KEY;

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
  const [fromCoordinate, setFromCoordinate] = useState<CoordinateType>(null);
  const [toCoordinate, setToCoordinate] = useState<CoordinateType>(null);

  useEffect(() => {
    if (fromCoordinate !== null && toCoordinate !== null) {
      axios
        .get(
          `${MIXWAY_ENDPONT}/search/course/extreme?key=${MIXWAY_ACCESS_KEY}&viaList=${fromCoordinate[1]},${fromCoordinate[0]}:${toCoordinate[1]},${toCoordinate[0]}`
        )
        .then((res: any) => {
          const courses = res.data.ResultSet.Course;
          if (courses !== undefined) {
            const ly = courses.map((course: any, index: number) => {
              const courseColor: [number, number, number] = [
                256 * Math.random(),
                256 * Math.random(),
                256 * Math.random(),
              ];
              const points = course.Route.Point;
              let data: any[] = [];
              points.forEach((point: any, index: number) => {
                const nextPoint = points[index + 1];
                if (nextPoint !== undefined) {
                  const currentPointName =
                    point.Station === undefined
                      ? point.Name
                      : point.Station.Name;
                  const nextPointName =
                    nextPoint.Station === undefined
                      ? nextPoint.Name
                      : nextPoint.Station.Name;
                  data.push({
                    inbound: 0,
                    outbound: 0,
                    from: {
                      name: currentPointName,
                      coordinates: [
                        Number(point.GeoPoint.longi_d),
                        Number(point.GeoPoint.lati_d),
                      ],
                    },
                    to: {
                      name: nextPointName,
                      coordinates: [
                        Number(nextPoint.GeoPoint.longi_d),
                        Number(nextPoint.GeoPoint.lati_d),
                      ],
                    },
                  });
                }
              });
              return new LineLayer({
                id: `line-layer-${index + 1}`,
                data,
                pickable: true,
                getWidth: 5,
                getSourcePosition: (d: any) => d.from.coordinates,
                getTargetPosition: (d: any) => d.to.coordinates,
                getColor: () => courseColor,
              });
            });
            setLayers(ly);
          }
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
