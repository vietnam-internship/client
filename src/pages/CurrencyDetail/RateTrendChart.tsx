const WIDTH = 358
const HEIGHT = 90

function RateTrendChart({ points }: { points: number[] }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const spread = max - min || 1

  const path = points
    .map((value, i) => {
      const x = (i / (points.length - 1)) * WIDTH
      const y = HEIGHT - 10 - ((value - min) / spread) * (HEIGHT - 24)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="h-[90px] w-full text-primary"
      role="img"
      aria-label="7-day rate trend chart"
    >
      <polyline
        points={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default RateTrendChart
