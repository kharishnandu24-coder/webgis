import { AuthGuard } from "@/lib/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ClaimManagement } from "@/components/claims/claim-management"

export default function ClaimsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="p-6">
          <ClaimManagement />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
