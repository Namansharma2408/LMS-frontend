import React from "react"
import { FileUp, Download, X } from "lucide-react"
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
      <Filters />
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
          rows={formattedUsers}
          onRowClick={(idx) => setSelectedUser(paginatedUsers[idx])}
        />
        <CustomPagination
          currentPage={usersPageNum}
          totalItems={usersListData.length}
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
