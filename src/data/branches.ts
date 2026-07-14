export interface Branch {
  id: string
  name: string
  distance: string
  address: string
  openUntil: string
  feeNote: string
  listRate: string
  rates: { code: string; rate: string }[]
  hours: { label: string; time: string }[]
}

export const BRANCHES: Branch[] = [
  {
    id: 'myeongdong',
    name: 'TravelX Myeongdong',
    distance: '250m',
    address: '26-28 Myeongdong-gil, Jung-gu, Seoul',
    openUntil: 'Open until 21:00',
    feeNote: 'No fee under $500',
    listRate: '1,342.10',
    rates: [
      { code: 'USD', rate: '1,342.10' },
      { code: 'JPY (100)', rate: '892.10' },
      { code: 'EUR', rate: '1,449.80' },
    ],
    hours: [
      { label: 'Mon - Fri', time: '09:00 - 21:00' },
      { label: 'Sat - Sun', time: '10:00 - 18:00' },
    ],
  },
  {
    id: 'gangnam',
    name: 'Gangnam branch',
    distance: '5.4 km',
    address: '152 Teheran-ro, Gangnam-gu, Seoul',
    openUntil: 'Open until 20:00',
    feeNote: 'No fee under $300',
    listRate: '1,343.20',
    rates: [
      { code: 'USD', rate: '1,343.20' },
      { code: 'JPY (100)', rate: '893.40' },
      { code: 'EUR', rate: '1,450.60' },
    ],
    hours: [
      { label: 'Mon - Fri', time: '09:00 - 20:00' },
      { label: 'Sat - Sun', time: '10:00 - 17:00' },
    ],
  },
  {
    id: 'incheon-t1',
    name: 'Incheon Airport T1',
    distance: '10 km',
    address: '272 Gonghang-ro, Jung-gu, Incheon',
    openUntil: 'Open until 22:00',
    feeNote: 'No fee under $500',
    listRate: '1,354.50',
    rates: [
      { code: 'USD', rate: '1,354.50' },
      { code: 'JPY (100)', rate: '898.90' },
      { code: 'EUR', rate: '1,458.20' },
    ],
    hours: [
      { label: 'Mon - Fri', time: '06:00 - 22:00' },
      { label: 'Sat - Sun', time: '06:00 - 22:00' },
    ],
  },
  {
    id: 'travelx-airport',
    name: 'TravelX Airport',
    distance: '8 km',
    address: '221 Haneul-gil, Gangseo-gu, Seoul',
    openUntil: 'Open until 21:30',
    feeNote: 'No fee under $500',
    listRate: '1,358.50',
    rates: [
      { code: 'USD', rate: '1,358.50' },
      { code: 'JPY (100)', rate: '900.10' },
      { code: 'EUR', rate: '1,461.00' },
    ],
    hours: [
      { label: 'Mon - Fri', time: '07:00 - 21:30' },
      { label: 'Sat - Sun', time: '08:00 - 20:00' },
    ],
  },
]

export function findBranch(id: string | undefined) {
  return BRANCHES.find((branch) => branch.id === id)
}
