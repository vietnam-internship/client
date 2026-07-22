/** Mock rate: 100 VND = 5.79 KRW */
export const KRW_PER_100_VND = 5.79

/**
 * 예약 화면 표시용 통화 정보. 백엔드에 통화별 실시간 환율 API가 아직 없어서, 실제 환율
 * 계산은 통화 선택과 무관하게 항상 KRW_PER_100_VND 비율을 그대로 쓴다 — 정확한 금액이
 * 아니라 표시용 라벨(국기/이름)만 통화 선택에 따라 바뀐다.
 */
export const CURRENCY_INFO: Record<string, { flag: string; label: string }> = {
  VND: { flag: '🇻🇳', label: 'Vietnamese dong' },
  USD: { flag: '🇺🇸', label: 'US dollar' },
}

export const DEFAULT_RESERVATION_CURRENCY = 'VND'
