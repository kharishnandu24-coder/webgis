"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then(m => m.GeoJSON), { ssr: false });

export default function WebGISMap() {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetch("/api/gis/village-boundaries")
      .then((res) => res.json())
      .then((data) => setGeojsonData(data));
  }, []);

  useEffect(() => {
    if (geojsonData && mapRef.current) {
      const map = mapRef.current;
      const L = require("leaflet");
      const layer = L.geoJSON(geojsonData);
      map.fitBounds(layer.getBounds()); // ⬅️ auto-zoom to data
    }
  }, [geojsonData]);

  return (
    <MapContainer
      ref={mapRef}
      center={[23.25, 77.41]} // fallback center
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={() => ({ color: "purple", weight: 1, fillOpacity: 0 })}
          onEachFeature={(feature, layer) => {
            const props = feature.properties || {};
            layer.bindPopup(`<strong>${props.state}</strong> - ID: ${props.id}`);
          }}
        />
      )}
    </MapContainer>
  );
}