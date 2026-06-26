import React from "react"
import { Download } from "lucide-react"
import { Button, Panel, Header, Table } from "../components/ui/primitives"
import { CustomPagination } from "../components/ui/CustomPagination"

interface PaymentsPageProps {
  revenueStr: string
  pendingStr: string
  refundsStr: string
  formattedTransactions: string[][]
  paymentPage: number
  setPaymentPage: (p: number) => void
  txData: any[]
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  revenueStr,
  pendingStr,
  refundsStr,
  formattedTransactions,
  paymentPage,
  setPaymentPage,
  txData,
}) => {
  const PAYMENTS_PER_PAGE = 10

  return (
    <>
      <Header
        title="Payment management"
        text="Track transactions, invoices, subscriptions, pending transfers, and refunds."
        actions={
          <Button kind="ghost">
            <Download size={16} />
            Export report
          </Button>
        }
      />
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          `Revenue ${revenueStr}`,
          `Pending ${pendingStr}`,
          `Refunds ${refundsStr}`,
          "Subscriptions 0",
        ].map((x, i) => (
          <Panel key={x} className="p-5">
            <p className="text-sm text-muted-foreground">{x.split(" ")[0]}</p>
            <strong
              className={`mt-3 block text-2xl ${
                i === 2 ? "text-[#EF4444]" : ""
              }`}
            >
              {x.split(" ").slice(1).join(" ")}
            </strong>
          </Panel>
        ))}
      </section>
      <Panel className="p-5">
        <Table
          heads={[
            "Transaction ID",
            "User",
            "Course",
            "Amount",
            "Gateway",
            "Date",
            "Status",
          ]}
          rows={formattedTransactions}
        />
        <CustomPagination
          currentPage={paymentPage}
          totalItems={txData.length}
          itemsPerPage={PAYMENTS_PER_PAGE}
          onPageChange={setPaymentPage}
        />
      </Panel>
    </>
  )
}
