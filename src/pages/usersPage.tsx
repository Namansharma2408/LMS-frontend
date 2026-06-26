import React from "react"
import { FileUp, Download, X, Search, ChevronDown } from "lucide-react"
import { Badge, Button, Panel, Header, Table, Filters } from "../components/ui/primitives"
import { CustomPagination } from "../components/ui/CustomPagination"
import { usersAPI } from "../services/api"

interface UsersPageProps {
  usersListData: any[]
  usersPageNum: number
  setUsersPageNum: (p: number) => void
  setSelectedUser: (u: any) => void
  paginatedUsers: any[]
  formattedUsers: string[][]
  selectedUser: any
  setUsersListData: (list: any[]) => void
  setToastMsg: (msg: string) => void
}

export const UsersPage: React.FC<UsersPageProps> = ({
  usersListData,
  usersPageNum,
  setUsersPageNum,
  setSelectedUser,
  paginatedUsers,
  formattedUsers,
  selectedUser,
  setToastMsg,
  setUsersListData,
}) => {
  const USERS_PER_PAGE = 10
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredUsers = React.useMemo(() => {
    return usersListData.filter((u: any) => {
      const name = u.name || ""
      const email = u.email || ""
      const role = u.role || "student"
      const status = u.status || "Active"

      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || role.toLowerCase() === roleFilter.toLowerCase()
      const matchesStatus = statusFilter === "all" || status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [usersListData, searchTerm, roleFilter, statusFilter])

  const localPaginatedUsers = React.useMemo(() => {
    return filteredUsers.slice(
      (usersPageNum - 1) * USERS_PER_PAGE,
      usersPageNum * USERS_PER_PAGE
    )
  }, [filteredUsers, usersPageNum])

  const localFormattedUsers = React.useMemo(() => {
    return localPaginatedUsers.map((u: any) => [
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
  }, [localPaginatedUsers])

  return (
    <>
      <Header
        title="Users management"
        text="Manage students, instructors, admins, activity, and access status."
        actions={
          <>
            <Button kind="ghost">
              <FileUp size={16} />
              Import
            </Button>
            <Button kind="ghost">
              <Download size={16} />
              Export CSV
            </Button>
          </>
        }
      />
      <Panel className="mb-6 grid gap-3 p-3 md:grid-cols-[1fr_150px_150px_180px]">
        <div className="flex items-center gap-2 rounded-[14px] border border-border bg-secondary px-3">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search records"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setUsersPageNum(1)
            }}
            className="w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground text-black dark:text-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            setUsersPageNum(1)
          }}
          className="rounded-[14px] border border-border bg-secondary px-3 py-3 text-sm text-black/90 dark:text-white focus:outline-hidden focus:border-primary transition cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat', paddingRight: '2rem' }}
        >
          <option value="all">Role (All)</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setUsersPageNum(1)
          }}
          className="rounded-[14px] border border-border bg-secondary px-3 py-3 text-sm text-black/90 dark:text-white focus:outline-hidden focus:border-primary transition cursor-pointer appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23737373' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat', paddingRight: '2rem' }}
        >
          <option value="all">Status (All)</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
        <div className="flex items-center justify-between rounded-[14px] border border-border bg-secondary px-3 py-3 text-sm text-muted-foreground opacity-60">
          <span>Registration date</span>
          <ChevronDown size={15} />
        </div>
      </Panel>
      <Panel className="p-5">
        <Table
          heads={[
            "Name",
            "Email",
            "Role",
            "Joined Date",
            "Purchases",
            "Status",
          ]}
          rows={localFormattedUsers}
          onRowClick={(idx) => setSelectedUser(localPaginatedUsers[idx])}
        />
        <CustomPagination
          currentPage={usersPageNum}
          totalItems={filteredUsers.length}
          itemsPerPage={USERS_PER_PAGE}
          onPageChange={setUsersPageNum}
        />
      </Panel>

      {/* Selected User details drawer */}
      {selectedUser && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-[#0A0A0A] p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-250">
          <button
            onClick={() => setSelectedUser(null)}
            className="float-right cursor-pointer p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-black dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
          <h2 className="text-2xl font-bold mt-4">{selectedUser.name}</h2>
          <p className="text-muted-foreground text-sm">
            {(selectedUser.role || "student").charAt(0).toUpperCase() +
              (selectedUser.role || "student").slice(1)}{" "}
            · {selectedUser.email}
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Account Management</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Current Status:
              </span>
              <Badge tone={selectedUser.status === "Active" ? "green" : "red"}>
                {selectedUser.status || "Active"}
              </Badge>
            </div>
            <div className="mt-4">
              <button
                onClick={async () => {
                  const newStatus =
                    selectedUser.status === "Active" ? "Suspended" : "Active"
                  try {
                    await usersAPI.updateStatus(selectedUser._id, newStatus)
                    setToastMsg(
                      `User ${selectedUser.name} status updated to ${newStatus}!`,
                    )
                    setSelectedUser({ ...selectedUser, status: newStatus })
                    const updatedUsers = await usersAPI.getAll()
                    setUsersListData(updatedUsers)
                  } catch (err: any) {
                    alert(`Error updating user status: ${err.message}`)
                  }
                }}
                className="w-full text-center rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-sm text-black dark:text-white py-2 font-medium cursor-pointer transition"
              >
                {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
