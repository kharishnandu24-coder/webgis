"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import L, { Map as LeafletMap, Icon } from "leaflet";

interface CensusRow {
  State: string;
  District_Code: string;
  Name: string;
  Households: string;
  Population_Persons: string;
  Population_Males: string;
  Population_Females: string;
  Area_sq_km: string;
  Population_density: string;
}

interface ForestRow {
  State: string;
  Total_Forest_Cover: string;
  Percentage_of_GA: string;
  Change_in_Forest_Cover: string;
}

interface WeatherData {
  state: string;
  lat: number;
  lon: number;
  temp: number;
  icon: string;
  description: string;
}

export default function MapClient() {
  const [geojson, setGeojson] = useState<any>(null);
  const [censusData, setCensusData] = useState<CensusRow[]>([]);
  const [forestData, setForestData] = useState<ForestRow[]>([]);
  const [stateFile, setStateFile] = useState("MadhyaPradesh.csv");
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [defaultStats, setDefaultStats] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  const geoRef = useRef<L.GeoJSON>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  // ✅ Your API Key
  const WEATHER_API_KEY = "68ae2bcb97d147f6946771a8d7ed8d7f";

  const stateMap: Record<string, string> = {
    "MadhyaPradesh.csv": "Madhya Pradesh",
    "Odisha.csv": "Odisha",
    "Telangana.csv": "Telangana",
    "Tripura.csv": "Tripura",
  };

  const stateCenters: Record<string, { center: [number, number]; zoom: number }> = {
    "MadhyaPradesh.csv": { center: [23.5, 78.5], zoom: 6 },
    "Odisha.csv": { center: [20.5, 84.4], zoom: 7 },
    "Telangana.csv": { center: [17.9, 79.6], zoom: 7 },
    "Tripura.csv": { center: [23.8, 91.3], zoom: 8 },
  };

  const dummyCensus: Record<string, any> = {
    Telangana: {
      Districts: 33,
      TotalHouseholds: 8000000,
      TotalPopulation: 35000000,
      TotalArea: 112077,
      Density: (35000000 / 112077).toFixed(2),
    },
    Tripura: {
      Districts: 8,
      TotalHouseholds: 900000,
      TotalPopulation: 3670000,
      TotalArea: 10491,
      Density: (3670000 / 10491).toFixed(2),
    },
  };

  const dummyForest: Record<string, any> = {
    Tripura: {
      State: "Tripura",
      Total_Forest_Cover: "7726",
      Percentage_of_GA: "73.64",
      Change_in_Forest_Cover: "+5",
    },
    Telangana: {
      State: "Telangana",
      Total_Forest_Cover: "27677",
      Percentage_of_GA: "24.0",
      Change_in_Forest_Cover: "+20",
    },
  };

  const normalize = (name: string) =>
    name?.replace(/\s+/g, "").toLowerCase().trim() || "";

  const stateAliases: Record<string, string> = {
    telengana: "telangana",
    teleangana: "telangana",
    odisa: "odisha",
    mp: "madhyapradesh",
    tripra: "tripura",
  };

  useEffect(() => {
    fetch("/data/Census_AllStates.csv")
      .then((r) => r.text())
      .then((text) => {
        const parsed = Papa.parse<CensusRow>(text, { header: true });
        setCensusData(parsed.data);
      });
  }, []);

  useEffect(() => {
    fetch("/data/forest_data.csv")
      .then((r) => r.text())
      .then((text) => {
        const parsed = Papa.parse<ForestRow>(text, { header: true });
        setForestData(parsed.data);
      });
  }, []);

  // ✅ Fetch weather data for all states (auto-refresh every 10 min)
  useEffect(() => {
    const fetchWeather = async () => {
      const results: WeatherData[] = [];
      for (const [file, info] of Object.entries(stateCenters)) {
        const stateName = stateMap[file];
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${info.center[0]}&lon=${info.center[1]}&appid=${WEATHER_API_KEY}&units=metric`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          results.push({
            state: stateName,
            lat: info.center[0],
            lon: info.center[1],
            temp: data.main?.temp || 0,
            icon: data.weather?.[0]?.icon || "01d",
            description: data.weather?.[0]?.description || "N/A",
          });
        } catch (err) {
          console.error("Weather fetch failed for", stateName, err);
        }
      }
      setWeatherData(results);
    };

    fetchWeather(); // initial load
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // every 10 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadOneState = async (file: string) => {
      const text = await fetch(`/data/${file}`).then((r) => r.text());
      const parsed = Papa.parse(text, { header: true });

      const features = parsed.data
        .map((row: any) => {
          if (!row.shapes) return null;
          try {
            const geom = JSON.parse(row.shapes.replace(/'/g, '"'));
            if (!geom.type || !geom.coordinates) return null;
            if (typeof geom.coordinates === "string") {
              geom.coordinates = JSON.parse(geom.coordinates);
            }
            return {
              type: "Feature",
              geometry: geom,
              properties: {
                vill_2011_id: row.vill_2011_id,
                vill_2001_id: row.vill_2001_id,
                District_Code: row.District_Code,
              },
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      return features;
    };

    const loadData = async () => {
      const features = await loadOneState(stateFile);
      setGeojson({
        type: "FeatureCollection",
        features,
      });
      setSelectedFeature(null);

      const stateCenter = stateCenters[stateFile];
      if (mapRef.current && stateCenter) {
        mapRef.current.flyTo(stateCenter.center, stateCenter.zoom);
      }
    };

    loadData();
  }, [stateFile]);

  useEffect(() => {
    if (censusData.length === 0 && forestData.length === 0) return;

    const stateName = stateMap[stateFile];
    const normState = normalize(stateName);

    const rows = censusData.filter((c) => {
      const normC = normalize(c.State);
      return normC === normState || stateAliases[normC] === normState;
    });

    let forestRow = forestData.find((f) => {
      const normF = normalize(f.State);
      return normF === normState || stateAliases[normF] === normState;
    });

    if (!forestRow && dummyForest[stateName]) {
      forestRow = dummyForest[stateName];
    }

    if (rows.length > 0) {
      const totalHouseholds = rows.reduce(
        (sum, r) => sum + (parseInt(r.Households) || 0),
        0
      );
      const totalPop = rows.reduce(
        (sum, r) => sum + (parseInt(r.Population_Persons) || 0),
        0
      );
      const totalArea = rows.reduce(
        (sum, r) => sum + (parseFloat(r.Area_sq_km) || 0),
        0
      );

      setDefaultStats({
        State: stateName,
        Districts: rows.length,
        TotalHouseholds: totalHouseholds,
        TotalPopulation: totalPop,
        TotalArea: totalArea,
        Density: totalArea > 0 ? (totalPop / totalArea).toFixed(2) : "NA",
        forest: forestRow,
      });
    } else {
      const dummy = dummyCensus[stateName];
      setDefaultStats({
        State: stateName,
        ...(dummy
          ? { ...dummy, note: "⚠️ Dummy census data used" }
          : { error: "⚠️ No census data found!" }),
        forest: forestRow,
      });
    }
  }, [censusData, forestData, stateFile]);

  const styleVillage = {
    color: "#3388ff",
    weight: 1,
    fillOpacity: 0.4,
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on("click", () => {
      if (!feature?.properties?.District_Code) return;
      const censusRow = censusData.find(
        (c) =>
          String(c.District_Code).padStart(3, "0") ===
          String(feature.properties.District_Code).padStart(3, "0")
      );
      setSelectedFeature({
        ...feature.properties,
        census: censusRow,
      });
    });
  };

  const weatherIcon = (icon: string) =>
    new Icon({
      iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
      iconSize: [50, 50],
    });

  return (
    <div className="flex">
      <div className="w-3/4 h-screen relative">
        {/* Dropdown */}
        <div className="absolute top-2 left-2 z-[1000] bg-white p-2 shadow rounded">
          <select
            value={stateFile}
            onChange={(e) => setStateFile(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="MadhyaPradesh.csv">Madhya Pradesh</option>
            <option value="Odisha.csv">Odisha</option>
            <option value="Telangana.csv">Telangana</option>
            <option value="Tripura.csv">Tripura</option>
          </select>
        </div>

        <MapContainer
          center={[23.5, 85]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Normal">
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>

            {/* Weather Overlays */}
            <LayersControl.Overlay checked name="Weather (Clouds)">
              <TileLayer
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Weather (Precipitation)">
              <TileLayer
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Weather (Temperature)">
              <TileLayer
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`}
              />
            </LayersControl.Overlay>
          </LayersControl>

          {geojson && (
            <GeoJSON
              data={geojson}
              style={styleVillage}
              onEachFeature={onEachFeature}
              ref={geoRef as any}
            />
          )}

          {/* Weather Markers */}
          {weatherData.map((w) => (
            <Marker
              key={w.state}
              position={[w.lat, w.lon]}
              icon={weatherIcon(w.icon)}
            >
              <Popup>
                <strong>{w.state}</strong> <br />
                🌡 Temp: {w.temp} °C <br />
                ☁️ {w.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="w-1/4 h-screen overflow-y-auto p-4 bg-gray-50 border-l">
        <h2 className="text-lg font-bold mb-2">State Details</h2>

        {defaultStats && !selectedFeature && (
          <div>
            <h3 className="font-semibold mb-2">{defaultStats.State} Summary</h3>

            {defaultStats.error ? (
              <p className="text-red-500">{defaultStats.error}</p>
            ) : (
              <>
                {defaultStats.note && (
                  <p className="text-yellow-600 italic">{defaultStats.note}</p>
                )}
                <p><strong>Districts:</strong> {defaultStats.Districts}</p>
                <p><strong>Total Households:</strong> {defaultStats.TotalHouseholds}</p>
                <p><strong>Total Population:</strong> {defaultStats.TotalPopulation}</p>
                <p><strong>Total Area (sq km):</strong> {defaultStats.TotalArea}</p>
                <p><strong>Density:</strong> {defaultStats.Density}</p>
              </>
            )}

            {defaultStats.forest && (
              <div className="mt-4 border-t pt-2">
                <h4 className="font-semibold">Forest Data</h4>
                <p><strong>Total Forest Cover:</strong> {defaultStats.forest.Total_Forest_Cover} sq km</p>
                <p><strong>% of Geographical Area:</strong> {defaultStats.forest.Percentage_of_GA}%</p>
                <p><strong>Change in Forest Cover:</strong> {defaultStats.forest.Change_in_Forest_Cover} sq km</p>
              </div>
            )}
          </div>
        )}

        {selectedFeature?.census && (
          <div>
            <h3 className="font-semibold mb-2">
              District: {selectedFeature.census.Name}
            </h3>
            <p><strong>Households:</strong> {selectedFeature.census.Households}</p>
            <p><strong>Population:</strong> {selectedFeature.census.Population_Persons}</p>
            <p><strong>Males:</strong> {selectedFeature.census.Population_Males}</p>
            <p><strong>Females:</strong> {selectedFeature.census.Population_Females}</p>
            <p><strong>Area (sq km):</strong> {selectedFeature.census.Area_sq_km}</p>
            <p><strong>Density:</strong> {selectedFeature.census.Population_density}</p>
            <button
              className="mt-3 px-3 py-1 bg-gray-200 rounded"
              onClick={() => setSelectedFeature(null)}
            >
              Back to Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}