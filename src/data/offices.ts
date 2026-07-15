import type { PickupOffice } from '@/types'
import { findById } from '@/utils/collection'
import { findBranch } from './branches'

export const PICKUP_OFFICES: PickupOffice[] = [
  {
    id: 'downtown',
    name: 'Downtown Branch',
    openUntil: 'Open until 19:00',
    rate: '5.7480원',
    locationDetail: '1F, Main hall, TravelX booth',
  },
  {
    id: 'riverside',
    name: 'Riverside Branch',
    openUntil: 'Open until 18:00',
    rate: '5.7469원',
    locationDetail: '2F, Lobby, TravelX booth',
  },
  {
    id: 'airport-office',
    name: 'Airport Office',
    openUntil: 'Open until 22:00',
    rate: '5.7480원',
    locationDetail: '3F, Departure hall, TravelX booth',
  },
]

/** Resolve a reservable pickup location from an office or branch id. */
export function findPickupLocation(id: string | undefined) {
  const office = findById(PICKUP_OFFICES, id)
  if (office) return { name: office.name, detail: office.locationDetail }

  const branch = findBranch(id)
  if (branch) return { name: branch.name, detail: branch.boothDetail }

  return undefined
}
