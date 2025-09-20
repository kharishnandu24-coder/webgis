import { AuthGuard } from "@/lib/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { InsightsDashboard } from "@/components/ai/insights-dashboard"

export default function AIInsightsPage() {
  return (
    <AuthGuard requiredRoles={["admin", "government"]}>
      <DashboardLayout>
        <div className="p-6">
          <InsightsDashboard />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
