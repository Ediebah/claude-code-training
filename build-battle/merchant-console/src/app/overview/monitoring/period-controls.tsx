"use client"

import { Button } from "@/components/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { SlidersHorizontal } from "lucide-react"

export function PeriodControls() {
  return (
    <div className="flex flex-col items-center justify-between gap-2 p-6 sm:flex-row">
      <Select defaultValue="12-weeks">
        <SelectTrigger className="py-1.5 sm:w-44">
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="4-weeks">Last 4 weeks</SelectItem>
          <SelectItem value="8-weeks">Last 8 weeks</SelectItem>
          <SelectItem value="12-weeks">Last 12 weeks</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="secondary"
        className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
      >
        <SlidersHorizontal
          className="-ml-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-600"
          aria-hidden="true"
        />
        Report filters
      </Button>
    </div>
  )
}
