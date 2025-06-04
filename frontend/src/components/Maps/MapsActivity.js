import React from 'react';
import { Map, Source, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapsActivity({ pointData }) {
  const filteredPointData = pointData.filter(
    point => point.longitude !== null && point.latitude !== null
  );

  if (filteredPointData.length === 0) {
    return <div>Aucune donnée GPS valide.</div>;
  }

  const coordinates = filteredPointData.map(point => [point.longitude, point.latitude]);

  const geojsonLine = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates
    },
    properties: {}
  };

  const firstPoint = filteredPointData[0];
  const geojsonFirstPoint = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [firstPoint.longitude, firstPoint.latitude]
        },
        properties: {}
      }
    ]
  };

  const lastPoint = filteredPointData[filteredPointData.length - 1];
  const geojsonLastPoint = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lastPoint.longitude, lastPoint.latitude]
        },
        properties: {}
      }
    ]
  };

  const lons = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);
  const minLng = Math.min(...lons);
  const maxLng = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return (
    <Map
      initialViewState={{
        bounds: [[minLng, minLat], [maxLng, maxLat]],
        fitBoundsOptions: { padding: 40, duration: 0 }
      }}
      style={{ width: '100%', height: 400 }}
      mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=s31HcHK9idJEb2zt9sdR"
    >
      {/* Ligne rouge */}
      <Source id="line-data" type="geojson" data={geojsonLine}>
        <Layer
          id="line-layer"
          type="line"
          paint={{
            'line-color': '#ff0000',
            'line-width': 3
          }}
        />
      </Source>

      <Source id="first-point" type="geojson" data={geojsonFirstPoint}>
        <Layer
          id="first-point-layer"
          type="circle"
          paint={{
            'circle-radius': 6,
            'circle-color': '#00ff00',
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1
          }}
        />
      </Source>

      <Source id="last-point" type="geojson" data={geojsonLastPoint}>
        <Layer
          id="last-point-layer"
          type="circle"
          paint={{
            'circle-radius': 6,
            'circle-color': '#ff0000',
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1
          }}
        />
      </Source>
    </Map>
  );
}
