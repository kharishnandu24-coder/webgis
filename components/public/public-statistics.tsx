"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Trees, Users, FileText, TrendingUp } from "lucide-react"

// Mock public statistics data
const publicStats = {
  totalClaims: 1247,
  approvedClaims: 789,
  pendingClaims: 342,
  totalVillages: 156,
  participatingVillages: 98,
  forestAreaClaimed: 12345, // hectares
  totalForestArea: 45678, // hectares
  avgProcessingDays: 45,
}

const stateWiseData = [
  { state: "Madhya Pradesh", claims: 234, approved: 156 },
  { state: "Chhattisgarh", claims: 189, approved: 134 },
  { state: "Odisha", claims: 167, approved: 98 },
  { state: "Jharkhand", claims: 145, approved: 87 },
  { state: "Maharashtra", claims: 123, approved: 76 },
  { state: "Others", claims: 389, approved: 238 },
]

const claimTypeDistribution = [
  { name: "Individual Forest Rights", value: 456, color: "#3b82f6" },
  { name: "Community Forest Rights", value: 234, color: "#22c55e" },
  { name: "Traditional Rights", value: 189, color: "#f59e0b" },
  { name: "Habitat Rights", value: 123, color: "#ef4444" },
]

const chartConfig = {
  claims: {
    label: "Total Claims",
    color: "hsl(var(--chart-1))",
  },
  approved: {
    label: "Approved Claims",
    color: "hsl(var(--chart-2))",
  },
}

export function PublicStatistics() {
  const approvalRate = ((publicStats.approvedClaims / publicStats.totalClaims) * 100).toFixed(1)
  const villageParticipation = ((publicStats.participatingVillages / publicStats.totalVillages) * 100).toFixed(1)
  const forestCoverage = ((publicStats.forestAreaClaimed / publicStats.totalForestArea) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Key Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicStats.totalClaims.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all participating states</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvalRate}%</div>
            <Progress value={Number.parseFloat(approvalRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Villages Participating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicStats.participatingVillages}</div>
            <p className="text-xs text-muted-foreground">{villageParticipation}% of eligible villages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forest Area Under Claims</CardTitle>
            <Trees className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publicStats.forestAreaClaimed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">hectares ({forestCoverage}% of total)</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* State-wise Claims */}
        <Card>
          <CardHeader>
            <CardTitle>State-wise Claims Distribution</CardTitle>
            <CardDescription>Claims submitted and approved by state</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateWiseData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="state" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="claims" fill="var(--color-claims)" />
                  <Bar dataKey="approved" fill="var(--color-approved)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Claim Types */}
        <Card>
          <CardHeader>
            <CardTitle>Claim Types Distribution</CardTitle>
            <CardDescription>Breakdown of claims by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={claimTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {claimTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.value} claims</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {claimTypeDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processing Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Processing Time</span>
              <Badge variant="secondary">{publicStats.avgProcessingDays} days</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Claims Pending Review</span>
              <Badge variant="outline">{publicStats.pendingClaims}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Monthly Completion Rate</span>
              <Badge className="bg-green-500">87%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geographic Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">States Participating</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Districts Covered</span>
              <Badge variant="outline">89</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Forest Divisions</span>
              <Badge className="bg-green-500">156</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Impact Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Families Benefited</span>
              <Badge variant="secondary">15,678</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Livelihood Secured</span>
              <Badge variant="outline">89%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Forest Conservation</span>
              <Badge className="bg-green-500">92%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
