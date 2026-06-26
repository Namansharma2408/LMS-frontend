import React from "react"
import { Star } from "lucide-react"
import { Badge, Button, Panel } from "../components/ui/primitives"
import type { Course } from "../../data/coursesData"

interface InstructorDashboardProps {
  currentUser: any
  coursesList: Course[]
  setActive: (a: string) => void
  setShowCreateCourseModal: (show: boolean) => void
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentUser,
  coursesList,
  setActive,
  setShowCreateCourseModal,
}) => {
  const instructorCourses = coursesList.filter(
    (c) => c.instructor === currentUser?.name,
  )
  const instructorStudents = instructorCourses.reduce(
    (sum, c) => sum + (parseInt(c.enrollments.replace(/,/g, "")) || 0),
    0,
  )
  const instructorRevenueVal = instructorCourses.reduce((sum, c) => {
    const revStr = String(c.revenue || "")
    const val = parseFloat(revStr.replace("$", "").replace("K", "")) || 0
    const isK = revStr.includes("K")
    return sum + (isK ? val * 1000 : val)
  }, 0)
  const instructorRevenueStr = `$${(instructorRevenueVal / 1000).toFixed(1)}K`

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel className="overflow-hidden p-6 lg:p-8 bg-linear-to-br from-primary/10 to-accent/5 border-primary/20">
          <div>
            <Badge>Instructor Dashboard</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] lg:text-6xl">
              Good morning, {currentUser?.name || "Instructor"}.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Manage your courses, interact with students, and track your
              content performance.
            </p>
          </div>
        </Panel>
        <Panel className="p-6 flex flex-col justify-between">
          <div>
            <span className="text-sm text-muted-foreground font-medium">
              Instructor Rating
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <strong className="text-5xl font-bold">4.9</strong>
              <span className="text-sm text-[#22C55E] font-medium">
                ★ Top 5%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on student reviews.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button kind="ghost">
              <Star size={14} className="text-[#EAB308]" /> View Reviews
            </Button>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [
            "My Published Courses",
            instructorCourses.length.toString(),
            "Active in library",
            "bg-primary",
          ],
          [
            "Total Students Enrolled",
            instructorStudents.toString(),
            "Registered",
            "bg-[#3B82F6]",
          ],
          [
            "Earning Revenue",
            instructorRevenueStr,
            "All time payouts",
            "bg-[#22C55E]",
          ],
        ].map(([label, value, delta, color]) => (
          <Panel key={label} className="p-5">
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

      <Panel className="p-5 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">My Courses</h2>
          <Button onClick={() => setShowCreateCourseModal(true)}>Create Course</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {instructorCourses.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 rounded-2xl border border-border bg-secondary p-3 cursor-pointer hover:border-primary/45 transition"
              onClick={() => setActive("Courses")}
            >
              <div
                className={`h-20 w-28 shrink-0 rounded-xl bg-linear-to-br ${c.gradient}`}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate text-sm">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.status}
                </p>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{c.enrollments} students</span>
                  <span>${c.price}</span>
                </div>
              </div>
            </div>
          ))}
          {instructorCourses.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 col-span-2 text-center">
              You have not created any courses yet. Click "Create Course" to start!
            </p>
          )}
        </div>
      </Panel>
    </div>
  )
}
