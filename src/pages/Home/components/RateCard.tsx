import type { Rate } from '@/types'

function RateCard({ code, name, value, change }: Rate) {
  return (
    <li className="rounded-xl bg-gray-100 px-4 py-2.5 leading-[1.3]">
      <p className="text-[13px] font-bold text-gray-900">{code}</p>
      <p className="text-[11px] text-gray-400">{name}</p>
      <p className="mt-1 text-[18px] font-bold text-gray-900">
        {value}
        <span className="ml-1.5 align-[2px] text-[11px] font-medium text-red-500">{change}</span>
      </p>
    </li>
  )
}

export default RateCard
