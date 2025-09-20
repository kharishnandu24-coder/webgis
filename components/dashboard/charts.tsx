"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock chart data
const monthlyClaimsData = [
  { month: "Jan", submitted: 65, approved: 45, rejected: 8 },
  { month: "Feb", submitted: 78, approved: 52, rejected: 12 },
  { month: "Mar", submitted: 89, approved: 61, rejected: 15 },
  { month: "Apr", submitted: 95, approved: 68, rejected: 18 },
  { month: "May", submitted: 102, approved: 74, rejected: 16 },
  { month: "Jun", submitted: 89, approved: 65, rejected: 14 },
]

const claimTypeData = [
  { name: "Individual Forest Rights", value: 456, color: "#3b82f6" },
  { name: "Community Forest Rights", value: 234, color: "#22c55e" },
  { name: "Traditional Rights", value: 189, color: "#f59e0b" },
  { name: "Habitat Rights", value: 123, color: "#ef4444" },
]

const processingTimeData = [
  { stage: "Submission", avgDays: 1 },
  { stage: "Initial Review", avgDays: 15 },
  { stage: "Field Verification", avgDays: 25 },
  { stage: "Committee Review", avgDays: 18 },
  { stage: "Final Approval", avgDays: 12 },
]

const chartConfig = {
  submitted: {
    label: "Submitted",
    color: "hsl(var(--chart-1))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  },
}

export function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Monthly Claims Trend */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Claims Trend</CardTitle>
          <CardDescription>Claims submitted, approved, and rejected over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyClaimsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="submitted" fill="var(--color-submitted)" />
                <Bar dataKey="approved" fill="var(--color-approved)" />
                <Bar dataKey="rejected" fill="var(--color-rejected)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Claim Types Distribution */}
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
                  data={claimTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimTypeData.map((entry, index) => (
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
            {claimTypeData.map((item, index) => (
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

      {/* Processing Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Average Processing Time</CardTitle>
          <CardDescription>Time spent at each stage of claim processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground">{payload[0].value} days average</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line type="monotone" dataKey="avgDays" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
