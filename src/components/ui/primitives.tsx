import {  type ReactNode } from "react"
import {
  ChevronDown,
  MoreHorizontal,
  Search,
} from "lucide-react"

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
                  className={`py-4 ${j > 0 ? "text-muted-foreground" : "text-black dark:text-white"}`}
                >
                  {j === 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-secondary font-semibold text-black dark:text-white">
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