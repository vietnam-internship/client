interface ProfileCardProps {
  title: string
  email: string
  className?: string
}

function ProfileCard({ title, email, className = '' }: ProfileCardProps) {
  return (
    <section className={`flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3.5 ${className}`}>
      <span className="h-9 w-9 shrink-0 rounded-full bg-blue-200" />
      <div>
        <p className="text-[14px] font-bold text-gray-900">{title}</p>
        <p className="text-[13px] text-gray-600">{email}</p>
      </div>
    </section>
  )
}

export default ProfileCard
