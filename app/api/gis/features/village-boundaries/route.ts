import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const STATES = ["Bihar", "Madhya Pradesh", "Odisha"];

function loadCsvAsGeoJSON(state: string) {
  const filePath = path.join(process.cwd(), "data", "boundaries", `${state}.csv`);
  if (!fs.existsSync(filePath)) return [];

  const csvContent = fs.readFileSync(filePath, "utf-8");
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  return records.map((row: any) => {
    let coords: any = [];
    try {
      coords = JSON.parse(row.coordinates); // parse GeoJSON-like string
    } catch (e) {
      console.error(`Bad coordinates JSON in ${state} row ${row.id}`);
    }

    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: coords,
      },
      properties: {
        id: row.id,
        state,
        shapes: row.shapes,
        type: row.type,
      },
    };
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");

  try {
    let features: any[] = [];

    if (state) {
      // Single state
      features = loadCsvAsGeoJSON(state);
    } else {
      // All states
      STATES.forEach((s) => {
        features.push(...loadCsvAsGeoJSON(s));
      });
    }

    return Response.json({
      type: "FeatureCollection",
      features,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}