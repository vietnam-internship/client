interface AiReportCardProps {
  title: string
  body: string
}

function AiReportCard({ title, body }: AiReportCardProps) {
  return (
    <section className="rounded-xl bg-slate-100 px-4 py-3.5">
      <h2 className="text-[20px] leading-snug font-bold text-primary">{title}</h2>
      <p className="mt-1.5 text-[14px] leading-[1.45] text-gray-800">{body}</p>
    </section>
  )
}

export default AiReportCard
