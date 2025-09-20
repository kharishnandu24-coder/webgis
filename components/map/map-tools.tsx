"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Ruler, Square, Circle, MapPin, Download, Upload, Filter } from "lucide-react"

export function MapTools() {
  const [activetool, setActiveTool] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTools, setActiveTools] = useState<string | null>(null) // Declare activeTools variable

  const tools = [
    { id: "search", name: "Search", icon: Search },
    { id: "measure", name: "Measure", icon: Ruler },
    { id: "draw-polygon", name: "Draw Polygon", icon: Square },
    { id: "draw-circle", name: "Draw Circle", icon: Circle },
    { id: "add-marker", name: "Add Marker", icon: MapPin },
    { id: "filter", name: "Filter", icon: Filter },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Map Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Location</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              placeholder="Search villages, forests, claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="space-y-2">
          <Label>Drawing Tools</Label>
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                size="sm"
                variant={activeTools === tool.id ? "default" : "outline"}
                onClick={() => setActiveTools(activeTools === tool.id ? null : tool.id)}
                className="justify-start"
              >
                <tool.icon className="h-4 w-4 mr-2" />
                {tool.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <Label>Filter Claims</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Claims</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export/Import */}
        <div className="space-y-2">
          <Label>Data Management</Label>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
