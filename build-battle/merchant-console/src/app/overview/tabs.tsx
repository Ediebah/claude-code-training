"use client"

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Summary", href: "/overview" },
  { name: "Monitoring", href: "/overview/monitoring" },
  { name: "Merchants", href: "/overview/merchants" },
]

export function OverviewTabs() {
  const pathname = usePathname()
  return (
    <TabNavigation className="mt-6 gap-x-4 px-4 sm:px-6">
      {navigation.map((item) => (
        <TabNavigationLink
          key={item.name}
          asChild
          active={pathname === item.href}
        >
          <Link href={item.href}>{item.name}</Link>
        </TabNavigationLink>
      ))}
    </TabNavigation>
  )
}
