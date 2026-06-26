import React from "react"
import { Plus } from "lucide-react"
import { Button, Panel, Header, Table } from "../components/ui/primitives"
import { CustomPagination } from "../components/ui/CustomPagination"

interface EnrollmentsPageProps {
  setShowGrantAccessModal: (show: boolean) => void
  enrollmentsData: any[]
  formattedEnrollments: string[][]
  enrollmentPageNum: number
  setEnrollmentPageNum: (p: number) => void
}

export const EnrollmentsPage: React.FC<EnrollmentsPageProps> = ({
  setShowGrantAccessModal,
  enrollmentsData,
  formattedEnrollments,
  enrollmentPageNum,
  setEnrollmentPageNum,
}) => {
  const ENROLLMENTS_PER_PAGE = 10

  return (
    <>
      <Header
        title="Student enrollments"
        text="Grant manually, restrict, track progress percentages, and configure certification statuses."
        actions={
          <Button onClick={() => setShowGrantAccessModal(true)}>
            <Plus size={16} />
            Grant manual access
          </Button>
        }
      />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          `Active enrollments ${enrollmentsData.length}`,
          `Certificates issued ${enrollmentsData.filter((e) => e.certificateStatus === "Issued").length}`,
          `Average progress ${enrollmentsData.length ? Math.round(enrollmentsData.reduce((sum, e) => sum + (parseInt(String(e.progress).replace("%", "")) || 0), 0) / enrollmentsData.length) : 0}%`,
        ].map((x) => (
          <Panel key={x} className="p-5">
            <p className="text-sm text-muted-foreground">
              {x.split(" ")[0]} {x.split(" ")[1]}
            </p>
            <strong className="mt-3 block text-2xl">
              {x.split(" ").slice(2).join(" ")}
            </strong>
          </Panel>
        ))}
      </section>
      <Panel className="p-5">
        <Table
          heads={[
            "Student",
            "Course",
            "Enrollment Date",
            "Progress",
            "Certificate Status",
          ]}
          rows={formattedEnrollments}
        />
        <CustomPagination
          currentPage={enrollmentPageNum}
          totalItems={enrollmentsData.length}
          itemsPerPage={ENROLLMENTS_PER_PAGE}
          onPageChange={setEnrollmentPageNum}
        />
      </Panel>
    </>
  )
}
