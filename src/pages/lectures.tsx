import { useState, useEffect, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Play, Lock, FileText, BookOpen, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { Panel } from "../components/ui";
import type { Course, CurriculumNode, Lecture } from "../data/coursesData";

interface TreeNodeProps {
  node: CurriculumNode;
  isUnlocked: boolean;
  selectedLecture: Lecture | null;
  onSelectLecture: (lecture: Lecture) => void;
  depth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isUnlocked, selectedLecture, onSelectLecture, depth }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === "topic") {
    return (
      <div className="select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className="flex w-full items-center gap-2 py-2.5 text-left text-sm font-semibold hover:bg-secondary/40 text-foreground transition cursor-pointer"
        >
          {isOpen ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
          <span className="truncate">{node.title}</span>
        </button>
        {isOpen && (
          <div className="relative">
            <div 
              style={{ left: `${depth * 14 + 16}px` }} 
              className="absolute top-0 bottom-0 w-[1px] bg-border/60"
            />
            {node.children.map((child, idx) => (
              <TreeNode
                key={idx}
                node={child}
                isUnlocked={isUnlocked}
                selectedLecture={selectedLecture}
                onSelectLecture={onSelectLecture}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    const isSelected = selectedLecture?.title === node.title;
    return (
      <button
        onClick={() => isUnlocked && onSelectLecture(node)}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        className={`flex w-full items-center justify-between py-3 text-left text-xs transition cursor-pointer ${
          !isUnlocked ? "opacity-60 cursor-not-allowed" : "hover:bg-secondary/50"
        } ${isSelected ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary" : "text-muted-foreground hover:text-black dark:hover:text-white"}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isUnlocked ? (
            <Play size={12} className={isSelected ? "text-primary shrink-0" : "text-muted-foreground shrink-0"} />
          ) : (
            <Lock size={12} className="text-muted-foreground shrink-0" />
          )}
          <span className="truncate">{node.title}</span>
        </div>
        <span className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full shrink-0 font-mono text-muted-foreground">
          {node.duration || "5:00"}
        </span>
      </button>
    );
  }
};

function findFirstLecture(nodes: CurriculumNode[]): Lecture | null {
  for (const node of nodes) {
    if (node.type === "lecture") {
      return node;
    } else if (node.type === "topic") {
      const found = findFirstLecture(node.children);
      if (found) return found;
    }
  }
  return null;
}

interface LecturesPageProps {
  courses: Course[];
  purchasedCourseIds: string[];
  role: "admin" | "user";
  onBuyCourse: (course: Course) => void;
  onUpdateProgress?: (courseId: string, progress: number) => void;
}

function LecturesPage({ courses, purchasedCourseIds, role, onBuyCourse, onUpdateProgress }: LecturesPageProps): ReactNode {
  const [activeCourseId, setActiveCourseId] = useState<string>("");
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "discussion">("overview");

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const isUnlocked = role === "admin" || purchasedCourseIds.includes(activeCourse?.id);

  // Set default active course on load
  useEffect(() => {
    if (courses.length > 0 && !activeCourseId) {
      setActiveCourseId(courses[0].id);
    }
  }, [courses, activeCourseId]);

  // Update selected lecture when active course changes
  useEffect(() => {
    if (activeCourse) {
      const first = findFirstLecture(activeCourse.curriculum);
      setSelectedLecture(first);
    }
  }, [activeCourseId, activeCourse]);

  if (!activeCourse) {
    return <div className="text-center py-12 text-muted-foreground">No courses available.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curriculum & Lectures</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore curriculum topics and consume video lectures.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Active Course:</span>
          <div className="relative">
            <select
              value={activeCourseId}
              onChange={(e) => setActiveCourseId(e.target.value)}
              className="appearance-none rounded-2xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {purchasedCourseIds.includes(c.id) || role === "admin" ? "" : "🔒"}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {!isUnlocked ? (
        <Panel className="p-8 text-center max-w-2xl mx-auto space-y-6 bg-linear-to-b from-card to-secondary/30 border-border/80 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 size-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <Lock size={28} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Course is Locked</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You are currently viewing this course curriculum as a guest. Purchase the course to unlock video lectures, notes, and study resources.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-secondary/40 text-left max-w-md mx-auto">
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">Course Curriculum Preview</span>
            <div className="mt-3 space-y-2">
              {activeCourse.curriculum.map((node, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen size={12} className="text-muted-foreground shrink-0" />
                  <span className="truncate font-semibold text-foreground/80">{node.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onBuyCourse(activeCourse)}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-white shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:bg-primary/90 px-6 py-3 text-sm font-semibold transition cursor-pointer"
            >
              <Sparkles size={16} /> Buy Course for ${activeCourse.price}
            </button>
          </div>
        </Panel>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          {/* Left Column: Curriculum Tree */}
          <Panel className="p-4 h-fit max-h-[600px] overflow-y-auto border-border">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
              <BookOpen size={16} className="text-primary" />
              <span className="text-sm font-bold">Curriculum Structure</span>
            </div>
            
            <div className="space-y-1">
              {activeCourse.curriculum.map((node, idx) => (
                <TreeNode
                  key={idx}
                  node={node}
                  isUnlocked={true}
                  selectedLecture={selectedLecture}
                  onSelectLecture={setSelectedLecture}
                  depth={0}
                />
              ))}
            </div>
          </Panel>

          {/* Right Column: Lecture Viewer */}
          <div className="space-y-6">
            {selectedLecture ? (
              <Panel className="overflow-hidden p-4 md:p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">{selectedLecture.duration || "5:00"}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 size={12} />
                        <span>Unlocked Access</span>
                      </div>
                      {role === "user" && onUpdateProgress && (
                        <button
                          onClick={() => onUpdateProgress(activeCourse.id, 100)}
                          className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 px-3 py-1 rounded-full font-semibold transition"
                        >
                          <Sparkles size={12} />
                          <span>Mark 100% Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedLecture.title}</h2>
                </div>

                {/* React Player rendering video in dynamic byte-range chunks */}
                <div className="relative pt-[56.25%] bg-black rounded-3xl overflow-hidden border border-border shadow-2xl group">
                  <video
                    key={selectedLecture.title}
                    src={selectedLecture.videoUrl || "https://res.cloudinary.com/dk6nbaps1/video/upload/v1782451962/output_144p_mw4twn.mp4"}
                    controls
                    className="absolute inset-0 w-full h-full object-contain"
                    preload="metadata"
                    controlsList="nodownload"
                  />
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                  <div className="flex gap-4">
                    {(["overview", "notes", "discussion"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-semibold capitalize transition cursor-pointer relative ${
                          activeTab === tab ? "text-primary font-bold" : "text-muted-foreground hover:text-black dark:hover:text-white"
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Contents */}
                <div className="min-h-32 text-sm leading-relaxed">
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-foreground">Lecture Description</h4>
                        <p className="text-muted-foreground mt-1.5">
                          {selectedLecture.description || "No description provided for this lecture."}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-border grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="font-semibold block text-foreground">Instructor</span>
                          <span className="mt-0.5 block">{activeCourse.instructor}</span>
                        </div>
                        <div>
                          <span className="font-semibold block text-foreground">Estimated Duration</span>
                          <span className="mt-0.5 block">{selectedLecture.duration || "5 mins"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="space-y-3 bg-secondary/35 border border-border/80 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                        <FileText size={16} />
                        <span>Study Guide & Reference Notes</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {selectedLecture.notes || "No notes available for this lecture. Follow along with the video slides."}
                      </p>
                    </div>
                  )}

                  {activeTab === "discussion" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h4 className="font-bold">Student Discussion (3)</h4>
                        <button className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold border border-border bg-card text-muted-foreground hover:text-black dark:hover:text-white transition cursor-pointer">
                          <MessageSquare size={14} /> Post Question
                        </button>
                      </div>
                      <div className="space-y-4 mt-2">
                        {[
                          ["Alex M.", "1 day ago", "Is there a GitHub repository available for these code snippets?"],
                          ["Jon Bell (Instructor)", "18 hours ago", "Yes! You can find the companion repository at github.com/nexus-lms/react-systems."],
                          ["Priya N.", "2 hours ago", "Extremely clear explanation of the GPU render layers. Thank you!"]
                        ].map(([author, time, msg], i) => (
                          <div key={i} className={`p-3 rounded-2xl border ${
                            author.includes("Instructor") ? "bg-primary/5 border-primary/20 ml-6" : "bg-secondary/40 border-border/60"
                          }`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs">{author}</span>
                              <span className="text-[10px] text-muted-foreground">{time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal">{msg}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            ) : (
              <Panel className="p-12 text-center text-muted-foreground border-dashed">
                Select a lecture from the curriculum sidebar to start watching.
              </Panel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LecturesPage;
