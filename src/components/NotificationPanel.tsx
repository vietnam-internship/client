import type { IconComponent, Notification } from '@/types'
import { ClockIcon, MapPinIcon, TrendDownIcon } from './icons'

const ICONS: Record<Notification['icon'], IconComponent> = {
  trend: TrendDownIcon,
  clock: ClockIcon,
  pin: MapPinIcon,
}

interface NotificationPanelProps {
  notifications: Notification[]
  onClose: () => void
}

function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} aria-hidden="true" />
      <section className="absolute top-[50px] right-3 z-30 w-[272px] rounded-2xl bg-white shadow-[0_10px_40px_rgba(15,23,42,0.18)]">
        <h2 className="border-b border-gray-100 px-5 py-3.5 text-[15px] font-bold text-gray-900">
          Notification
        </h2>
        <ul className="px-5 py-2">
          {notifications.map(({ icon, title, description }) => {
            const Icon = ICONS[icon]
            return (
              <li key={title} className="flex items-start gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100/60">
                  <Icon className="h-[18px] w-[18px] text-blue-800" />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">{title}</p>
                  <p className="mt-0.5 text-[13px] leading-[1.45] text-gray-500">{description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

export default NotificationPanel
