import { AuthGuard } from "@/lib/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardCharts } from "@/components/dashboard/charts"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function AnalyticsPage() {
  return (
    <AuthGuard requiredRoles={["admin", "government"]}>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights for Forest Rights Act claim management
            </p>
          </div>

          {/* Key Metrics */}
          <AnalyticsCards />

          {/* Charts and Visualizations */}
          <DashboardCharts />

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <RecentActivity />
            </div>
            <div className="space-y-4">{/* Additional analytics widgets can go here */}</div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
