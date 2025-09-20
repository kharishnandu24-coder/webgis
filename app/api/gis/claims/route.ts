import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const state = url.searchParams.get("state") || "MP"; // default: Madhya Pradesh
  const filePath = path.join(process.cwd(), "data", "boundaries", `${state}.csv`);

  try {
    const csvContent = fs.readFileSync(filePath, "utf-8");
    const records = parse(csvContent, { columns: true, skip_empty_lines: true });

    const features = records.map((row: any) => {
      let coords: any = [];
      try {
        // parse coordinates column (must be valid JSON array of [lng, lat])
        coords = JSON.parse(row.coordinates);
      } catch (e) {
        console.error("⚠️ Bad coordinates JSON in row:", row.id);
      }

      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coords,
        },
        properties: {
          id: row.id,
          type: row.type,
          shape: row.shapes,
          // add other columns from CSV if useful
          ...row,
        },
      };
    });

    // Return proper FeatureCollection
    return NextResponse.json({
      type: "FeatureCollection",
      features,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}