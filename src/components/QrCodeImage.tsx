import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QrCodeImageProps {
  value: string
  size?: number
  className?: string
}

function QrCodeImage({ value, size = 176, className = '' }: QrCodeImageProps) {
  // 결과를 생성한 value/size와 함께 저장 — 둘 중 하나라도 바뀌면 자동으로 로딩 상태로 돌아감
  const [generated, setGenerated] = useState<{ value: string; size: number; src: string } | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(value, { width: size, margin: 1 })
      .then((src) => {
        if (!cancelled) setGenerated({ value, size, src })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [value, size])

  const src =
    generated !== null && generated.value === value && generated.size === size
      ? generated.src
      : null

  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`animate-pulse rounded-lg bg-gray-100 ${className}`}
      />
    )
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt="Reservation QR code"
      className={`rounded-lg ${className}`}
    />
  )
}

export default QrCodeImage
