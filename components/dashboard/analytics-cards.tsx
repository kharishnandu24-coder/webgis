"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, FileText, Users, Trees, Clock, CheckCircle } from "lucide-react"

// Mock analytics data
const analyticsData = {
  totalClaims: 1247,
  claimsGrowth: 12.5,
  pendingClaims: 342,
  approvedClaims: 789,
  rejectedClaims: 116,
  totalVillages: 156,
  villagesWithClaims: 98,
  forestArea: 45678, // in hectares
  claimedArea: 12345, // in hectares
  avgProcessingTime: 45, // in days
  monthlySubmissions: 89,
  submissionsGrowth: -5.2,
}

export function AnalyticsCards() {
  const approvalRate = ((analyticsData.approvedClaims / analyticsData.totalClaims) * 100).toFixed(1)
  const villageParticipation = ((analyticsData.villagesWithClaims / analyticsData.totalVillages) * 100).toFixed(1)
  const forestCoverage = ((analyticsData.claimedArea / analyticsData.forestArea) * 100).toFixed(1)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Claims */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsData.totalClaims.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{analyticsData.claimsGrowth}% from last month
          </div>
        </CardContent>
      </Card>

      {/* Pending Claims */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{analyticsData.pendingClaims}</div>
          <div className="text-xs text-muted-foreground">Avg. processing: {analyticsData.avgProcessingTime} days</div>
        </CardContent>
      </Card>

      {/* Approval Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{approvalRate}%</div>
          <Progress value={Number.parseFloat(approvalRate)} className="mt-2" />
        </CardContent>
      </Card>

      {/* Monthly Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Submissions</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsData.monthlySubmissions}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            {analyticsData.submissionsGrowth}% from last month
          </div>
        </CardContent>
      </Card>

      {/* Village Participation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Village Participation</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{villageParticipation}%</div>
          <div className="text-xs text-muted-foreground">
            {analyticsData.villagesWithClaims} of {analyticsData.totalVillages} villages
          </div>
        </CardContent>
      </Card>

      {/* Forest Coverage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Forest Area Under Claims</CardTitle>
          <Trees className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{forestCoverage}%</div>
          <div className="text-xs text-muted-foreground">
            {analyticsData.claimedArea.toLocaleString()} of {analyticsData.forestArea.toLocaleString()} hectares
          </div>
        </CardContent>
      </Card>

      {/* Claim Status Distribution */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Claim Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500">Approved</Badge>
              <span className="text-sm">{analyticsData.approvedClaims}</span>
            </div>
            <span className="text-sm text-muted-foreground">{approvalRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-500">Pending</Badge>
              <span className="text-sm">{analyticsData.pendingClaims}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {((analyticsData.pendingClaims / analyticsData.totalClaims) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-500">Rejected</Badge>
              <span className="text-sm">{analyticsData.rejectedClaims}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {((analyticsData.rejectedClaims / analyticsData.totalClaims) * 100).toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
