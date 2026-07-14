interface ReservationNumberCardProps {
  number: string
  className?: string
}

function ReservationNumberCard({ number, className = '' }: ReservationNumberCardProps) {
  return (
    <section className={`rounded-xl bg-gray-100 py-4 text-center ${className}`}>
      <p className="text-[12px] text-gray-400">Reservation number</p>
      <p className="mt-1 text-[17px] font-bold text-gray-900">{number}</p>
    </section>
  )
}

export default ReservationNumberCard
