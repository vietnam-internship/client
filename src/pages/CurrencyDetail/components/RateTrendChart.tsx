const WIDTH = 358
const HEIGHT = 90

function toPath(values: number[], min: number, spread: number): string {
  return values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * WIDTH
      const y = HEIGHT - 10 - ((value - min) / spread) * (HEIGHT - 24)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

interface RateTrendChartProps {
  points: number[]
  ma7Points?: number[]
}

function RateTrendChart({ points, ma7Points }: RateTrendChartProps) {
  const allValues = ma7Points ? [...points, ...ma7Points] : points
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const spread = max - min || 1

  const ratePath = toPath(points, min, spread)
  const maPath = ma7Points && ma7Points.length > 1 ? toPath(ma7Points, min, spread) : null

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-[90px] w-full"
        role="img"
        aria-label="7-day rate trend chart"
      >
        {maPath && (
          <polyline
            points={maPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 2"
          />
        )}
        <polyline
          points={ratePath}
          fill="none"
          stroke="#111827"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {maPath && (
        <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-[2px] w-4 rounded bg-gray-900" />
            Daily rate
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-[2px] w-4 rounded bg-blue-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#3b82f6 0,#3b82f6 4px,transparent 4px,transparent 6px)' }} />
            7-day MA
          </span>
        </div>
      )}
    </div>
  )
}

export default RateTrendChart
