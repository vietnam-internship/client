export const formatNumber = (value: number) => Math.round(value).toLocaleString('en-US')

export const parseAmount = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0
