"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Bell, RefreshCw } from "lucide-react"
import type { AIInsight } from "@/lib/ai/decision-support"
import { generateAIInsights } from "@/lib/ai/decision-support"

export function InsightsDashboard() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const newInsights = await generateAIInsights()
      setInsights(newInsights)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-4 w-4" />
      case "anomaly":
        return <AlertTriangle className="h-4 w-4" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4" />
      case "alert":
        return <Bell className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "trend":
        return "border-blue-200 bg-blue-50"
      case "anomaly":
        return "border-red-200 bg-red-50"
      case "recommendation":
        return "border-green-200 bg-green-50"
      case "alert":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Insights Dashboard
          </h2>
          <p className="text-muted-foreground">Intelligent insights and recommendations powered by AI analysis</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          <Button onClick={fetchInsights} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Insights Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </div>
                  <Badge className={getSeverityColor(insight.severity)} size="sm">
                    {insight.severity.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription>{insight.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {insight.data && (
                  <div className="space-y-2 mb-4">
                    {Object.entries(insight.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key.replace("_", " ")}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {insight.actionable && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">Take Action</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Insights Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {insights.filter((i) => i.type === "trend").length}
              </div>
              <div className="text-sm text-muted-foreground">Trends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {insights.filter((i) => i.type === "anomaly").length}
              </div>
              <div className="text-sm text-muted-foreground">Anomalies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {insights.filter((i) => i.type === "recommendation").length}
              </div>
              <div className="text-sm text-muted-foreground">Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {insights.filter((i) => i.type === "alert").length}
              </div>
              <div className="text-sm text-muted-foreground">Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI System Performance</CardTitle>
          <CardDescription>Current status and performance metrics of AI decision support system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-muted-foreground">Claims Analyzed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">2.3s</div>
              <div className="text-sm text-muted-foreground">Avg. Analysis Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
