const PINS = [
  { x: 232, y: 128 },
  { x: 197, y: 250 },
  { x: 292, y: 333 },
  { x: 75, y: 370 },
]

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 9}, ${y - 22})`} fill="#9ca3af">
      <path d="M9 0a9 9 0 0 1 9 9c0 6.6-9 13.5-9 13.5S0 15.6 0 9a9 9 0 0 1 9-9Z" />
      <circle cx="9" cy="9" r="3.4" fill="white" />
    </g>
  )
}

function MapPlaceholder() {
  return (
    <svg viewBox="0 0 393 450" className="h-[450px] w-full" role="img" aria-label="Map">
      <rect width="393" height="450" fill="#e9e9e9" />
      {/* riverside area */}
      <path
        d="M393 230c-60 20-100 60-120 120-12 40-10 70-8 100h128z"
        fill="#d9d9d9"
      />
      {/* roads */}
      <g stroke="#ffffff" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M-20 160 220 -40" />
        <path d="M-30 340 320 30" />
        <path d="M60 480 400 140" />
        <path d="M-40 60 150 230" />
        <path d="M40 -30 330 280" />
        <path d="M180 470 90 320" />
      </g>
      <g stroke="#ffffff" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M240 470 350 330" />
        <path d="M-20 250 90 340" />
        <path d="M280 100 380 190" />
      </g>
      {PINS.map((pin) => (
        <Pin key={`${pin.x}-${pin.y}`} {...pin} />
      ))}
    </svg>
  )
}

export default MapPlaceholder
