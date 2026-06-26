import React from "react"
import { Panel, Header } from "../components/ui/primitives"

export const SettingsPage: React.FC = () => {
  return (
    <>
      <Header
        title="Settings"
        text="Configure general settings, payment gateways, emails, storage, security, roles, and API keys."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "General",
          "Payment Gateways",
          "Email Templates",
          "Storage",
          "Security",
          "Roles & Permissions",
          "API Keys",
        ].map((x) => (
          <Panel key={x} className="p-5">
            <h3 className="font-bold">{x}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Production-ready configuration controls for {x.toLowerCase()}.
            </p>
          </Panel>
        ))}
      </div>
    </>
  )
}
