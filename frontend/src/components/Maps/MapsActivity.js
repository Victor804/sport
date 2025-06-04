import React from 'react';
import { Map, Source, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapsActivity({ pointData }) {
  const filteredPointData = pointData.filter(
    point => point.longitude !== null && point.latitude !== null
  );

  if (filteredPointData.length === 0) {
    return <div></div>;
  }

  const coordinates = filteredPointData.map(point => [point.longitude, point.latitude]);

  // Calcul de la bounding box
  const lons = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);
  const minLng = Math.min(...lons);
  const maxLng = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates
    },
    properties: {}
  };

  return (
    <Map
      initialViewState={{
        bounds: [[minLng, minLat], [maxLng, maxLat]],
        fitBoundsOptions: { padding: 40, duration: 0 }
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
