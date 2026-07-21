export const formatNumber = (value: number) => Math.round(value).toLocaleString('en-US')

export const parseAmount = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0

// 환율 표시용 — VND처럼 1 미만인 값은 소수 4자리, 그 외는 2자리까지
export const formatRate = (value: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  })
