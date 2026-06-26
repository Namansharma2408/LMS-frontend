import React from "react"
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Panel, Header } from "../components/ui/primitives"

interface AnalyticsPageProps {
  analyticsTab: string
  setAnalyticsTab: (tab: string) => void
  revenueData: any[]
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  analyticsTab,
  setAnalyticsTab,
  revenueData,
}) => {
  return (
    <>
      <Header
        title="Analytics"
        text="Business intelligence across revenue, users, courses, payments, and coupons."
      />
      <Panel className="p-5">
        <div className="mb-6 flex flex-wrap gap-2">
          {["Revenue", "Users", "Courses", "Payments", "Coupons"].map(
            (x) => (
              <button
                key={x}
                onClick={() => setAnalyticsTab(x)}
                className={`rounded-2xl px-4 py-2 text-sm transition cursor-pointer font-semibold ${
                  analyticsTab === x
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:text-white"
                }`}
              >
                {x}
              </button>
            ),
          )}
        </div>
        <ResponsiveContainer width="100%" height={390}>
          <AreaChart data={revenueData}>
            <CartesianGrid stroke="#262626" vertical={false} />
            <XAxis dataKey="day" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid #262626",
                borderRadius: 16,
                color: "#fff",
              }}
            />
            {analyticsTab === "Revenue" && (
              <Area
                dataKey="revenue"
                name="Revenue ($)"
                stroke="#A855F7"
                fill="#A855F733"
                strokeWidth={3}
              />
            )}
            {analyticsTab === "Users" && (
              <Area
                dataKey="users"
                name="New Users"
                stroke="#3B82F6"
                fill="#3B82F622"
                strokeWidth={3}
              />
            )}
            {analyticsTab === "Courses" && (
              <Area
                dataKey="courses"
                name="Courses Created"
                stroke="#10B981"
                fill="#10B98122"
                strokeWidth={3}
              />
            )}
            {analyticsTab === "Payments" && (
              <Area
                dataKey="payments"
                name="Payments Processed"
                stroke="#F59E0B"
                fill="#F59E0B22"
                strokeWidth={3}
              />
            )}
            {analyticsTab === "Coupons" && (
              <Area
                dataKey="coupons"
                name="Coupons Active/Used"
                stroke="#EF4444"
                fill="#EF444422"
                strokeWidth={3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Panel>
    </>
  )
}
