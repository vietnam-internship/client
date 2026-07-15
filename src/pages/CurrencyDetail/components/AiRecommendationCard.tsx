function AiRecommendationCard({ note }: { note: string }) {
  return (
    <section className="rounded-xl bg-[#fdf3e0] px-4 py-3">
      <h2 className="text-[13px] font-bold text-amber-800">✨ AI Recommendation</h2>
      <p className="mt-1.5 text-[13px] leading-[1.5] text-amber-800/80">{note}</p>
    </section>
  )
}

export default AiRecommendationCard
