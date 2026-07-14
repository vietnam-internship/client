import { useState } from 'react'

/** Mock rate: 100 VND = 5.79 KRW */
const KRW_PER_100_VND = 5.79

const formatNumber = (value: number) => Math.round(value).toLocaleString('en-US')

const parseAmount = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0

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
