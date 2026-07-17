import { useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'

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

function AdminSettingsPage() {
  const [openMeridiem, setOpenMeridiem] = useState<Meridiem>('AM')
  const [closeMeridiem, setCloseMeridiem] = useState<Meridiem>('PM')

  return (
    <AdminLayout
      active="settings"
      title="Exchange Shop Information"
      subtitle="Track and adjust currency stock"
    >
      <div className="mt-24 border-t border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Name</span>
          <input type="text" placeholder="previous name" className={`${INPUT_CLASS} w-[360px]`} />
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Location</span>
          <div className="flex gap-5">
            <input type="text" placeholder="Latitude" className={`${INPUT_CLASS} w-[170px]`} />
            <input type="text" placeholder="Longitude" className={`${INPUT_CLASS} w-[170px]`} />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Open Time</span>
          <div className="flex gap-4">
            <input type="text" placeholder="previous time" className={`${INPUT_CLASS} w-[170px]`} />
            <MeridiemToggle value={openMeridiem} onChange={setOpenMeridiem} />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">Close Time</span>
          <div className="flex gap-4">
            <input type="text" placeholder="previous time" className={`${INPUT_CLASS} w-[170px]`} />
            <MeridiemToggle value={closeMeridiem} onChange={setCloseMeridiem} />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 py-6 pl-7">
          <span className="text-[15px] font-bold text-gray-900">
            Available Reservation per One Time Slot
          </span>
          <input type="text" placeholder="previous value" className={`${INPUT_CLASS} w-[360px]`} />
        </div>
      </div>

      <div className="mt-24 flex justify-end">
        <button
          type="button"
          className="h-12 w-[300px] cursor-pointer rounded-lg bg-primary text-[16px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Adjust stock
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminSettingsPage
