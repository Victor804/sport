import React from 'react';
import { Map, Source, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapsActivity({ pointData }) {
  const filteredPointData = pointData.filter(point =>
    point.longitude !== null && point.latitude !== null
  );

  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: filteredPointData.map(point => [point.longitude, point.latitude])
    },
    properties: {}
  };

  console.log(geojson)
  return (
    <Map
      initialViewState={{
        longitude: filteredPointData[0].longitude,
        latitude: filteredPointData[0].latitude,
        zoom: 15 //TODO: MAKE AN ADAPTATIVE ZOOM
      }}
      style={{ width: '100%', height: 400 }}
      mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=s31HcHK9idJEb2zt9sdR"
    >
      <Source id="line-data" type="geojson" data={geojson}>
        <Layer
          id="line-layer"
          type="line"
          source="line-data"
          paint={{
            'line-color': '#ff0000',
            'line-width': 3
          }}
        />
      </Source>
    </Map>
  );
}
