"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MapLayer } from "@/lib/types/gis"

interface LayerLegendProps {
  layers: MapLayer[]
}

export function LayerLegend({ layers }: LayerLegendProps) {
  const visibleLayers = layers.filter((layer) => layer.visible)

  if (visibleLayers.length === 0) {
    return null
  }

  return (
    <Card className="absolute bottom-4 right-4 w-64 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Map Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleLayers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{
                  backgroundColor: layer.color,
                  opacity: layer.opacity,
                }}
              />
              <span className="text-sm font-medium">{layer.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {layer.features.length}
            </Badge>
          </div>
        ))}

        {/* Status Legend for Claims */}
        {visibleLayers.some((l) => l.type === "claim") && (
          <div className="pt-2 border-t">
            <div className="text-xs font-medium mb-2">Claim Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs">Rejected</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
