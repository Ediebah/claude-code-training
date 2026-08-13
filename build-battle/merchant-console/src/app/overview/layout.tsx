import { MetricsCards } from "@/components/ui/overview/MetricsCards"
import React from "react"
import { OverviewTabs } from "./tabs"

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-white dark:bg-gray-925">
      <div className="p-4 sm:p-6">
        <MetricsCards />
      </div>
      <OverviewTabs />
      {children}
    </div>
  )
}
