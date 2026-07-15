import { useState } from 'react'
import { KRW_PER_100_VND } from '@/constants/exchange'
import { formatNumber, parseAmount } from '@/utils/format'

function useCurrencyConverter() {
  const [swapped, setSwapped] = useState(false)
  const [input, setInput] = useState('')

  const amount = parseAmount(input)
  // The editable field is the VND amount by default, KRW when swapped
  const krw = swapped ? amount : (amount * KRW_PER_100_VND) / 100
  const vnd = swapped ? (amount * 100) / KRW_PER_100_VND : amount

  const toggleSwapped = () => setSwapped((s) => !s)

  const handleAmountChange = (value: string) => {
    const parsed = parseAmount(value)
    setInput(parsed ? formatNumber(parsed) : '')
  }

  return {
    input,
    swapped,
    toggleSwapped,
    handleAmountChange,
    krw: formatNumber(krw),
    vnd: formatNumber(vnd),
  }
}

export default useCurrencyConverter
