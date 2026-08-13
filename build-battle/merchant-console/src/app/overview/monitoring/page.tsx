import {
  authorizationByWeek,
  countAndVolumeByWeek,
  disputeRateByWeek,
  volumeByWeek,
} from "@/data/analytics"
import {
  AuthorizationMix,
  CountAndVolume,
  DisputeRate,
  VolumeByWeek,
} from "./charts"
import { PeriodControls } from "./period-controls"

export default function MonitoringPage() {
  const volume = volumeByWeek(12)
  const counts = countAndVolumeByWeek(12)
  const authorization = authorizationByWeek(12)
  const disputes = disputeRateByWeek(12)

  return (
    <section aria-label="Payment monitoring">
      <PeriodControls />

      <dl className="grid grid-cols-1 gap-x-14 gap-y-10 border-t border-gray-200 p-6 md:grid-cols-2 dark:border-gray-800">
        <Panel
          title="Captured volume"
          description="Weekly captured volume against the same span in the previous period"
        >
          <VolumeByWeek data={volume} />
        </Panel>

        <Panel
          title="Payments to volume"
          description="How payment count tracks against the money actually captured"
        >
          <CountAndVolume data={counts} />
        </Panel>

        <Panel
          title="Authorization mix"
          description="Share of attempted payments that were approved rather than failed"
        >
          <AuthorizationMix data={authorization} />
        </Panel>

        <Panel
          title="Dispute rate"
          description="Share of payments that ended in a dispute, by week"
        >
          <DisputeRate data={disputes} />
        </Panel>
      </dl>
    </section>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between p-0">
      <div>
        <dt className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </dt>
        <dd className="mt-0.5 text-sm/6 text-gray-500 dark:text-gray-500">
          {description}
        </dd>
      </div>
      {children}
    </div>
  )
}
