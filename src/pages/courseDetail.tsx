import React, { useState } from "react";
import { 
  ChevronLeft, 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  Users, 
  Award, 
  Clock, 
  Sparkles,
  BookMarked
} from "lucide-react";
import type { Course, CurriculumNode } from "../data/coursesData";

interface CourseDetailPageProps {
  course: Course;
  hasBought: boolean;
  onBuyCourse: (course: Course) => void;
  onStartLearning: () => void;
  onBack: () => void;
}

// Syllabus Node Recursive Tree Viewer
const SyllabusNode: React.FC<{ node: CurriculumNode; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === "topic") {
    return (
      <div className="select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className="flex w-full items-center gap-2 py-3 text-left text-sm font-semibold hover:bg-secondary/40 text-foreground transition cursor-pointer border-b border-border/10"
        >
          {isOpen ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
          <span className="truncate">{node.title}</span>
        </button>
        {isOpen && (
          <div className="relative">
            <div 
              style={{ left: `${depth * 14 + 16}px` }} 
              className="absolute top-0 bottom-0 w-px bg-border/60"
            />
            {node.children.map((child, idx) => (
              <SyllabusNode key={idx} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        className="flex w-full items-center justify-between py-2.5 text-left text-xs text-muted-foreground hover:text-white transition border-b border-border/5"
      >
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={12} className="text-muted-foreground/80 shrink-0" />
          <span className="truncate">{node.title}</span>
        </div>
        <span className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full shrink-0 font-mono text-muted-foreground">
          {node.duration || "5:00"}
        </span>
      </div>
    );
  }
};

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  course,
  hasBought,
  onBuyCourse,
  onStartLearning,
  onBack
}) => {
  // Helper to count total lectures and total duration
  const getCurriculumStats = (nodes: CurriculumNode[]): { count: number; duration: number } => {
    let count = 0;
    let duration = 0;

    const traverse = (list: CurriculumNode[]) => {
      for (const node of list) {
        if (node.type === "lecture") {
          count += 1;
          const min = parseInt(node.duration || "5") || 5;
          duration += min;
        } else if (node.type === "topic") {
          traverse(node.children);
        }
      }
    };
    traverse(nodes);
    return { count, duration };
  };

  const { count: totalLectures, duration: totalDurationMin } = getCurriculumStats(course.curriculum);
  const totalDurationHrs = (totalDurationMin / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-white transition cursor-pointer"
      >
        <ChevronLeft size={16} /> Back to Course Catalog
      </button>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
        {/* Dynamic banner background */}
        <div className="absolute inset-0 bg-linear-to-r from-card/90 to-card/45 z-10" />
        <div className={`absolute inset-0 bg-linear-to-br ${course.gradient} opacity-20 blur-xl pointer-events-none`} />

        <div className="relative z-20 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {course.status === "Published" ? "Active Curriculum" : `${course.status} Mode`}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {course.name}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span>Instructor: <strong className="text-white">{course.instructor}</strong></span>
              <span className="size-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Star size={14} className="text-[#EAB308] fill-[#EAB308]" />
                <strong className="text-white">{course.rating || "5.0"}</strong>
              </span>
              <span className="size-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Users size={14} className="text-primary" />
                <strong className="text-white">{course.enrollments} Enrolled</strong>
              </span>
            </div>
          </div>

          <div className={`h-24 w-40 shrink-0 rounded-2xl bg-linear-to-br ${course.gradient} hidden md:block shadow-2xl`} />
        </div>
      </section>

      {/* Detailed Page Content */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Column: Syllabus Structure */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 lg:p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookMarked size={18} className="text-primary" />
              Course Syllabus & Lectures
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Explore the full curriculum structure. Buy this course to unlock access to all video lectures, slides, and study notes.
            </p>

            <div className="rounded-2xl border border-border bg-secondary/20 overflow-hidden divide-y divide-border/60">
              {course.curriculum.map((node, idx) => (
                <SyllabusNode key={idx} node={node} depth={0} />
              ))}
            </div>
          </div>

          {/* Enrolled Students Panel */}
          <div className="rounded-3xl border border-border bg-card p-5 lg:p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Enrolled Students ({course.enrolledStudents?.length || 0})
            </h3>
            
            {!course.enrolledStudents || course.enrolledStudents.length === 0 ? (
              <p className="text-xs text-muted-foreground">No students enrolled in this course yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-muted-foreground border-b border-border/40">
                    <tr>
                      <th className="pb-3 font-medium">Student</th>
                      <th className="pb-3 font-medium">Joined Date</th>
                      <th className="pb-3 font-medium">Progress</th>
                      <th className="pb-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {course.enrolledStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 flex items-center gap-3">
                          <div className="grid size-8 place-items-center rounded-full bg-secondary font-semibold text-white text-xs shrink-0">
                            {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{student.name}</span>
                            <span className="text-muted-foreground text-[10px] block">{student.email}</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(student.enrollmentDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 w-1/3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500" 
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-muted-foreground shrink-0">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.completed 
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}>
                            {student.completed ? "Completed" : "In Progress"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Info & Stats */}
        <div className="space-y-6">
          {/* Card Panel for Actions */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 size-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Syllabus Overview</h3>
              
              <div className="space-y-4 my-5">
                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Duration
                  </span>
                  <span className="font-semibold text-white">{totalDurationHrs} Hours</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" /> Total Lectures
                  </span>
                  <span className="font-semibold text-white">{totalLectures} Lectures</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2.5">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Award size={16} className="text-[#EAB308]" /> Certificates
                  </span>
                  <span className="font-semibold text-white">Issued at 100%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border space-y-4">
              {hasBought ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">You have access</h4>
                      <p className="text-[10px] text-muted-foreground">Course fully unlocked under your account.</p>
                    </div>
                  </div>
                  <button
                    onClick={onStartLearning}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-primary text-white font-semibold py-3 text-sm shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:bg-primary/90 transition cursor-pointer"
                  >
                    Go to Class Player
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Purchase price:</span>
                    <strong className="text-3xl font-bold text-white">${course.price}</strong>
                  </div>
                  
                  <button
                    onClick={() => onBuyCourse(course)}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-emerald-600 text-white font-bold py-3 text-sm shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:bg-emerald-500 transition cursor-pointer"
                  >
                    Buy Course · ${course.price}
                  </button>

                  <p className="text-[10px] text-muted-foreground text-center">
                    🔒 SSL Secured Checkout · 30-day money-back guarantee.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
