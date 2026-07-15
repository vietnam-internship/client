interface PickupCardProps {
  title: string
  schedule: string
}

function PickupCard({ title, schedule }: PickupCardProps) {
  return (
    <section className="rounded-xl bg-slate-100 px-4 py-3">
      <h2 className="text-[19px] leading-tight font-bold text-primary">{title}</h2>
      <p className="mt-1 text-[12px] whitespace-nowrap text-gray-700">{schedule}</p>
    </section>
  )
}

export default PickupCard
