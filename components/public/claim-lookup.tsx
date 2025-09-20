"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, FileText, Calendar, MapPin } from "lucide-react"

interface ClaimResult {
  id: string
  applicationNumber: string
  claimType: string
  status: "pending" | "approved" | "rejected" | "under_review"
  submissionDate: string
  lastUpdated: string
  village: string
  district: string
  state: string
  area: string
}

// Mock claim data for demonstration
const mockClaims: ClaimResult[] = [
  {
    id: "1",
    applicationNumber: "FRA-2024-MP-001",
    claimType: "Individual Forest Rights",
    status: "approved",
    submissionDate: "2024-01-15",
    lastUpdated: "2024-02-28",
    village: "Bamhani",
    district: "Mandla",
    state: "Madhya Pradesh",
    area: "2.5 hectares",
  },
  {
    id: "2",
    applicationNumber: "FRA-2024-CG-045",
    claimType: "Community Forest Rights",
    status: "pending",
    submissionDate: "2024-02-10",
    lastUpdated: "2024-03-01",
    village: "Khatiya",
    district: "Bastar",
    state: "Chhattisgarh",
    area: "15 hectares",
  },
]

export function ClaimLookup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<ClaimResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a claim ID or application number")
      return
    }

    setIsSearching(true)
    setError("")
    setSearchResult(null)

    // Simulate API call
    setTimeout(() => {
      const result = mockClaims.find(
        (claim) =>
          claim.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          claim.id === searchQuery.toLowerCase(),
      )

      if (result) {
        setSearchResult(result)
      } else {
        setError("No claim found with the provided ID or application number")
      }
      setIsSearching(false)
    }, 1000)
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
        return "Pending Review"
      case "rejected":
        return "Rejected"
      case "under_review":
        return "Under Review"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Claim Status Lookup
          </CardTitle>
          <CardDescription>
            Enter your claim ID or application number to check the current status of your forest rights claim.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Claim ID or Application Number</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="e.g., FRA-2024-MP-001"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Search Result */}
      {searchResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Claim Details
              </span>
              <Badge className={getStatusColor(searchResult.status)}>{getStatusText(searchResult.status)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Application Number</Label>
                  <p className="font-mono text-sm">{searchResult.applicationNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Claim Type</Label>
                  <p>{searchResult.claimType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Area</Label>
                  <p>{searchResult.area}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {searchResult.village}, {searchResult.district}, {searchResult.state}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submission Date</Label>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{new Date(searchResult.submissionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p>{new Date(searchResult.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Status Information</h4>
              {searchResult.status === "approved" && (
                <Alert>
                  <AlertDescription>
                    Your forest rights claim has been approved. You should receive official documentation shortly.
                  </AlertDescription>
                </Alert>
              )}
              {searchResult.status === "pending" && (
                <Alert>
                  <AlertDescription>
                    Your claim is currently pending review. The review process typically takes 30-45 days.
                  </AlertDescription>
                </Alert>
              )}
              {searchResult.status === "under_review" && (
                <Alert>
                  <AlertDescription>
                    Your claim is currently under review by the Forest Rights Committee. You may be contacted for
                    additional information.
                  </AlertDescription>
                </Alert>
              )}
              {searchResult.status === "rejected" && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Your claim has been rejected. Please contact the local Forest Rights Committee for more information
                    about the appeals process.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            If you cannot find your claim or need assistance, please contact your local Forest Rights Committee or use
            the following resources:
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Contact your Village Forest Rights Committee</li>
            <li>• Visit the nearest Forest Department office</li>
            <li>• Call the FRA helpline: 1800-XXX-XXXX</li>
            <li>• Email: support@fra-atlas.gov.in</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
