import { useEffect, useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import { getBranch } from '@/api/branch'
import { adminUpdateBranchSettings } from '@/api/admin'
import type { BranchDetail } from '@/types'

type Meridiem = 'AM' | 'PM'

interface TimeFieldProps {
  value: Meridiem
  onChange: (value: Meridiem) => void
}

function MeridiemToggle({ value, onChange }: TimeFieldProps) {
  return (
    <>
      {(['AM', 'PM'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`h-11 w-[62px] cursor-pointer rounded-lg border text-[14px] font-bold transition-colors ${
            value === option
              ? 'border-primary bg-primary text-white'
              : 'border-blue-300 bg-white text-gray-900 hover:bg-blue-50'
          }`}
        >
          {option}
        </button>
      ))}
    </>
  )
}

const INPUT_CLASS =
  'h-11 rounded-lg border border-blue-300 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none'

const BRANCH_ID = 1 // TODO(follow-up): read the signed-in BRANCH_ADMIN's own branch once that flow exists

function to24Hour(time: string, meridiem: Meridiem): string {
  const [hourStr, minuteStr] = time.split(':')
  let hour = Number(hourStr) % 12
  if (meridiem === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${minuteStr ?? '00'}`
}

function AdminSettingsPage() {
  const [branch, setBranch] = useState<BranchDetail | null>(null)
  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [openTime, setOpenTime] = useState('')
  const [openMeridiem, setOpenMeridiem] = useState<Meridiem>('AM')
  const [closeTime, setCloseTime] = useState('')
  const [closeMeridiem, setCloseMeridiem] = useState<Meridiem>('PM')
  const [slotCapacity, setSlotCapacity] = useState('')

  useEffect(() => {
    getBranch(BRANCH_ID).then((detail) => {
      setBranch(detail)
      setLatitude(String(detail.latitude))
      setLongitude(String(detail.longitude))
      setSlotCapacity(String(detail.timeSlotCapacity))
    })
  }, [])

  const handleSave = async () => {
    await adminUpdateBranchSettings(BRANCH_ID, {
      name: name || undefined,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      openTime: openTime ? to24Hour(openTime, openMeridiem) : undefined,
      closeTime: closeTime ? to24Hour(closeTime, closeMeridiem) : undefined,
      timeSlotCapacity: slotCapacity ? Number(slotCapacity) : undefined,
    })
  }

  return (
    <AdminLayout
      active="settings"
      title="Exchange Shop Information"
      subtitle="Track and adjust currency stock"
    >
      <div className="mt-24 border-t border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={branch?.name ?? 'previous name'}
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Location</span>
          <div className="flex gap-5">
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
              className={`${INPUT_CLASS} w-[170px]`}
            />
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              className={`${INPUT_CLASS} w-[170px]`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Open Time</span>
          <div className="flex gap-4">
            <input
              type="text"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              placeholder="previous time"
              className={`${INPUT_CLASS} w-[170px]`}
            />
            <MeridiemToggle value={openMeridiem} onChange={setOpenMeridiem} />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Close Time</span>
          <div className="flex gap-4">
            <input
              type="text"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              placeholder="previous time"
              className={`${INPUT_CLASS} w-[170px]`}
            />
            <MeridiemToggle value={closeMeridiem} onChange={setCloseMeridiem} />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">
            Available Reservation per One Time Slot
          </span>
          <input
            type="text"
            value={slotCapacity}
            onChange={(e) => setSlotCapacity(e.target.value)}
            placeholder="previous value"
            className={`${INPUT_CLASS} w-[360px]`}
          />
        </div>
      </div>

      <div className="mt-24 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="h-12 w-[300px] cursor-pointer rounded-lg bg-primary text-[16px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Save changes
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminSettingsPage
