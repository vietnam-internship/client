import { useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import BranchSelect from '@/pages/Admin/components/BranchSelect'

const RATE_ROWS = [
  { code: 'USD', buy: '1,324.50', sell: '1,348.20', fee: '1.5%' },
  { code: 'JPY', buy: '950.00', sell: '966.20', fee: '3%' },
  { code: 'KRW', buy: '1,324.50', sell: '1,348.20', fee: '1.5%' },
  { code: 'EUR', buy: '1983.70', sell: '2001.32', fee: '3%' },
]

const FIELDS = ['buy', 'sell', 'fee'] as const

const FIELD_LABELS = { buy: 'Buy', sell: 'Sell', fee: 'Fee' } as const

function AdminRatesPage() {
  const [branchId, setBranchId] = useState('incheon-t1')

  return (
    <AdminLayout
      active="rates"
      title="Exchange Rates"
      subtitle="Set today's buy/sell rates by branch"
    >
      <div className="mt-10">
        <BranchSelect value={branchId} onChange={setBranchId} />
      </div>

      <p className="mt-6 text-[17px] font-bold text-gray-900">
        VND <span aria-hidden="true">→</span>
      </p>

      <ul className="mt-2">
        {RATE_ROWS.map(({ code, ...defaults }) => (
          <li
            key={code}
            className="flex items-center justify-between border-t border-gray-200 py-8 pl-7"
          >
            <span className="text-[17px] font-bold text-gray-900">{code}</span>
            <div className="flex gap-9">
              {FIELDS.map((field) => (
                <label key={field} className="flex flex-col items-center gap-2">
                  <span className="text-[12px] text-gray-400">{FIELD_LABELS[field]}</span>
                  <input
                    type="text"
                    defaultValue={defaults[field]}
                    className="h-10 w-[122px] rounded-md border border-gray-200 text-center text-[13px] text-gray-900 focus:border-primary focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex justify-end border-t border-gray-200 pt-10">
        <button
          type="button"
          className="h-12 w-[300px] cursor-pointer rounded-lg bg-primary text-[16px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Save changes
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminRatesPage
