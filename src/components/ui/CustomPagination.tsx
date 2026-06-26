import React from "react"

interface CustomPaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  if (totalPages <= 1) return null

  const startItem = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)
  const endItem = Math.min(totalItems, currentPage * itemsPerPage)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-secondary/30 p-4 rounded-2xl border border-border/40">
      <p className="text-sm text-muted-foreground">
        Showing <strong className="text-white">{startItem}</strong> to{" "}
        <strong className="text-white">{endItem}</strong> of{" "}
        <strong className="text-white">{totalItems}</strong> records
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs text-white hover:bg-secondary hover:border-primary disabled:opacity-40 disabled:hover:bg-card disabled:hover:border-border transition cursor-pointer"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            Math.abs(pageNum - currentPage) <= 1
          ) {
            return (
              <button
                key={idx}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-white hover:border-primary"
                }`}
              >
                {pageNum}
              </button>
            )
          } else if (
            pageNum === 2 ||
            pageNum === totalPages - 1
          ) {
            return (
              <span key={idx} className="px-1 text-muted-foreground text-xs">
                ...
              </span>
            )
          }
          return null
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs text-white hover:bg-secondary hover:border-primary disabled:opacity-40 disabled:hover:bg-card disabled:hover:border-border transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}
