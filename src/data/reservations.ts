import type { Reservation } from '@/types'
import { findById } from '@/utils/collection'

export const RESERVATIONS: Reservation[] = [
  {
    id: 'tx-20240501',
    reservationNumber: 'TX-20240501',
    location: 'Incheon Airport T1',
    locationDetail: '3F, Gate G, TravelX booth',
    dateTime: 'Oct 24, 2026 · 2:30 PM',
    fromAmount: '250,000 KRW',
    toAmount: '5,000,000 VND',
    status: 'active',
  },
  {
    id: 'tx-20240502',
    reservationNumber: 'TX-20240502',
    location: 'Incheon Airport T2',
    locationDetail: '1F, Arrival hall, TravelX booth',
    dateTime: 'Nov 1, 2026 · 9:15 AM',
    fromAmount: '1,600,000 KRW',
    toAmount: '1,200 EUR',
    status: 'active',
  },
  {
    id: 'tx-20240455',
    reservationNumber: 'TX-20240455',
    location: 'Gimpo Airport',
    locationDetail: '2F, Departure hall, TravelX booth',
    dateTime: 'Sep 15, 2026 · 10:00 AM',
    fromAmount: '400,000 KRW',
    toAmount: '300 USD',
    status: 'completed',
  },
  {
    id: 'tx-20240321',
    reservationNumber: 'TX-20240321',
    location: 'Incheon Airport T1',
    locationDetail: '3F, Gate G, TravelX booth',
    dateTime: 'May 3, 2026 · 11:20 AM',
    fromAmount: '800,000 KRW',
    toAmount: '600 USD',
    status: 'completed',
  },
  {
    id: 'tx-20240218',
    reservationNumber: 'TX-20240218',
    location: 'Jeju International Airport',
    locationDetail: '3F, Departure hall, TravelX booth',
    dateTime: 'Feb 18, 2026 · 1:10 PM',
    fromAmount: '350,000 KRW',
    toAmount: '28,000 THB',
    status: 'completed',
  },
  {
    id: 'tx-20240104',
    reservationNumber: 'TX-20240104',
    location: 'Gimpo Airport',
    locationDetail: '2F, Departure hall, TravelX booth',
    dateTime: 'Jan 4, 2026 · 4:40 PM',
    fromAmount: '200,000 KRW',
    toAmount: '150 USD',
    status: 'cancelled',
  },
]

export function findReservation(id: string | undefined) {
  return findById(RESERVATIONS, id)
}
