// WebMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import GeoJSON for the four states
import telanganaGeo from '../public/data/telangana.geojson';
import odishaGeo from '../public/data/odisha.geojson';
import tripuraGeo from '../public/data/tripura.geojson';
import mpGeo from '../public/data/madhyaPradesh.geojson';

// Import your dynamic layers
import fraClaims from '../public/data/fraClaims.geojson';
import villages from '../public/data/villages.geojson';
import forestBoundaries from '../public/data/forestBoundaries.geojson';

// Fit map to bounds component
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
};

// Add popups for each feature
const onEachFeatureWithPopup = (feature, layer) => {
  if (feature.properties) {
    let popupContent = "";
    if (feature.properties.name) popupContent += `<strong>${feature.properties.name}</strong><br/>`;
    if (feature.properties.type) popupContent += `Type: ${feature.properties.type}<br/>`;
    if (feature.properties.population) popupContent += `Population: ${feature.properties.population}<br/>`;
    if (popupContent) layer.bindPopup(popupContent);
  }
};

const WebMap = () => {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    // Compute bounding box for all four states
    const allCoords = [
      ...telanganaGeo.features.flatMap(f => f.geometry.coordinates.flat(2)),
      ...odishaGeo.features.flatMap(f => f.geometry.coordinates.flat(2)),
      ...tripuraGeo.features.flatMap(f => f.geometry.coordinates.flat(2)),
      ...mpGeo.features.flatMap(f => f.geometry.coordinates.flat(2)),
    ];

    const lats = allCoords.map(c => c[1]);
    const lngs = allCoords.map(c => c[0]);

    const southWest = [Math.min(...lats), Math.min(...lngs)];
    const northEast = [Math.max(...lats), Math.max(...lngs)];

    setBounds([southWest, northEast]);
  }, []);

  return (
    <MapContainer style={{ height: '100vh', width: '100%' }} zoomControl={false}>
      <ZoomControl position="topright" />

      {/* Google Maps tiles */}
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={['mt0','mt1','mt2','mt3']}
        attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
      />

      {bounds && <FitBounds bounds={bounds} />}

      <LayersControl position="topright">
        {/* States */}
        <LayersControl.Overlay name="Telangana">
          <GeoJSON
            data={telanganaGeo}
            style={{ color: 'red', weight: 2, fillOpacity: 0.1 }}
            onEachFeature={onEachFeatureWithPopup}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Odisha">
          <GeoJSON
            data={odishaGeo}
            style={{ color: 'blue', weight: 2, fillOpacity: 0.1 }}
            onEachFeature={onEachFeatureWithPopup}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Tripura">
          <GeoJSON
            data={tripuraGeo}
            style={{ color: 'green', weight: 2, fillOpacity: 0.1 }}
            onEachFeature={onEachFeatureWithPopup}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Madhya Pradesh">
          <GeoJSON
            data={mpGeo}
            style={{ color: 'purple', weight: 2, fillOpacity: 0.1 }}
            onEachFeature={onEachFeatureWithPopup}
          />
        </LayersControl.Overlay>

        {/* Dynamic layers */}
        <LayersControl.Overlay name="FRA Claims">
          <GeoJSON data={fraClaims} style={{ color: 'orange' }} onEachFeature={onEachFeatureWithPopup} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Villages">
          <GeoJSON data={villages} style={{ color: 'brown' }} onEachFeature={onEachFeatureWithPopup} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Forest Boundaries">
          <GeoJSON data={forestBoundaries} style={{ color: 'darkgreen' }} onEachFeature={onEachFeatureWithPopup} />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default WebMap;