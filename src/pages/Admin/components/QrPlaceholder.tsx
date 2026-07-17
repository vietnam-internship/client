const GRID = [
  '11101101',
  '10010111',
  '11100100',
  '00111011',
  '10101101',
  '01010110',
  '11011010',
  '10110011',
]

const CELL = 11

function QrPlaceholder() {
  const size = GRID.length * CELL
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-[88px] w-[88px]"
      role="img"
      aria-label="Reservation QR code"
    >
      {GRID.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '1' ? (
            <rect
              key={`${x}-${y}`}
              x={x * CELL}
              y={y * CELL}
              width={CELL}
              height={CELL}
              fill="#111827"
            />
          ) : null,
        ),
      )}
    </svg>
  )
}

export default QrPlaceholder
