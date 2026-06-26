import React from "react";
import { 
  Mail, 
  Calendar, 
  Shield, 
  Award, 
  Trophy, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Activity
} from "lucide-react";
import type { Course } from "../data/coursesData";

interface ProfilePageProps {
  currentUser: {
    _id: string;
    email: string;
    role: "admin" | "instructor" | "student";
    name: string;
    status: string;
    purchasedCourseIds: string[];
    joinedDate?: string;
  };
  coursesList: Course[];
  myProgress: any[];
  onSelectPage: (page: string) => void;
  onSelectCourseDetail: (courseId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  coursesList,
  myProgress,
  onSelectPage,
  onSelectCourseDetail
}) => {
  // Get all enrolled courses
  const enrolledCourses = coursesList.filter(c => 
    (currentUser.purchasedCourseIds || []).includes(c.id)
  );

  // Stats calculation
  const totalEnrolled = enrolledCourses.length;
  
  const completedCoursesCount = myProgress.filter(
    p => p.certificateStatus === "Issued" || p.progress === 100 || p.progress === "100%"
  ).length;

  const averageProgress = totalEnrolled > 0 
    ? Math.round(
        myProgress.reduce((sum, p) => {
          const val = typeof p.progress === "string"
            ? parseInt(p.progress.replace("%", "")) || 0
            : Number(p.progress) || 0;
          return sum + val;
        }, 0) / totalEnrolled
      )
    : 0;

  // Initials for avatar
  const initials = currentUser.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Safe progress percentage helper
  const getCourseProgress = (courseId: string) => {
    const progObj = myProgress.find(p => p.courseId === courseId);
    if (!progObj) return 0;
    return typeof progObj.progress === "string"
      ? parseInt(progObj.progress.replace("%", "")) || 0
      : Number(progObj.progress) || 0;
  };

  const getCourseCertificateStatus = (courseId: string) => {
    const progObj = myProgress.find(p => p.courseId === courseId);
    return progObj ? progObj.certificateStatus : "In progress";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings, track learning statistics, and view certificates.
        </p>
      </div>

      {/* Profile Overview Card */}
      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left Card: Account Card */}
        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -left-12 size-36 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 size-36 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          {/* Avatar with dynamic premium gradient */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
            <div className="relative size-24 rounded-full bg-card border border-border flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 size-5 rounded-full border-2 border-card bg-emerald-500 flex items-center justify-center" title="Online" />
          </div>

          <h2 className="text-2xl font-bold mt-5 text-white">{currentUser.name}</h2>
          
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
            {currentUser.role} Account
          </span>

          <p className="text-xs text-muted-foreground mt-1">
            Status: <span className="text-[#22C55E] font-medium">{currentUser.status || "Active"}</span>
          </p>

          <div className="w-full border-t border-border/60 my-5 pt-5 space-y-3.5 text-left text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail size={16} className="text-primary shrink-0" />
              <span className="truncate text-foreground/90">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Shield size={16} className="text-primary shrink-0" />
              <span className="truncate text-foreground/90 capitalize">{currentUser.role} privileges</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar size={16} className="text-primary shrink-0" />
              <span className="truncate text-foreground/90">
                Joined {currentUser.joinedDate || "April 2026"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Statistics and Analytics */}
        <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Learning Statistics</h3>
            
            {/* Stats Cards Row */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-secondary/30 p-4 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-primary opacity-10">
                  <BookOpen size={40} />
                </div>
                <span className="text-xs text-muted-foreground font-medium block">Courses Enrolled</span>
                <strong className="text-3xl font-bold mt-2 block text-white">{totalEnrolled}</strong>
                <span className="text-[10px] text-muted-foreground mt-1 block">Lifetime access</span>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/30 p-4 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-[#3B82F6] opacity-10">
                  <Activity size={40} />
                </div>
                <span className="text-xs text-muted-foreground font-medium block">Average Progress</span>
                <strong className="text-3xl font-bold mt-2 block text-white">{averageProgress}%</strong>
                <span className="text-[10px] text-muted-foreground mt-1 block">Across all topics</span>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/30 p-4 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-[#EAB308] opacity-10">
                  <Award size={40} />
                </div>
                <span className="text-xs text-muted-foreground font-medium block">Certificates Earned</span>
                <strong className="text-3xl font-bold mt-2 block text-white">{completedCoursesCount}</strong>
                <span className="text-[10px] text-muted-foreground mt-1 block">100% completed</span>
              </div>
            </div>

            {/* Study streak tracker */}
            <div className="mt-6 p-4 rounded-2xl border border-primary/10 bg-linear-to-r from-primary/5 to-accent/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Trophy size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Daily Learning Streak</h4>
                  <p className="text-xs text-muted-foreground">Keep studying daily to maintain your momentum!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-2xl font-bold text-primary">5</strong>
                <span className="text-xs text-muted-foreground font-mono">Days</span>
                <span className="text-sm">🔥</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Account secure with 2FA · Managed under Nexus LMS Enterprise Policy.
            </div>
            <button 
              onClick={() => onSelectPage("Courses")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/70 hover:text-white px-4 py-2 text-xs font-semibold text-muted-foreground transition cursor-pointer"
            >
              Browse Catalog <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Enrolled Courses Grid */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          My Curriculum & Progress
        </h3>

        {enrolledCourses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {enrolledCourses.map(course => {
              const progress = getCourseProgress(course.id);
              const certStatus = getCourseCertificateStatus(course.id);
              const isCompleted = certStatus === "Issued" || progress === 100;

              return (
                <div 
                  key={course.id}
                  className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-primary/40 transition duration-300 group"
                >
                  <div className="flex gap-4">
                    {/* Course Gradient Thumbnail */}
                    <div 
                      onClick={() => onSelectCourseDetail(course.id)}
                      className={`size-16 shrink-0 rounded-xl bg-gradient-to-br ${course.gradient} cursor-pointer shadow-md`}
                    />
                    
                    <div className="min-w-0 flex-1">
                      <h4 
                        onClick={() => onSelectCourseDetail(course.id)}
                        className="font-bold text-sm text-white truncate hover:text-primary transition cursor-pointer"
                      >
                        {course.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Instructor: {course.instructor}
                      </p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle2 size={10} />
                            <span>Certificate Issued</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                            <Clock size={10} />
                            <span>In Progress</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & CTA */}
                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                        <span>Course Completion</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Normally sets to lectures, but let's select this course
                        onSelectPage("Lectures");
                      }}
                      className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-primary text-white text-xs font-semibold px-3 py-2 shadow-sm hover:bg-primary/90 transition cursor-pointer"
                    >
                      Study <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="mx-auto size-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <BookOpen size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white">No Enrolled Courses</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                You haven't registered or purchased any courses yet. Explore our curriculum options to get started.
              </p>
            </div>
            <button
              onClick={() => onSelectPage("Courses")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white text-xs font-semibold px-4 py-2.5 shadow-md hover:bg-primary/90 transition cursor-pointer"
            >
              Browse Catalog <Sparkles size={12} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
