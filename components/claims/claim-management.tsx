"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import type { ClaimResponse } from "@/lib/api/types"

export function ClaimManagement() {
  const { user } = useAuth()
  const [claims, setClaims] = useState<ClaimResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")

  useEffect(() => {
    fetchClaims()
  }, [statusFilter, stateFilter])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (stateFilter !== "all") params.append("state", stateFilter)

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/claims?${params}`)
      // const data = await response.json()

      // Mock data for now
      const mockClaims: ClaimResponse[] = [
        {
          id: "1",
          applicationNumber: "FRA-2024-MP-001",
          claimType: "individual",
          claimantName: "Ramesh Kumar",
          claimantId: "AADHAAR-123456789012",
          village: "Bamhani",
          district: "Mandla",
          state: "Madhya Pradesh",
          area: 2.5,
          coordinates: [],
          description: "Individual forest rights claim",
          status: "pending",
          submissionDate: "2024-01-15T00:00:00Z",
          lastUpdated: "2024-03-01T00:00:00Z",
          documents: ["land_survey.pdf"],
          createdBy: "user-123",
        },
        {
          id: "2",
          applicationNumber: "FRA-2024-CG-045",
          claimType: "community",
          claimantName: "Khatiya Gram Sabha",
          claimantId: "GRAM-SABHA-456",
          village: "Khatiya",
          district: "Bastar",
          state: "Chhattisgarh",
          area: 15.0,
          coordinates: [],
          description: "Community forest rights",
          status: "approved",
          submissionDate: "2024-02-10T00:00:00Z",
          lastUpdated: "2024-02-28T00:00:00Z",
          documents: ["community_resolution.pdf"],
          createdBy: "user-456",
        },
      ]

      setClaims(mockClaims)
    } catch (error) {
      console.error("Failed to fetch claims:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      case "under_review":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Pending"
      case "rejected":
        return "Rejected"
      case "under_review":
        return "Under Review"
      default:
        return "Unknown"
    }
  }

  const filteredClaims = claims.filter(
    (claim) =>
      claim.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claim Management</h2>
          <p className="text-muted-foreground">Manage and track forest rights claims</p>
        </div>
        {(user?.role === "admin" || user?.role === "government") && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                <SelectItem value="Odisha">Odisha</SelectItem>
                <SelectItem value="Jharkhand">Jharkhand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Claims ({filteredClaims.length})</CardTitle>
          <CardDescription>List of all forest rights claims in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application No.</TableHead>
                  <TableHead>Claimant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-mono text-sm">{claim.applicationNumber}</TableCell>
                    <TableCell>{claim.claimantName}</TableCell>
                    <TableCell className="capitalize">{claim.claimType}</TableCell>
                    <TableCell>
                      {claim.village}, {claim.district}
                    </TableCell>
                    <TableCell>{claim.area} ha</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(claim.status)}>{getStatusText(claim.status)}</Badge>
                    </TableCell>
                    <TableCell>{new Date(claim.submissionDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(user?.role === "admin" || user?.role === "government") && (
                          <>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user?.role === "admin" && (
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
