import type { IconComponent } from '@/types'

interface MenuCardProps {
  Icon: IconComponent
  title: string
  description: string
  onClick?: () => void
}

function MenuCard({ Icon, title, description, onClick }: MenuCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100/60">
        <Icon className="h-5 w-5 text-gray-900" />
      </span>
      <span>
        <span className="block text-[14px] font-bold text-gray-900">{title}</span>
        <span className="mt-0.5 block text-[12px] text-gray-500">{description}</span>
      </span>
    </button>
  )
}

export default MenuCard
