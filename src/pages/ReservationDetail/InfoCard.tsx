import type { ReactNode } from 'react'

interface InfoCardProps {
  label: string
  children: ReactNode
  sub?: string
}

function InfoCard({ label, children, sub }: InfoCardProps) {
  return (
    <section className="rounded-xl bg-gray-100 px-4 py-3.5">
      <p className="text-[12px] text-gray-400">{label}</p>
      <div className="mt-1 text-[15px] font-bold text-gray-900">{children}</div>
      {sub && <p className="mt-1 text-[12px] text-gray-400">{sub}</p>}
    </section>
  )
}

export default InfoCard
