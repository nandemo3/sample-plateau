import axios from "axios";
import { LineLayer } from "@deck.gl/layers";

import { CoordinateType } from "../types";

const MIXWAY_ENDPONT = process.env.REACT_APP_MIXWAY_ENDPONT;
const MIXWAY_ACCESS_KEY = process.env.REACT_APP_MIXWAY_ACCESS_KEY;

export const getRouteLayer = (
  fromCoordinate: CoordinateType,
  toCoordinate: CoordinateType
) => {
  return axios
    .get(
      `${MIXWAY_ENDPONT}/search/course/extreme?key=${MIXWAY_ACCESS_KEY}&viaList=${fromCoordinate[1]},${fromCoordinate[0]}:${toCoordinate[1]},${toCoordinate[0]}`
    )
    .then((res: any) => {
      const courses = res.data.ResultSet.Course;
      if (courses !== undefined) {
        const layers = courses.map((course: any, index: number) => {
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
                point.Station === undefined ? point.Name : point.Station.Name;
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
        return layers;
      }
    });
};
