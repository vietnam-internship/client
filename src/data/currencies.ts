export interface Currency {
  code: string
  name: string
  pair: string
  rate: string
  change: string
  range: string
  aiNote: string
  trend: number[]
}

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    pair: 'USD / KRW',
    rate: '1,342.50',
    change: '+1.20 (0.09%)',
    range: '1,340.0 - 1,355.0',
    aiNote:
      'Rates have been trending down over the past 7 days. Now looks like a good time to exchange.',
    trend: [1349, 1347, 1343.5, 1340, 1341.5, 1345, 1344, 1348],
  },
  {
    code: 'JPY',
    name: 'Japanese yen',
    pair: 'JPY (100¥) / KRW',
    rate: '894.20',
    change: '-0.15 (0.02%)',
    range: '892.0 - 901.5',
    aiNote:
      'JPY is 3.2% stronger against KRW than its 30-day average. Rates like this have historically lasted 2-4 days before reversing.',
    trend: [901, 899, 897, 895, 893, 892.5, 894, 894.2],
  },
  {
    code: 'EUR',
    name: 'Euro',
    pair: 'EUR / KRW',
    rate: '1,452.12',
    change: '-0.00 (0.00%)',
    range: '1,448.0 - 1,460.3',
    aiNote:
      'EUR has been stable this week. Consider exchanging in smaller amounts to average your rate.',
    trend: [1455, 1453, 1450, 1448, 1451, 1454, 1452, 1452.1],
  },
  {
    code: 'VND',
    name: 'Vietnames dong',
    pair: 'VND / KRW',
    rate: '0.0532',
    change: '+0.0002 (0.38%)',
    range: '0.0528 - 0.0536',
    aiNote:
      'VND rates peak around holiday travel seasons. Booking a pickup early can lock in the current rate.',
    trend: [0.0529, 0.053, 0.0531, 0.0533, 0.0532, 0.0534, 0.0531, 0.0532],
  },
]

export function findCurrency(code: string | undefined) {
  return CURRENCIES.find(
    (currency) => currency.code.toLowerCase() === code?.toLowerCase(),
  )
}
