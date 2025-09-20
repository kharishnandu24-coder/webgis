"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: "claim_submitted" | "claim_approved" | "claim_rejected" | "user_registered" | "document_uploaded"
  title: string
  description: string
  user: string
  timestamp: Date
  status?: "success" | "warning" | "error"
}

// Mock activity data
const recentActivities: Activity[] = [
  {
    id: "1",
    type: "claim_submitted",
    title: "New Individual Forest Rights Claim",
    description: "Ramesh Kumar submitted a claim for 2.5 hectares in Bamhani Village",
    user: "Ramesh Kumar",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "success",
  },
  {
    id: "2",
    type: "claim_approved",
    title: "Community Forest Rights Approved",
    description: "Khatiya Gram Sabha's claim for 15 hectares has been approved",
    user: "Forest Officer",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: "success",
  },
  {
    id: "3",
    type: "document_uploaded",
    title: "Supporting Documents Added",
    description: "Land survey documents uploaded for claim ID #FRA-2024-0156",
    user: "Priya Sharma",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: "4",
    type: "user_registered",
    title: "New NGO Representative Registered",
    description: "Wildlife Conservation Trust representative joined the system",
    user: "System",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "5",
    type: "claim_rejected",
    title: "Claim Rejected - Insufficient Documentation",
    description: "Individual claim in Satpura region rejected due to missing land records",
    user: "Review Committee",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: "error",
  },
]

export function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "claim_submitted":
        return "📝"
      case "claim_approved":
        return "✅"
      case "claim_rejected":
        return "❌"
      case "user_registered":
        return "👤"
      case "document_uploaded":
        return "📎"
      default:
        return "📋"
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and actions in the FRA system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{getActivityIcon(activity.type)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.status && <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>by {activity.user}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
