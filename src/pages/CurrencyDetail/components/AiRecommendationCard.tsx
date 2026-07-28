import type { TimingRecommendation } from '@/api/currency'

const SIGNAL_NOTE: Record<TimingRecommendation['signal'], string> = {
  NOW: 'Rates have been trending favorably over the past 7 days. Now looks like a good time to exchange.',
  WAIT: 'The rate trend suggests it may be worth waiting a few days for a better rate.',
  NEUTRAL: 'Rates are relatively stable this week. Consider exchanging if you have an upcoming trip.',
  COLLECTING_DATA: '',
}

function AiRecommendationCard({ recommendation }: { recommendation: TimingRecommendation }) {
  const note = SIGNAL_NOTE[recommendation.signal]

  return (
    <section className="rounded-xl bg-[#fdf3e0] px-4 py-3">
      <h2 className="text-[13px] font-bold text-amber-800">✨ AI Recommendation</h2>
      <p className="mt-1.5 text-[13px] leading-[1.5] text-amber-800/80">{note}</p>
    </section>
  )
}

export default AiRecommendationCard
