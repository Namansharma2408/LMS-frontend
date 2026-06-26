import React from "react"
import { BarChart, Bar, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Badge, Panel, Table } from "../components/ui/primitives"
import type { Course } from "../../data/coursesData"

interface AdminDashboardProps {
  currentUser: any
  revenueStr: string
  usersListData: any[]
  revenueData: any[]
  dynamicStats: [string, string, string, string][]
  range: string
  setRange: (r: string) => void
  coursesList: Course[]
  formattedPurchases: string[][]
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  revenueStr,
  usersListData,
  revenueData,
  dynamicStats,
  range,
  setRange,
  coursesList,
  formattedPurchases,
}) => {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel className="overflow-hidden p-6 lg:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge>Live dashboard</Badge>
              <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] lg:text-6xl">
                Good morning, {currentUser?.name?.split(" ")[0] || "Admin"}. Platform is
                pacing ahead of target.
              </h1>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Monitor courses, payments, enrollments, and learner activity
                from one fast operational view.
              </p>
            </div>
            <div className="grid min-w-52 gap-3 rounded-3xl border border-border bg-secondary p-4">
              <span className="text-sm text-muted-foreground">
                Current revenue
              </span>
              <strong className="text-3xl">{revenueStr}</strong>
              <span className="text-sm text-[#22C55E]">
                +24.3% vs last month
              </span>
            </div>
          </div>
        </Panel>
        <Panel className="relative overflow-hidden p-6">
          <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
          <p className="text-sm text-muted-foreground">Total students</p>
          <h2 className="mt-2 text-5xl font-bold">
            {usersListData.filter((u) => u.role === "student").length}
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData}>
              <Bar dataKey="students" radius={[10, 10, 0, 0]} fill="#A855F7" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dynamicStats.map(([label, value, delta, color]) => (
          <Panel
            key={label}
            className="group p-5 transition hover:border-primary/40 hover:shadow-[0_0_34px_rgba(168,85,247,0.10)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className={`size-2 rounded-full ${color}`} />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <strong className="text-3xl font-bold">{value}</strong>
              <span className="text-sm text-muted-foreground">{delta}</span>
            </div>
          </Panel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Panel className="p-5 lg:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Revenue analytics</h2>
              <p className="text-sm text-muted-foreground">
                Daily sales and student acquisition
              </p>
            </div>
            <div className="flex rounded-2xl border border-border bg-secondary p-1">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-xl px-3 py-2 text-sm transition cursor-pointer ${
                    range === r ? "bg-card text-white font-semibold" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#262626" vertical={false} />
              <XAxis dataKey="day" stroke="#737373" tickLine={false} />
              <YAxis stroke="#737373" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid #262626",
                  borderRadius: 16,
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#A855F7"
                strokeWidth={3}
                fill="url(#rev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel className="p-5 lg:p-6">
          <h2 className="mb-5 text-xl font-bold">Top selling courses</h2>
          <div className="space-y-4">
            {coursesList.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-border bg-secondary p-3"
              >
                <div
                  className={`mb-4 h-24 rounded-2xl bg-linear-to-br ${c.gradient}`}
                />
                <h3 className="font-semibold text-sm">{c.name}</h3>
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>{c.revenue} revenue</span>
                  <span>{c.enrollments} enrollments</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="p-5 lg:p-6">
        <h2 className="mb-1 text-xl font-bold">Recent purchases</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Latest checkout activity across courses
        </p>
        <Table
          heads={["Student", "Course", "Amount", "Date", "Status"]}
          rows={formattedPurchases}
        />
      </Panel>
    </div>
  )
}
