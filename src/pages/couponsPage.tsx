import React from "react"
import { Plus } from "lucide-react"
import { Button, Panel, Header, Table } from "../components/ui/primitives"
import { CustomPagination } from "../components/ui/CustomPagination"
import type { Course } from "../data/coursesData"

interface CouponsPageProps {
  setShowCreateCouponModal: (show: boolean) => void
  couponSearch: string
  setCouponSearch: (s: string) => void
  couponTypeFilter: string
  setCouponTypeFilter: (t: string) => void
  couponStatusFilter: string
  setCouponStatusFilter: (s: string) => void
  couponCourseFilter: string
  setCouponCourseFilter: (c: string) => void
  coursesList: Course[]
  formattedCoupons: string[][]
  couponPageNum: number
  setCouponPageNum: (p: number) => void
  filteredCoupons: any[]
}

export const CouponsPage: React.FC<CouponsPageProps> = ({
  setShowCreateCouponModal,
  couponSearch,
  setCouponSearch,
  couponTypeFilter,
  setCouponTypeFilter,
  couponStatusFilter,
  setCouponStatusFilter,
  couponCourseFilter,
  setCouponCourseFilter,
  coursesList,
  formattedCoupons,
  couponPageNum,
  setCouponPageNum,
  filteredCoupons,
}) => {
  const COUPONS_PER_PAGE = 10

  return (
    <>
      <Header
        title="Coupon management"
        text="Create marketing promotions with usage, expiry, and course targeting controls."
        actions={
          <Button onClick={() => setShowCreateCouponModal(true)}>
            <Plus size={16} />
            Create coupon
          </Button>
        }
      />
      <Panel className="mb-6 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Search Code
            </label>
            <input
              type="text"
              placeholder="e.g. WELCOME10"
              value={couponSearch}
              onChange={(e) => {
                setCouponSearch(e.target.value)
                setCouponPageNum(1)
              }}
              className="w-full rounded-xl border border-border bg-secondary p-3 text-sm text-black/90 dark:text-white placeholder-muted-foreground focus:outline-hidden focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Discount Type
            </label>
            <select
              value={couponTypeFilter}
              onChange={(e) => {
                setCouponTypeFilter(e.target.value)
                setCouponPageNum(1)
              }}
              className="w-full rounded-xl border border-border bg-secondary p-3 text-sm text-black/90 dark:text-white focus:outline-hidden focus:border-primary transition"
            >
              <option value="all">All Types</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Flat / Fixed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Coupon Status
            </label>
            <select
              value={couponStatusFilter}
              onChange={(e) => {
                setCouponStatusFilter(e.target.value)
                setCouponPageNum(1)
              }}
              className="w-full rounded-xl border border-border bg-secondary p-3 text-sm text-black/90 dark:text-white focus:outline-hidden focus:border-primary transition"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Course Targeted
            </label>
            <select
              value={couponCourseFilter}
              onChange={(e) => {
                setCouponCourseFilter(e.target.value)
                setCouponPageNum(1)
              }}
              className="w-full rounded-xl border border-border bg-secondary p-3 text-sm text-black/90 dark:text-white focus:outline-hidden focus:border-primary transition"
            >
              <option value="all">All Courses</option>
              {coursesList.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Panel>
      <Panel className="p-5">
        <Table
          heads={["Code", "Discount", "Type", "Usage", "Expiry", "Status"]}
          rows={formattedCoupons}
        />
        <CustomPagination
          currentPage={couponPageNum}
          totalItems={filteredCoupons.length}
          itemsPerPage={COUPONS_PER_PAGE}
          onPageChange={setCouponPageNum}
        />
      </Panel>
    </>
  )
}
