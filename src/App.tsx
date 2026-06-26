import { useState, useEffect, useCallback, type ReactNode } from "react"
import LecturesPage from "./pages/lectures"
import ProfilePage from "./pages/profile"
import {
  Bell,
  BookOpen,
  ChevronDown,
  CreditCard,
  Gift,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  TrendingUp,
  User,
  Users,
  Video,
  X,
} from "lucide-react"
import { sampleCurriculum, type Course } from "./data/coursesData"
import {
  authAPI,
  coursesAPI,
  couponsAPI,
  enrollmentsAPI,
  usersAPI,
  paymentsAPI,
} from "./services/api"

// Fragmented page/dashboard components
import { AdminDashboard } from "./pages/adminDashboard"
import { InstructorDashboard } from "./pages/instructorDashboard"
import { StudentDashboard } from "./pages/studentDashboard"
import { UsersPage } from "./pages/usersPage"
import { CoursesPage } from "./pages/coursesPage"
import { PaymentsPage } from "./pages/paymentsPage"
import { CouponsPage } from "./pages/couponsPage"
import { EnrollmentsPage } from "./pages/enrollmentsPage"
import { AnalyticsPage } from "./pages/analyticsPage"
import { SettingsPage } from "./pages/settingsPage"


const nav = [
  ["Dashboard", LayoutDashboard],
  ["Users", Users],
  ["Courses", BookOpen],
  ["Payments", CreditCard],
  ["Coupons", Gift],
  ["Enrollments", GraduationCap],
  ["Analytics", TrendingUp],
  ["Settings", Settings],
  ["Lectures", Video],
  ["Profile", User],
] as const



export function Badge({
  children,
  tone = "purple",
}: {
  children: string
  tone?: "purple" | "green" | "orange" | "red" | "blue"
}) {
  const tones = {
    purple: "bg-primary/10 text-primary border-primary/20",
    green: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    orange: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
    red: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    blue: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
  }
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function Button({
  children,
  kind = "primary",
  onClick,
  className = "",
}: {
  children: ReactNode
  kind?: "primary" | "ghost"
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition cursor-pointer ${kind === "primary" ? "bg-primary text-white shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:bg-primary/90" : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"} ${className}`}
    >
      {children}
    </button>
  )
}
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-3xl border border-border bg-card ${className}`}
    >
      {children}
    </section>
  )
}
export function Header({
  title,
  text,
  actions,
}: {
  title: string
  text: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.01em]">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  )
}

export function Table({
  heads,
  rows,
  onRowClick,
}: {
  heads: string[]
  rows: string[][]
  onRowClick?: (rowIndex: number) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-190 text-left text-sm">
        <thead className="text-muted-foreground">
          <tr>
            {heads.map((h) => (
              <th key={h} className="border-b border-border py-3 font-medium">
                {h}
              </th>
            ))}
            <th className="border-b border-border py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(rowIndex)}
              className={`hover:bg-secondary/60 ${onRowClick ? "cursor-pointer" : ""}`}
            >
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`py-4 ${j > 0 ? "text-muted-foreground" : "text-white"}`}
                >
                  {j === 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-secondary font-semibold text-white">
                        {String(c)
                          .split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      {c}
                    </div>
                  ) : (typeof c === "string" && typeof c.includes === "function" && (
                    c.includes("Active") ||
                    c.includes("Paid") ||
                    c.includes("Issued") ||
                    c.includes("Published")
                  )) ? (
                    <Badge tone="green">{c}</Badge>
                  ) : (typeof c === "string" && typeof c.includes === "function" && (
                    c.includes("Pending") ||
                    c.includes("Draft") ||
                    c.includes("Review")
                  )) ? (
                    <Badge tone="orange">{c}</Badge>
                  ) : (typeof c === "string" && typeof c.includes === "function" && (
                    c.includes("Refund") ||
                    c.includes("Suspended") ||
                    c.includes("Expired") ||
                    c.includes("Locked")
                  )) ? (
                    <Badge tone="red">{c}</Badge>
                  ) : (
                    c
                  )}
                </td>
              ))}
              <td className="py-4 text-right">
                <MoreHorizontal
                  className="inline text-muted-foreground"
                  size={18}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Filters() {
  return (
    <Panel className="mb-6 grid gap-3 p-3 md:grid-cols-[1fr_150px_150px_180px]">
      <div className="flex items-center gap-2 rounded-[14px] border border-border bg-secondary px-3">
        <Search size={16} className="text-muted-foreground" />
        <span className="py-3 text-sm text-muted-foreground">
          Search records
        </span>
      </div>
      {["Role", "Status", "Registration date"].map((x) => (
        <button
          key={x}
          className="flex items-center justify-between rounded-[14px] border border-border bg-secondary px-3 py-3 text-sm text-muted-foreground"
        >
          {x}
          <ChevronDown size={15} />
        </button>
      ))}
    </Panel>
  )
}

function SearchBar() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setResults([])
        return
      }

      try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }
        const BASE_API_URL = 'https://lms-backend-td88.onrender.com';
        const res = await fetch(
          `${BASE_API_URL}/api/search?query=${encodeURIComponent(search)}`,
          {
            method: "GET",
            headers,
          },
        )

        if (!res.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="relative hidden flex-1 md:flex">
      <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-secondary px-4 py-3">
        <Search size={18} className="text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users, courses..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-lg z-50">
          {results.map((item: any) => (
            <div
              key={item._id}
              className="cursor-pointer px-4 py-3 hover:bg-secondary"
            >
              <div className="font-medium">{item.name || item.title}</div>
              <div className="text-xs text-muted-foreground">{item.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<{
    _id: string
    email: string
    role: "admin" | "instructor" | "student"
    name: string
    status: string
    phone?: string
    purchasedCourseIds: string[]
  } | null>(null)
  const [activeRole, setActiveRole] = useState<
    "admin" | "instructor" | "student"
  >("admin")
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [active, setActive] = useState("Dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [range, setRange] = useState("Weekly")
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [coursesList, setCoursesList] = useState<Course[]>([])
  const [selectedCourseDetailId, setSelectedCourseDetailId] = useState<string | null>(null)
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([])
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState<Course | null>(
    null,
  )
  const [coursePage, setCoursePage] = useState(1)
  const [paymentPage, setPaymentPage] = useState(1)
  const [enrollmentPageNum, setEnrollmentPageNum] = useState(1)
  const [couponPageNum, setCouponPageNum] = useState(1)
  const [usersPageNum, setUsersPageNum] = useState(1)

  const [couponSearch, setCouponSearch] = useState("")
  const [couponTypeFilter, setCouponTypeFilter] = useState("all")
  const [couponStatusFilter, setCouponStatusFilter] = useState("all")
  const [couponCourseFilter, setCouponCourseFilter] = useState("all")
  const [analyticsTab, setAnalyticsTab] = useState("Revenue")
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!toastMsg) return
    const id = setTimeout(() => setToastMsg(null), 4000)
    return () => clearTimeout(id)
  }, [toastMsg])

  // Live Database States
  const [usersListData, setUsersListData] = useState<any[]>([])
  const [txData, setTxData] = useState<any[]>([])
  const [couponsData, setCouponsData] = useState<any[]>([])
  const [enrollmentsData, setEnrollmentsData] = useState<any[]>([])
  const [myProgress, setMyProgress] = useState<any[]>([])

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false)
  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false)

  // Authentication & Form States
  const [loginError, setLoginError] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null)
  const [coursesSubTab, setCoursesSubTab] = useState<'all' | 'my'>('all')

  // Dynamic analytics helper
  const getAnalyticsData = () => {
    const successfulTx = txData.filter(t => t.status === "Paid" || t.status === "Success")
    const students = usersListData.filter(u => u.role === "student")

    const hasData = successfulTx.length > 0 || students.length > 0
    if (!hasData) {
      return [
        { day: "Mon", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
        { day: "Tue", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
        { day: "Wed", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
        { day: "Thu", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
        { day: "Fri", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
        { day: "Sat", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
        { day: "Sun", revenue: 0, students: 0, users: 0, courses: 0, payments: 0, coupons: 0 },
      ]
    }

    if (range === "Daily") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days.map((dayName, idx) => {
        const dayTx = successfulTx.filter(t => {
          const d = new Date(t.date || t.createdAt || Date.now())
          const dayIndex = (d.getDay() + 6) % 7
          return dayIndex === idx
        })
        const dayStudents = students.filter(u => {
          const d = new Date(u.joinedDate || u.createdAt || Date.now())
          const dayIndex = (d.getDay() + 6) % 7
          return dayIndex === idx
        })
        const dayCourses = coursesList.filter(c => {
          const d = new Date(c.createdAt || Date.now())
          const dayIndex = (d.getDay() + 6) % 7
          return dayIndex === idx
        })
        const dayCoupons = couponsData.filter(cp => {
          const d = new Date(cp.createdAt || Date.now())
          const dayIndex = (d.getDay() + 6) % 7
          return dayIndex === idx
        })
        const couponUses = dayTx.filter(t => t.coupon).length + dayCoupons.length

        const revSum = dayTx.reduce((sum, t) => sum + (parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0), 0)
        return {
          day: dayName,
          revenue: revSum,
          students: dayStudents.length,
          users: dayStudents.length,
          courses: dayCourses.length,
          payments: dayTx.length,
          coupons: couponUses
        }
      })
    } else if (range === "Weekly") {
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]
      const now = Date.now()
      return weeks.map((w, idx) => {
        const startMs = now - (4 - idx) * 7 * 24 * 60 * 60 * 1000
        const endMs = now - (3 - idx) * 7 * 24 * 60 * 60 * 1000
        const weekTx = successfulTx.filter(t => {
          const time = new Date(t.date || t.createdAt || Date.now()).getTime()
          return time >= startMs && time < endMs
        })
        const weekStudents = students.filter(u => {
          const time = new Date(u.joinedDate || u.createdAt || Date.now()).getTime()
          return time >= startMs && time < endMs
        })
        const weekCourses = coursesList.filter(c => {
          const time = new Date(c.createdAt || Date.now()).getTime()
          return time >= startMs && time < endMs
        })
        const weekCoupons = couponsData.filter(cp => {
          const time = new Date(cp.createdAt || Date.now()).getTime()
          return time >= startMs && time < endMs
        })
        const couponUses = weekTx.filter(t => t.coupon).length + weekCoupons.length

        const revSum = weekTx.reduce((sum, t) => sum + (parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0), 0)
        return {
          day: w,
          revenue: revSum,
          students: weekStudents.length,
          users: weekStudents.length,
          courses: weekCourses.length,
          payments: weekTx.length,
          coupons: couponUses
        }
      })
    } else if (range === "Monthly") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const now = new Date()
      const list = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthIdx = d.getMonth()
        const year = d.getFullYear()
        
        const monthTx = successfulTx.filter(t => {
          const txDate = new Date(t.date || t.createdAt || Date.now())
          return txDate.getMonth() === monthIdx && txDate.getFullYear() === year
        })
        const monthStudents = students.filter(u => {
          const uDate = new Date(u.joinedDate || u.createdAt || Date.now())
          return uDate.getMonth() === monthIdx && uDate.getFullYear() === year
        })
        const monthCourses = coursesList.filter(c => {
          const cDate = new Date(c.createdAt || Date.now())
          return cDate.getMonth() === monthIdx && cDate.getFullYear() === year
        })
        const monthCoupons = couponsData.filter(cp => {
          const cDate = new Date(cp.createdAt || Date.now())
          return cDate.getMonth() === monthIdx && cDate.getFullYear() === year
        })
        const couponUses = monthTx.filter(t => t.coupon).length + monthCoupons.length

        const revSum = monthTx.reduce((sum, t) => sum + (parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0), 0)
        list.push({
          day: monthNames[monthIdx],
          revenue: revSum,
          students: monthStudents.length,
          users: monthStudents.length,
          courses: monthCourses.length,
          payments: monthTx.length,
          coupons: couponUses
        })
      }
      return list
    } else {
      const nowYear = new Date().getFullYear()
      const years = [nowYear - 2, nowYear - 1, nowYear]
      return years.map(yr => {
        const yrTx = successfulTx.filter(t => {
          const txDate = new Date(t.date || t.createdAt || Date.now())
          return txDate.getFullYear() === yr
        })
        const yrStudents = students.filter(u => {
          const uDate = new Date(u.joinedDate || u.createdAt || Date.now())
          return uDate.getFullYear() === yr
        })
        const yrCourses = coursesList.filter(c => {
          const cDate = new Date(c.createdAt || Date.now())
          return cDate.getFullYear() === yr
        })
        const yrCoupons = couponsData.filter(cp => {
          const cDate = new Date(cp.createdAt || Date.now())
          return cDate.getFullYear() === yr
        })
        const couponUses = yrTx.filter(t => t.coupon).length + yrCoupons.length

        const revSum = yrTx.reduce((sum, t) => sum + (parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0), 0)
        return {
          day: String(yr),
          revenue: revSum,
          students: yrStudents.length,
          users: yrStudents.length,
          courses: yrCourses.length,
          payments: yrTx.length,
          coupons: couponUses
        }
      })
    }
  }

  const revenueData = getAnalyticsData()

  const loadData = useCallback(async (user: any, roleToCheck: string = activeRole) => {
    try {
      const coursesData = await coursesAPI.getAll()
      setCoursesList(coursesData)

      if (user) {
        setPurchasedCourseIds(user.purchasedCourseIds || [])

        if (roleToCheck === "admin") {
          const uList = await usersAPI.getAll()
          setUsersListData(uList)

          const txList = await paymentsAPI.getTransactions()
          setTxData(txList)

          const cpList = await couponsAPI.getAll()
          setCouponsData(cpList)

          const enList = await enrollmentsAPI.getAll()
          setEnrollmentsData(enList)
        } else if (roleToCheck === "instructor") {
          const cpList = await couponsAPI.getAll()
          setCouponsData(cpList)

          const enList = await enrollmentsAPI.getAll()
          setEnrollmentsData(enList)
        } else if (roleToCheck === "student") {
          const prog = await enrollmentsAPI.getMy()
          setMyProgress(prog)
        }
      }
    } catch (err: any) {
      console.error("Error loading data from API:", err)
    }
  }, [activeRole])

  useEffect(() => {
    const autoLogin = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const user = await authAPI.getMe()
          setCurrentUser(user)
          setActiveRole(user.role)
        } catch (err) {
          console.error("Token invalid, logging out:", err)
          authAPI.logout()
        }
      }
    }
    autoLogin()
  }, [])

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser, activeRole)
    }
  }, [currentUser, activeRole, loadData])

  const handleRoleSwitch = (newRole: "admin" | "instructor" | "student") => {
    setActiveRole(newRole)
    if (newRole === "student" || newRole === "instructor") {
      if (
        active !== "Dashboard" &&
        active !== "Courses" &&
        active !== "Lectures" &&
        active !== "Profile"
      ) {
        setActive("Dashboard")
      }
    }
  }

  const handleBuyCourseClick = (course: Course) => {
    setCouponCode("")
    setCouponError(null)
    setAppliedCoupon(null)
    setShowCheckoutModal(course)
  }

  const getDiscountedPrice = (priceStr: string) => {
    const originalPrice = parseFloat(priceStr) || 0
    if (!appliedCoupon) return originalPrice

    const discountStr = String(appliedCoupon.discount || "")
    const discountVal =
      parseFloat(discountStr.replace("%", "").replace("$", "")) || 0
    if (appliedCoupon.type === "Percentage") {
      return Math.max(0, originalPrice - originalPrice * (discountVal / 100))
    } else {
      return Math.max(0, originalPrice - discountVal)
    }
  }

  const handleCompleteCheckout = async (
    courseId: string,
    courseName: string,
  ) => {
    try {
      const isScriptLoaded = await new Promise<boolean>((resolve) => {
        if ((window as any).Razorpay) {
          resolve(true)
          return
        }
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })

      if (!isScriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.")
        return
      }

      const orderData = await paymentsAPI.createRazorpayOrder(courseId, appliedCoupon?.code)

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ecera Nexus LMS",
        description: `Enrollment fee for ${courseName}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await paymentsAPI.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            });

            setPurchasedCourseIds(verifyRes.purchasedCourseIds || []);
            setShowCheckoutModal(null);
            setToastMsg(
              `Successfully purchased "${courseName}"! Course curriculum unlocked.`
            );

            if (currentUser) {
              const user = await authAPI.getMe();
              setCurrentUser(user);
              loadData(user);
            }
          } catch (err: any) {
            alert(`Payment verification failed: ${err.message}`);
          }
        },
        prefill: {
          name: currentUser?.name ?? "",
          email: currentUser?.email ?? "",
          contact: currentUser?.phone ?? "9999999999",
          method: "upi",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: () => {
            console.log("Checkout closed");
          },
        },
        theme: {
          color: "#a855f7",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error(response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`)
    }
  }

  const handleUpdateProgress = async (courseId: string, progress: number) => {
    try {
      const res = await enrollmentsAPI.updateProgress({ courseId, progress })
      setToastMsg(`Progress updated! Certificate: ${res.certificateStatus}`)
      if (currentUser) {
        loadData(currentUser)
      }
    } catch (err: any) {
      alert(`Error updating progress: ${err.message}`)
    }
  }

  if (!currentUser) {
    return (
      <div
        className={`${theme} min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden`}
      >
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_5%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.12),transparent_28%)]" />
        <div className="relative w-full max-w-md rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] mb-4">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Nexus LMS</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in to manage your learning platform
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setLoginError(null)
              const data = new FormData(e.currentTarget)
              const email = data.get("email") as string
              const password = data.get("password") as string
              try {
                const res = await authAPI.login({ email, password })
                setCurrentUser(res.user)
                setActiveRole(res.user.role)
              } catch (err: any) {
                setLoginError(err.message || "Login failed")
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Email address
              </label>
              <input
                required
                name="email"
                type="email"
                placeholder="e.g. admin@nexus.dev"
                defaultValue="admin@nexus.dev"
                className="w-full rounded-2xl border border-border bg-secondary/80 px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                placeholder="••••••••"
                defaultValue="password"
                className="w-full rounded-2xl border border-border bg-secondary/80 px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>
            {loginError && (
              <div className="text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 p-3 rounded-2xl">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-secondary shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:bg-primary/90 transition duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-4">
              Quick Demo Logins
            </span>
            <div className="grid gap-2 grid-cols-3">
              <button
                onClick={async () => {
                  setLoginError(null)
                  try {
                    const res = await authAPI.login({
                      email: "admin@nexus.dev",
                      password: "password",
                    })
                    setCurrentUser(res.user)
                    setActiveRole("admin")
                  } catch (err: any) {
                    setLoginError(err.message)
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-primary/30 transition text-center cursor-pointer"
              >
                <span className="text-xs font-bold text-foreground">Admin</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">
                  Full Console
                </span>
              </button>
              <button
                onClick={async () => {
                  setLoginError(null)
                  try {
                    const res = await authAPI.login({
                      email: "instructor@nexus.dev",
                      password: "password",
                    })
                    setCurrentUser(res.user)
                    setActiveRole("instructor")
                  } catch (err: any) {
                    setLoginError(err.message)
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-primary/30 transition text-center cursor-pointer"
              >
                <span className="text-xs font-bold text-foreground">
                  Instructor
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5">
                  Add Courses
                </span>
              </button>
              <button
                onClick={async () => {
                  setLoginError(null)
                  try {
                    const res = await authAPI.login({
                      email: "student@nexus.dev",
                      password: "password",
                    })
                    setCurrentUser(res.user)
                    setActiveRole("student")
                  } catch (err: any) {
                    setLoginError(err.message)
                  }
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-primary/30 transition text-center cursor-pointer"
              >
                <span className="text-xs font-bold text-foreground">
                  Student
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5">
                  Buy & Watch
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-6 right-6">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl border border-border bg-card p-3 shadow-lg cursor-pointer"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    )
  }

  // Calculate dynamic dashboard stats
  const totalPaidRevenue = txData
    .filter((t) => t.status === "Paid" || t.status === "Success")
    .reduce((sum, t) => {
      const val = parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0
      return sum + val
    }, 0)
  const revenueStr = `$${(totalPaidRevenue / 1000).toFixed(1)}K`

  const totalPendingRevenue = txData
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => {
      const val = parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0
      return sum + val
    }, 0)
  const pendingStr = `$${(totalPendingRevenue / 1000).toFixed(1)}K`

  const totalRefunds = txData
    .filter((t) => t.status === "Refund" || t.status === "Refunded")
    .reduce((sum, t) => {
      const val = parseFloat(String(t.amount ?? "0").replace("$", "").replace(/,/g, "")) || 0
      return sum + val
    }, 0)
  const refundsStr = `$${(totalRefunds / 1000).toFixed(1)}K`

  const totalCouponUses = couponsData.reduce((sum, c) => sum + (c.uses || 0), 0)

  const dynamicStats: [string, string, string, string][] = [
    [
      "Total Users",
      usersListData.length.toString(),
      `Active: ${usersListData.filter((u) => u.status === "Active").length}`,
      "bg-primary",
    ],
    [
      "Total Courses",
      coursesList.length.toString(),
      "Published database",
      "bg-[#3B82F6]",
    ],
    [
      "Revenue",
      revenueStr,
      `Paid tx: ${txData.filter((t) => t.status === "Paid").length}`,
      "bg-[#22C55E]",
    ],
    [
      "Active Students",
      usersListData
        .filter((u) => u.role === "student" && u.status === "Active")
        .length.toString(),
      "Registered status",
      "bg-[#EAB308]",
    ],
    [
      "Refunded Tx",
      txData.filter((t) => t.status === "Refund").length.toString(),
      "Refund logs",
      "bg-[#EF4444]",
    ],
    [
      "Coupons Used",
      totalCouponUses.toString(),
      `Active coupons: ${couponsData.filter((c) => c.status !== "Expired").length}`,
      "bg-[#F97316]",
    ],
  ]

  const formattedPurchases = txData
    .slice(0, 4)
    .map((t) => [t.studentName, t.courseName, t.amount, t.date, t.status])


  // 1. Users Page Pagination
  const USERS_PER_PAGE = 10
  const paginatedUsers = usersListData.slice(
    (usersPageNum - 1) * USERS_PER_PAGE,
    usersPageNum * USERS_PER_PAGE
  )
  const formattedUsers = paginatedUsers.map((u: any) => [
    u.name || "N/A",
    u.email || "N/A",
    u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : "Student",
    u.joinedDate ||
    new Date(u.createdAt || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
    (u.purchasedCourseIds || []).length.toString(),
    u.status || "Active",
  ])

  // 2. Payments (Transactions) Page Pagination
  const PAYMENTS_PER_PAGE = 10
  const paginatedPayments = txData.slice(
    (paymentPage - 1) * PAYMENTS_PER_PAGE,
    paymentPage * PAYMENTS_PER_PAGE
  )
  const formattedTransactions = paginatedPayments.map((t: any) => [
    t._id || t.id || "TX-N/A",
    t.studentName || "N/A",
    t.courseName || "N/A",
    t.amount ? (t.amount.toString().startsWith("$") ? t.amount : `$${t.amount}`) : "$0",
    t.gateway || "Razorpay",
    t.date ||
    new Date(t.createdAt || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
    t.status || "Paid",
  ])

  // 3. Coupons Page Filtering & Pagination
  const filteredCoupons = couponsData.filter((c: any) => {
    const code = c.code || ""
    const type = c.type || "Percentage"
    const isExpired = c.expiry && new Date(c.expiry) < new Date()
    const status = isExpired ? "expired" : "active"
    const courseId = c.courseId || ""

    const matchesSearch = code.toUpperCase().includes(couponSearch.toUpperCase())
    const matchesType = couponTypeFilter === "all" || type.toLowerCase() === couponTypeFilter.toLowerCase()
    const matchesStatus = couponStatusFilter === "all" || status === couponStatusFilter
    const matchesCourse = couponCourseFilter === "all" || courseId.toString() === couponCourseFilter.toString()

    return matchesSearch && matchesType && matchesStatus && matchesCourse
  })
  
  const COUPONS_PER_PAGE = 10
  const paginatedCoupons = filteredCoupons.slice(
    (couponPageNum - 1) * COUPONS_PER_PAGE,
    couponPageNum * COUPONS_PER_PAGE
  )
  const formattedCoupons = paginatedCoupons.map((c: any) => [
    c.code || "N/A",
    c.type === "Percentage" ? `${c.discount || 0}%` : `$${c.discount || 0}`,
    c.type || "Percentage",
    c.maxUses ? `${c.uses || 0}/${c.maxUses}` : `${c.uses || 0}/Unlimited`,
    c.expiry ? new Date(c.expiry).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }) : "Never",
    c.expiry && new Date(c.expiry) < new Date() ? "Expired" : "Active",
  ])

  // 4. Enrollments Page Pagination
  const ENROLLMENTS_PER_PAGE = 10
  const paginatedEnrollments = enrollmentsData.slice(
    (enrollmentPageNum - 1) * ENROLLMENTS_PER_PAGE,
    enrollmentPageNum * ENROLLMENTS_PER_PAGE
  )
  const formattedEnrollments = paginatedEnrollments.map((e: any) => [
    e.studentName || "N/A",
    e.courseName || "N/A",
    e.enrollmentDate ||
    new Date(e.createdAt || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
    e.progress || "0%",
    e.certificateStatus || "In progress",
  ])

  const Dashboard =
    activeRole === "admin" ? (
      <AdminDashboard
        currentUser={currentUser}
        revenueStr={revenueStr}
        usersListData={usersListData}
        revenueData={revenueData}
        dynamicStats={dynamicStats}
        range={range}
        setRange={setRange}
        coursesList={coursesList}
        formattedPurchases={formattedPurchases}
      />
    ) : activeRole === "instructor" ? (
      <InstructorDashboard
        currentUser={currentUser}
        coursesList={coursesList}
        setActive={setActive}
        setShowCreateCourseModal={setShowCreateCourseModal}
      />
    ) : (
      <StudentDashboard
        currentUser={currentUser}
        coursesList={coursesList}
        purchasedCourseIds={purchasedCourseIds}
        myProgress={myProgress}
        setActive={setActive}
      />
    )

  const usersPageElement = (
    <UsersPage
      usersListData={usersListData}
      usersPageNum={usersPageNum}
      setUsersPageNum={setUsersPageNum}
      setSelectedUser={setSelectedUser}
      paginatedUsers={paginatedUsers}
      formattedUsers={formattedUsers}
      selectedUser={selectedUser}
      setToastMsg={setToastMsg}
      setUsersListData={setUsersListData}
    />
  )

  const coursesPageElement = (
    <CoursesPage
      coursesList={coursesList}
      coursesSubTab={coursesSubTab}
      setCoursesSubTab={setCoursesSubTab}
      purchasedCourseIds={purchasedCourseIds}
      activeRole={activeRole}
      coursePage={coursePage}
      setCoursePage={setCoursePage}
      setSelectedCourseDetailId={setSelectedCourseDetailId}
      handleBuyCourseClick={handleBuyCourseClick}
      setActive={setActive}
      setShowCreateCourseModal={setShowCreateCourseModal}
      selectedCourseDetailId={selectedCourseDetailId}
    />
  )

  const paymentsPageElement = (
    <PaymentsPage
      revenueStr={revenueStr}
      pendingStr={pendingStr}
      refundsStr={refundsStr}
      formattedTransactions={formattedTransactions}
      paymentPage={paymentPage}
      setPaymentPage={setPaymentPage}
      txData={txData}
    />
  )

  const couponsPageElement = (
    <CouponsPage
      setShowCreateCouponModal={setShowCreateCouponModal}
      couponSearch={couponSearch}
      setCouponSearch={setCouponSearch}
      couponTypeFilter={couponTypeFilter}
      setCouponTypeFilter={setCouponTypeFilter}
      couponStatusFilter={couponStatusFilter}
      setCouponStatusFilter={setCouponStatusFilter}
      couponCourseFilter={couponCourseFilter}
      setCouponCourseFilter={setCouponCourseFilter}
      coursesList={coursesList}
      formattedCoupons={formattedCoupons}
      couponPageNum={couponPageNum}
      setCouponPageNum={setCouponPageNum}
      filteredCoupons={filteredCoupons}
    />
  )

  const enrollmentsPageElement = (
    <EnrollmentsPage
      setShowGrantAccessModal={setShowGrantAccessModal}
      enrollmentsData={enrollmentsData}
      formattedEnrollments={formattedEnrollments}
      enrollmentPageNum={enrollmentPageNum}
      setEnrollmentPageNum={setEnrollmentPageNum}
    />
  )

  const analyticsPageElement = (
    <AnalyticsPage
      analyticsTab={analyticsTab}
      setAnalyticsTab={setAnalyticsTab}
      revenueData={revenueData}
    />
  )

  const settingsPageElement = (
    <SettingsPage />
  )

  const pages: Record<string, ReactNode> = {
    Dashboard,
    Users: usersPageElement,
    Courses: coursesPageElement,
    Payments: paymentsPageElement,
    Coupons: couponsPageElement,
    Enrollments: enrollmentsPageElement,
    Analytics: analyticsPageElement,
    Settings: settingsPageElement,
    Lectures: (
      <LecturesPage
        courses={coursesList}
        purchasedCourseIds={purchasedCourseIds}
        role={
          activeRole === "admin" || activeRole === "instructor"
            ? "admin"
            : "user"
        }
        onBuyCourse={handleBuyCourseClick}
        onUpdateProgress={handleUpdateProgress}
      />
    ),
    Profile: (
      <ProfilePage
        currentUser={currentUser!}
        coursesList={coursesList}
        myProgress={myProgress}
        onSelectPage={setActive}
        onSelectCourseDetail={(courseId) => {
          setSelectedCourseDetailId(courseId)
          setActive("Courses")
        }}
      />
    ),
  }

  const filteredNav = nav.filter(([name]) => {
    if (activeRole === "admin") return true
    return name === "Dashboard" || name === "Courses" || name === "Lectures" || name === "Profile"
  })

  return (
    <div className={`${theme} min-h-screen bg-background text-foreground`}>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_5%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.12),transparent_28%)]" />

      <aside
        className={`fixed z-40 h-full w-72 border-r border-border bg-background/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary text-white shadow-[0_0_30px_rgba(168,85,247,0.28)]">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="font-bold">Nexus LMS</p>
              <p className="text-xs text-muted-foreground">
                {activeRole === "admin"
                  ? "Admin console"
                  : activeRole === "instructor"
                    ? "Instructor space"
                    : "Student space"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 px-4">
          {filteredNav.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => {
                setActive(name)
                setMobileOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition cursor-pointer ${active === name ? "bg-card text-foreground shadow-[0_0_26px_rgba(168,85,247,0.12)]" : "text-muted-foreground hover:bg-card hover:text-foreground"}`}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-3xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={16} className="text-[#22C55E]" />
            {activeRole === "admin"
              ? "Enterprise plan"
              : activeRole === "instructor"
                ? "Instructor Tier"
                : "Student Member"}
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            {activeRole === "admin"
              ? "99.98% uptime · SSO ready · API keys secured"
              : activeRole === "instructor"
                ? "Unlimited students · HD Video hosting · Razorpay payout active"
                : "Unrestricted playback · Course certificates · Lifetime updates"}
          </p>
        </div>
      </aside>

      <main className="relative lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden cursor-pointer"
          >
            <Menu />
          </button>

          <SearchBar />

          <button className="rounded-2xl border border-border bg-card p-3 cursor-pointer">
            <Bell size={18} />
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl border border-border bg-card p-3 cursor-pointer"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card py-2 pl-2 pr-3 hover:bg-secondary/40 transition cursor-pointer"
            >
              <div className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-sm font-bold text-white">
                {currentUser.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </div>
              <span className="hidden text-sm font-medium sm:block">
                {currentUser.name}
              </span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>

            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-bold truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser.email}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {currentUser.role === "admin"
                        ? "Administrator"
                        : currentUser.role === "instructor"
                          ? "Instructor"
                          : "Student"}
                    </span>
                  </div>

                  {currentUser.role === "admin" && (
                    <div className="p-1 border-b border-border mb-1">
                      <span className="block px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Active Role View
                      </span>
                      <button
                        onClick={() => {
                          handleRoleSwitch("admin")
                          setProfileMenuOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs font-medium transition cursor-pointer ${activeRole === "admin" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                      >
                        <span>Admin Console</span>
                        {activeRole === "admin" && (
                          <div className="size-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          handleRoleSwitch("instructor")
                          setProfileMenuOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs font-medium transition cursor-pointer ${activeRole === "instructor" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                      >
                        <span>Instructor View</span>
                        {activeRole === "instructor" && (
                          <div className="size-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          handleRoleSwitch("student")
                          setProfileMenuOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs font-medium transition cursor-pointer ${activeRole === "student" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                      >
                        <span>Student View</span>
                        {activeRole === "student" && (
                          <div className="size-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      authAPI.logout()
                      setCurrentUser(null)
                      setProfileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8">{pages[active]}</div>
      </main>

      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCreateCourseModal(false)}
              className="absolute right-6 top-6 rounded-xl border border-border p-2 hover:bg-secondary text-muted-foreground hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-2xl font-bold">Create New Course</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details to publish or save your course.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                const name = data.get("name") as string
                const price = data.get("price") as string
                const status = data.get("status") as
                  | "Published"
                  | "Draft"
                  | "Review"
                const gradient = data.get("gradient") as string

                if (!name) return

                try {
                  const newCourse = await coursesAPI.create({
                    name,
                    price: price || "99",
                    status,
                    gradient,
                    description: `Learn the fundamentals and advanced frameworks of ${name}. Full curriculum structured inside.`,
                    curriculum: sampleCurriculum,
                  })

                  setCoursesList([newCourse, ...coursesList])
                  setShowCreateCourseModal(false)
                  setToastMsg(`Course "${name}" created successfully!`)
                } catch (err: any) {
                  alert(`Error creating course: ${err.message}`)
                }
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Course Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="e.g. Advanced TypeScript Architecture"
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Price (USD)
                  </label>
                  <input
                    required
                    name="price"
                    type="number"
                    min="0"
                    placeholder="99"
                    defaultValue="99"
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Gradient Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Purple-Blue", "from-purple-500 to-blue-500"],
                    ["Orange-Yellow", "from-orange-500 to-yellow-500"],
                    ["Emerald-Blue", "from-emerald-500 to-blue-500"],
                    ["Fuchsia-Purple", "from-fuchsia-500 to-purple-700"],
                  ].map(([label, grad]) => (
                    <label
                      key={grad}
                      className="flex items-center gap-3 rounded-2xl border border-border p-3 cursor-pointer hover:bg-secondary transition"
                    >
                      <input
                        required
                        type="radio"
                        name="gradient"
                        value={grad}
                        defaultChecked={grad === "from-purple-500 to-blue-500"}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-semibold block">
                          {label}
                        </span>
                        <div
                          className={`h-2.5 w-full rounded-full bg-linear-to-br ${grad} mt-1`}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="rounded-2xl border border-border px-5 py-3 text-sm font-medium hover:bg-secondary transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:bg-primary/90 transition cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCheckoutModal(null)}
              className="absolute right-6 top-6 rounded-xl border border-border p-2 hover:bg-secondary text-muted-foreground hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              
              <span className="text-xs font-mono font-bold text-primary uppercase">
                Secure Checkout
              </span>
            </div>

            <h2 className="text-xl font-bold">Enroll in Course</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete payment to instantly unlock this course curriculum.
            </p>

            <div className="mt-4 p-4 rounded-2xl border border-border bg-secondary/40 flex items-center gap-4">
              <div
                className={`h-12 w-20 rounded-xl bg-linear-to-br ${showCheckoutModal.gradient} shrink-0`}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm truncate text-white">
                  {showCheckoutModal.name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  by {showCheckoutModal.instructor}
                </span>
              </div>
              <strong className="text-lg font-bold text-white shrink-0">
                {appliedCoupon ? (
                  <>
                    <span className="line-through text-xs text-muted-foreground mr-1.5">
                      ${parseFloat(showCheckoutModal.price).toFixed(2)}
                    </span>
                    <span>${getDiscountedPrice(showCheckoutModal.price).toFixed(2)}</span>
                  </>
                ) : (
                  `$${parseFloat(showCheckoutModal.price).toFixed(2)}`
                )}
              </strong>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCompleteCheckout(
                  showCheckoutModal.id,
                  showCheckoutModal.name,
                )
              }}
              className="mt-5 space-y-3.5"
            >
              {/* Coupon Field */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SUMMER30"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 rounded-2xl border border-border bg-secondary/80 px-4 py-2 text-xs focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      setCouponError(null)
                      if (!couponCode) return
                      try {
                        const validated = await couponsAPI.validate(couponCode)
                        setAppliedCoupon(validated)
                        setToastMsg(
                          `Coupon "${couponCode}" applied successfully!`,
                        )
                      } catch (err: any) {
                        setCouponError(err.message || "Invalid coupon")
                        setAppliedCoupon(null)
                      }
                    }}
                    className="rounded-2xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <span className="text-[10px] text-[#EF4444] mt-1 block">
                    {couponError}
                  </span>
                )}
                {appliedCoupon && (
                  <span className="text-[10px] text-[#22C55E] mt-1 block">
                    ✓ Applied: {appliedCoupon.discount} off (
                    {appliedCoupon.type})
                  </span>
                )}
              </div>

              {/* Payment Method - Razorpay Only */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  You will be redirected to the secure Razorpay checkout gateway to complete your payment using UPI, Cards, Netbanking, or Wallets.
                </p>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(null)}
                  className="flex-1 rounded-2xl border border-border py-3 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-600 text-white font-semibold py-3 text-xs shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:bg-emerald-500 transition cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCreateCouponModal(false)}
              className="absolute right-6 top-6 rounded-xl border border-border p-2 hover:bg-secondary text-muted-foreground hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-2xl font-bold">Create Coupon</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure a new promotional code for marketing campaigns.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                const code = data.get("code") as string
                const discount = data.get("discount") as string
                const type = data.get("type") as "Percentage" | "Fixed"
                const maxUses = data.get("maxUses")
                  ? parseInt(data.get("maxUses") as string)
                  : undefined
                const expiry = data.get("expiry") as string

                if (!code || !discount) return

                try {
                  const newCoupon = await couponsAPI.create({
                    code: code.toUpperCase(),
                    discount,
                    type,
                    maxUses,
                    expiry: expiry || undefined,
                    status: "Active",
                  })
                  setCouponsData([newCoupon, ...couponsData])
                  setShowCreateCouponModal(false)
                  setToastMsg(`Coupon "${code}" created successfully!`)
                } catch (err: any) {
                  alert(`Error creating coupon: ${err.message}`)
                }
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Coupon Code
                </label>
                <input
                  required
                  name="code"
                  type="text"
                  placeholder="e.g. SUMMER50"
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden"
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Discount Value
                  </label>
                  <input
                    required
                    name="discount"
                    type="text"
                    placeholder="e.g. 50% or 25"
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Discount Type
                  </label>
                  <select
                    name="type"
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden cursor-pointer"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Max Uses (Optional)
                  </label>
                  <input
                    name="maxUses"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Expiry Date (Optional)
                  </label>
                  <input
                    name="expiry"
                    type="text"
                    placeholder="e.g. Jul 31"
                    className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCouponModal(false)}
                  className="rounded-2xl border border-border px-5 py-3 text-sm font-medium hover:bg-secondary transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary/90 transition cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGrantAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGrantAccessModal(false)}
              className="absolute right-6 top-6 rounded-xl border border-border p-2 hover:bg-secondary text-muted-foreground hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-2xl font-bold">Manual Enrollment Override</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Admin action to grant student immediate course access bypass.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                const studentEmail = data.get("studentEmail") as string
                const courseId = data.get("courseId") as string
                const course = coursesList.find((c) => c.id === courseId)

                if (!studentEmail || !courseId || !course) return

                try {
                  await enrollmentsAPI.grantAccess({
                    studentEmail,
                    courseId,
                    courseName: course.name,
                  })
                  setShowGrantAccessModal(false)
                  setToastMsg(
                    `Access granted to ${studentEmail} for "${course.name}"!`,
                  )
                  if (currentUser) {
                    const uList = await usersAPI.getAll()
                    setUsersListData(uList)
                    const enList = await enrollmentsAPI.getAll()
                    setEnrollmentsData(enList)
                  }
                } catch (err: any) {
                  alert(`Error granting access: ${err.message}`)
                }
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Student Email Address
                </label>
                <input
                  required
                  name="studentEmail"
                  type="email"
                  placeholder="student@nexus.dev"
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Target Course
                </label>
                <select
                  name="courseId"
                  className="w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm focus:outline-hidden cursor-pointer"
                >
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGrantAccessModal(false)}
                  className="rounded-2xl border border-border px-5 py-3 text-sm font-medium hover:bg-secondary transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-500 transition cursor-pointer"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-primary/20 bg-card/85 backdrop-blur-xl p-4 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex items-center gap-3 text-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="font-medium text-foreground">{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
