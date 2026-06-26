import React from "react"
import { Trophy } from "lucide-react"
import { Badge, Button, Panel } from "../components/ui/primitives"
import type { Course } from "../data/coursesData"

interface StudentDashboardProps {
  currentUser: any
  coursesList: Course[]
  purchasedCourseIds: string[]
  myProgress: any[]
  setActive: (a: string) => void
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  coursesList,
  purchasedCourseIds,
  myProgress,
  setActive,
}) => {
  const studentCompletedCertificates = myProgress.filter(
    (p) => p.certificateStatus === "Issued",
  ).length

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel className="overflow-hidden p-6 lg:p-8 bg-linear-to-br from-primary/10 to-accent/5 border-primary/20">
          <div>
            <Badge tone="blue">Student Dashboard</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] lg:text-6xl">
              Welcome back, {currentUser?.name || "Student"}.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Continue your learning path. Access your curriculum, review course
              notes, and watch lectures.
            </p>
          </div>
        </Panel>

        <Panel className="p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-4 top-4 text-primary opacity-20">
            <Trophy size={48} />
          </div>
          <div>
            <span className="text-sm text-muted-foreground font-medium">
              Study Streak
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <strong className="text-5xl font-bold">5</strong>
              <span className="text-sm text-primary font-medium">
                Days Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Maintain your daily streak to earn certificates.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Badge tone="green">Streak Active 🔥</Badge>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Enrolled Courses",
            purchasedCourseIds.length.toString(),
            "Active access",
            "bg-primary",
          ],
          [
            "Progress Tracks",
            `${myProgress.length} courses`,
            "Tracked in DB",
            "bg-[#3B82F6]",
          ],
          [
            "Certificates Earned",
            studentCompletedCertificates.toString(),
            "100% completed courses",
            "bg-[#EAB308]",
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

      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <Panel className="p-5 lg:p-6">
          <h2 className="mb-5 text-xl font-bold">My Enrolled Courses</h2>
          <div className="space-y-4">
            {coursesList
              .filter((c) => purchasedCourseIds.includes(c.id))
              .map((c) => {
                const progObj = myProgress.find((p) => p.courseId === c.id)
                const progressPercent = progObj
                  ? typeof progObj.progress === "string"
                    ? parseInt(progObj.progress.replace("%", "")) || 0
                    : Number(progObj.progress) || 0
                  : 0
                const certStatus = progObj
                  ? progObj.certificateStatus
                  : "Locked"

                return (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row gap-4 rounded-3xl border border-border bg-secondary p-4 justify-between items-start sm:items-center"
                  >
                    <div className="flex gap-4 min-w-0 flex-1">
                      <div
                        className={`h-16 w-24 shrink-0 rounded-2xl bg-linear-to-br ${c.gradient}`}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm text-white truncate">
                          {c.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Instructor: {c.instructor} · Certificate: {certStatus}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-24 bg-card rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {progressPercent}% complete
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setActive("Lectures")
                      }}
                      className="w-full sm:w-auto text-xs shrink-0 py-2"
                    >
                      Resume Learning
                    </Button>
                  </div>
                )
              })}
            {purchasedCourseIds.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  You are not enrolled in any courses yet. Go to the Courses tab
                  to enroll!
                </p>
                <Button onClick={() => setActive("Courses")} className="mt-4 text-xs">
                  Browse Courses
                </Button>
              </div>
            )}
          </div>
        </Panel>

        <Panel className="p-5 lg:p-6 flex flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl font-bold">Next Recommended Lesson</h2>
            <div className="rounded-2xl border border-border bg-secondary/50 p-4 space-y-3">
              <span className="text-[10px] font-mono font-bold text-primary uppercase">
                From Advanced React Systems
              </span>
              <h3 className="font-semibold text-sm">
                1.1 Platform Walkthrough & Features
              </h3>
              <p className="text-xs text-muted-foreground">
                In this overview, learn how to browse curriculum node trees of
                any depth.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              onClick={() => {
                setActive("Lectures")
              }}
              className="w-full justify-center"
            >
              Go to Class Player
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  )
}
