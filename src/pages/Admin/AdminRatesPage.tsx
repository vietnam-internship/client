import { useEffect, useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import BranchSelect from '@/pages/Admin/components/BranchSelect'
import { adminGetRates, adminUpdateRates } from '@/api/admin'
import type { AdminRateRow } from '@/types'

const BRANCH_ID = 1 // TODO(follow-up): map BranchSelect's string id to a real numeric branch id

function AdminRatesPage() {
  const [branchId, setBranchId] = useState('incheon-t1')
  const [rows, setRows] = useState<AdminRateRow[]>([])

  useEffect(() => {
    adminGetRates(BRANCH_ID).then(setRows).catch(() => setRows([]))
  }, [])

  const updateFee = (currencyCode: string, feePercent: number) => {
    setRows((prev) => prev.map((r) => (r.currencyCode === currencyCode ? { ...r, feePercent } : r)))
  }

  const handleSave = async () => {
    const updated = await adminUpdateRates(
      BRANCH_ID,
      rows.map((r) => ({ currencyCode: r.currencyCode, feePercent: r.feePercent })),
    )
    setRows(updated)
  }

  return (
    <AdminLayout active="rates" title="Exchange Rates" subtitle="Set today's buy/sell rates by branch">
      <div className="mt-10">
        <BranchSelect value={branchId} onChange={setBranchId} />
      </div>

      <ul className="mt-2">
        {rows.map(({ currencyCode, buyRate, sellRate, feePercent }) => (
          <li key={currencyCode} className="flex items-center justify-between border-t border-gray-200 py-8 pl-7">
            <span className="text-[17px] font-bold text-gray-900">{currencyCode}</span>
            <div className="flex gap-9">
              <label className="flex flex-col items-center gap-2">
                <span className="text-[12px] text-gray-400">Buy</span>
                <input
                  type="text"
                  value={buyRate ?? ''}
                  disabled
                  className="h-10 w-[122px] rounded-md border border-gray-200 bg-gray-50 text-center text-[13px] text-gray-500"
                />
              </label>
              <label className="flex flex-col items-center gap-2">
                <span className="text-[12px] text-gray-400">Sell</span>
                <input
                  type="text"
                  value={sellRate ?? ''}
                  disabled
                  className="h-10 w-[122px] rounded-md border border-gray-200 bg-gray-50 text-center text-[13px] text-gray-500"
                />
              </label>
              <label className="flex flex-col items-center gap-2">
                <span className="text-[12px] text-gray-400">Fee</span>
                <input
                  type="number"
                  value={feePercent}
                  onChange={(e) => updateFee(currencyCode, Number(e.target.value))}
                  className="h-10 w-[122px] rounded-md border border-gray-200 text-center text-[13px] text-gray-900 focus:border-primary focus:outline-none"
                />
              </label>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex justify-end border-t border-gray-200 pt-10">
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

export default AdminRatesPage
