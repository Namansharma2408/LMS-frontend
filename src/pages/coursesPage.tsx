import React from "react"
import { Plus, FileUp, SlidersHorizontal, BookOpen, Star } from "lucide-react"
import { Badge, Button, Panel, Header } from "../components/ui/primitives"
import { CustomPagination } from "../components/ui/CustomPagination"
import CourseDetailPage from "./courseDetail"
import type { Course } from "../data/coursesData"

interface CoursesPageProps {
  coursesList: Course[]
  coursesSubTab: "all" | "my"
  setCoursesSubTab: (tab: "all" | "my") => void
  purchasedCourseIds: string[]
  activeRole: string
  coursePage: number
  setCoursePage: (p: number) => void
  setSelectedCourseDetailId: (id: string | null) => void
  handleBuyCourseClick: (c: Course) => void
  setActive: (a: string) => void
  setShowCreateCourseModal: (show: boolean) => void
  selectedCourseDetailId: string | null
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  coursesList,
  coursesSubTab,
  setCoursesSubTab,
  purchasedCourseIds,
  activeRole,
  coursePage,
  setCoursePage,
  setSelectedCourseDetailId,
  handleBuyCourseClick,
  setActive,
  setShowCreateCourseModal,
  selectedCourseDetailId,
}) => {
  const getSelectedCourse = () => {
    if (!selectedCourseDetailId) return null
    const found = coursesList.find((c) => c.id === selectedCourseDetailId)
    if (!found) {
      setTimeout(() => setSelectedCourseDetailId(null), 0)
      return null
    }
    return found
  }

  const selectedCourse = getSelectedCourse()

  const filteredCourses = coursesList.filter((c) => {
    const hasBought =
      purchasedCourseIds.includes(c.id) ||
      activeRole === "admin" ||
      activeRole === "instructor"
    return coursesSubTab === "all" ? true : hasBought
  })

  const COURSES_PER_PAGE = 10
  const paginatedCourses = filteredCourses.slice(
    (coursePage - 1) * COURSES_PER_PAGE,
    coursePage * COURSES_PER_PAGE
  )

  if (selectedCourse) {
    return (
      <CourseDetailPage
        course={selectedCourse}
        hasBought={
          purchasedCourseIds.includes(selectedCourse.id) ||
          activeRole === "admin" ||
          activeRole === "instructor"
        }
        onBuyCourse={handleBuyCourseClick}
        onStartLearning={() => {
          setActive("Lectures")
        }}
        onBack={() => setSelectedCourseDetailId(null)}
      />
    )
  }

  return (
    <>
      <Header
        title="Course management"
        text="Create, price, publish, and monitor course inventory."
        actions={
          <>
            {activeRole !== "student" ? (
              <Button onClick={() => setShowCreateCourseModal(true)}>
                <Plus size={16} />
                Create course
              </Button>
            ) : null}
            <Button kind="ghost">
              <FileUp size={16} />
              Bulk upload
            </Button>
            <Button kind="ghost">
              <SlidersHorizontal size={16} />
              Categories
            </Button>
          </>
        }
      />

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-border/60 mb-6 mt-1">
        <button
          onClick={() => {
            setCoursesSubTab("all")
            setCoursePage(1)
          }}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            coursesSubTab === "all"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-black dark:hover:text-white"
          }`}
        >
          All Courses ({coursesList.length})
        </button>
        <button
          onClick={() => {
            setCoursesSubTab("my")
            setCoursePage(1)
          }}
          className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            coursesSubTab === "my"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-black dark:hover:text-white"
          }`}
        >
          My Courses (
          {
            coursesList.filter(
              (c) =>
                purchasedCourseIds.includes(c.id) ||
                activeRole === "admin" ||
                activeRole === "instructor"
            ).length
          }
          )
        </button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/30">
          <div className="mx-auto max-w-sm space-y-4">
            <div className="size-12 rounded-2xl bg-secondary/80 flex items-center justify-center mx-auto text-muted-foreground">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black dark:text-white">
                No enrolled courses
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                You haven't enrolled in any courses yet. Browse all available
                courses to begin your learning journey.
              </p>
            </div>
            <button
              onClick={() => {
                setCoursesSubTab("all")
                setCoursePage(1)
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-white font-semibold px-5 py-2.5 text-xs shadow-md hover:bg-primary/90 transition cursor-pointer mx-auto"
            >
              Explore All Courses
            </button>
          </div>
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {paginatedCourses.map((c) => {
              const hasBought =
                purchasedCourseIds.includes(c.id) ||
                activeRole === "admin" ||
                activeRole === "instructor"
              return (
                <Panel
                  key={c.id}
                  className="p-3 flex flex-col justify-between group"
                >
                  <div>
                    <div
                      onClick={() => setSelectedCourseDetailId(c.id)}
                      className={`h-32 rounded-2xl bg-linear-to-br ${c.gradient} cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 bg-black/50">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <h3
                          onClick={() => setSelectedCourseDetailId(c.id)}
                          className="font-bold truncate text-base hover:text-primary transition cursor-pointer"
                        >
                          {c.name}
                        </h3>
                        <Badge
                          tone={c.status === "Published" ? "green" : "orange"}
                        >
                          {c.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.instructor}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 h-8">
                        {c.description}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>${c.price}</span>
                        <span>{c.enrollments} enrollments</span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-[#EAB308]" />
                          {c.rating || "5.0"}
                        </span>
                        <span>{c.revenue || "$0"} rev</span>
                      </div>
                      {c.enrolledStudents && c.enrolledStudents.length > 0 && (
                        <div className="mt-4 border-t border-border/40 pt-3">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                            Enrolled Students
                          </span>
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {c.enrolledStudents.slice(0, 4).map((student) => (
                              <div
                                key={student.id}
                                title={`${student.name} (${student.email}) - ${student.progress}%`}
                                className="inline-flex size-6 rounded-full ring-2 ring-card bg-secondary text-[10px] font-bold text-black dark:text-white items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform"
                              >
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                            ))}
                            {c.enrolledStudents.length > 4 && (
                              <div
                                className="inline-flex size-6 rounded-full ring-2 ring-card bg-primary text-[10px] font-bold text-white items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform"
                                title={`${
                                  c.enrolledStudents.length - 4
                                } more students`}
                              >
                                +{c.enrolledStudents.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 p-2 pt-0">
                    {activeRole === "student" ? (
                      hasBought ? (
                        <Button
                          onClick={() => {
                            setActive("Lectures")
                          }}
                          className="w-full text-center justify-center"
                        >
                          Start Learning
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            handleBuyCourseClick(c)
                          }}
                          className="w-full text-center justify-center bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-white"
                        >
                          Buy Course · ${c.price}
                        </Button>
                      )
                    ) : (
                      <Button
                        kind="ghost"
                        onClick={() => {
                          setActive("Lectures")
                        }}
                        className="w-full text-center justify-center"
                      >
                        View Curriculum
                      </Button>
                    )}
                  </div>
                </Panel>
              )
            })}
          </section>
          <CustomPagination
            currentPage={coursePage}
            totalItems={filteredCourses.length}
            itemsPerPage={COURSES_PER_PAGE}
            onPageChange={setCoursePage}
          />
        </>
      )}
      <Panel className="mt-6 p-5">
        <h2 className="font-bold">Course creation flow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Basic Info", "Pricing", "Curriculum", "Preview & Publish"].map(
            (x, i) => (
              <div
                key={x}
                className="rounded-2xl border border-border bg-secondary p-4"
              >
                <span className="font-mono text-xs text-primary">
                  STEP {i + 1}
                </span>
                <p className="mt-2 font-semibold">{x}</p>
              </div>
            )
          )}
        </div>
      </Panel>
    </>
  )
}
