import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'

interface QrCameraScannerProps {
  onDecode: (token: string) => void
  /** 스캔을 잠깐 멈춰야 할 때(조회 중 등) true로 준다 — 같은 QR을 연속으로 중복 디코드하는 것도 막는다. */
  paused?: boolean
}

function QrCameraScanner({ onDecode, paused = false }: QrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<QrScanner | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const scanner = new QrScanner(video, (result) => onDecode(result.data), {
      highlightScanRegion: true,
      highlightCodeOutline: true,
      preferredCamera: 'environment',
    })
    scannerRef.current = scanner

    scanner.start().catch(() => {
      setError('카메라를 사용할 수 없습니다. 브라우저 권한을 확인하거나 아래에 직접 입력해주세요.')
    })

    return () => {
      scanner.stop()
      scanner.destroy()
      scannerRef.current = null
    }
  }, [onDecode])

  useEffect(() => {
    if (paused) {
      scannerRef.current?.pause()
    } else {
      scannerRef.current?.start().catch(() => {})
    }
  }, [paused])

  if (error) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center gap-2 bg-gray-200 px-8 text-center">
        <span className="text-[12px] text-gray-700">{error}</span>
      </div>
    )
  }

  return <video ref={videoRef} className="h-[500px] w-full bg-black object-cover" muted playsInline />

}

export default QrCameraScanner
