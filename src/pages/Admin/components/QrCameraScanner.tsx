import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

interface QrCameraScannerProps {
  /** Called once per successful decode. Scanning pauses until the component remounts. */
  onScan: (value: string) => void
  onManualEntry: () => void
}

function messageFor(error: unknown): string {
  const name = error instanceof DOMException ? error.name : null
  switch (name) {
    case 'NotAllowedError':
      return '카메라 권한이 거부되어 있어요. 주소창의 카메라 아이콘(또는 자물쇠 아이콘 → 사이트 설정)에서 카메라를 "허용"으로 바꾼 뒤 다시 시도해주세요. 브라우저는 한 번 차단된 권한을 코드로 다시 물어보게 할 수 없어요 — 반드시 설정에서 직접 바꿔야 합니다.'
    case 'NotFoundError':
    case 'OverconstrainedError':
      return '사용 가능한 카메라를 찾지 못했어요. 카메라가 연결된 기기인지 확인해주세요.'
    case 'NotReadableError':
      return '다른 앱(화상회의 등)이 카메라를 쓰고 있어서 접근할 수 없어요. 다른 앱을 끄고 다시 시도해주세요.'
    default:
      return '카메라에 접근할 수 없어요. 권한을 확인하거나 아래에서 직접 입력해주세요.'
  }
}

/**
 * getUserMedia로 후면 카메라를 잡아 매 프레임을 캔버스에 그리고 jsQR로 디코딩한다.
 * 한 번 스캔되면 즉시 스트림을 멈춘다 — 같은 QR을 연속으로 여러 번 인식해 중복 조회하는 걸 막는다.
 */
function QrCameraScanner({ onScan, onManualEntry }: QrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const scannedRef = useRef(false)
  const stopRef = useRef<() => void>(() => {})
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    function stop() {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    stopRef.current = stop

    async function start() {
      setError(null)
      // 이미 차단된 상태라면 getUserMedia를 또 불러봤자 팝업 없이 바로 실패한다 — 브라우저가
      // "거부됨" 권한은 코드로 재요청하지 못하게 막기 때문(스팸성 재요청 방지 정책). 아직
      // 결정 안 된(prompt) 상태일 때만 실제로 물어보는 창이 뜬다. Permissions API를 지원하는
      // 브라우저에서는 이 차이를 미리 안내해준다 — Safari 등 미지원 브라우저는 그냥 바로 시도한다.
      try {
        const status = await navigator.permissions?.query({ name: 'camera' as PermissionName })
        if (status?.state === 'denied') {
          if (!cancelled) setError(messageFor(new DOMException('', 'NotAllowedError')))
          return
        }
      } catch {
        // Permissions API의 'camera' 이름을 지원하지 않는 브라우저(Safari 등) — 그냥 진행
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        tick()
      } catch (err) {
        if (!cancelled) setError(messageFor(err))
      }
    }

    function tick() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || scannedRef.current) return

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code?.data) {
            scannedRef.current = true
            stop()
            onScan(code.data)
            return
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    start()

    return () => {
      cancelled = true
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onScan은 매 렌더 새 참조라 의도적으로 뺌
  }, [attempt])

  const handleManualEntry = () => {
    // 카메라 획득이 아직 진행 중이었다면(권한 팝업 응답 대기 등) 먼저 멈추고 나서 수동 입력으로
    // 넘어간다 — 그래야 수동 입력을 눌렀는데 뒤늦게 카메라 권한 팝업이 뜨는 것처럼 보이는 걸 막는다.
    stopRef.current()
    onManualEntry()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        <video ref={videoRef} className="h-[500px] w-full object-cover" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-6 text-center">
            <p className="text-[13px] text-white">{error}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="cursor-pointer rounded-lg bg-white px-4 py-2 text-[12px] font-bold text-gray-900 hover:bg-gray-100"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleManualEntry}
        className="cursor-pointer text-[12px] text-gray-500 underline hover:text-gray-700"
      >
        Having trouble scanning? Enter token manually
      </button>
    </div>
  )
}

export default QrCameraScanner
