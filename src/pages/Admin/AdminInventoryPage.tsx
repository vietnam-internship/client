import { useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import BranchSelect from '@/pages/Admin/components/BranchSelect'

const STOCK_ROWS = [
  { code: 'USD', amount: '$128,000', lowStock: false },
  { code: 'JPY', amount: '¥950,000', lowStock: true },
  { code: 'EUR', amount: '€64,200', lowStock: false },
  { code: 'CNY', amount: '¥210,000', lowStock: false },
  { code: 'TWD', amount: 'NT$88,000', lowStock: false },
]

function AdminInventoryPage() {
  const [branchId, setBranchId] = useState('incheon-t1')

  return (
    <AdminLayout active="inventory" title="Inventory" subtitle="Track and adjust currency stock">
      <div className="mt-10">
        <BranchSelect value={branchId} onChange={setBranchId} />
      </div>

      <ul className="mt-14">
        {STOCK_ROWS.map(({ code, amount, lowStock }) => (
          <li
            key={code}
            className="flex items-center justify-between border-t border-gray-200 py-6 pl-7 last:border-b"
          >
            <span className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-gray-900">{code}</span>
              {lowStock && (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] text-red-500">
                  Low stock
                </span>
              )}
            </span>
            <span className="flex items-baseline gap-3">
              <span className="text-[15px] font-bold text-gray-900">{amount}</span>
              <span className="text-[12px] text-gray-400">in stock</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-28 flex justify-end">
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

export default AdminInventoryPage
