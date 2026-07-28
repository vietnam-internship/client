import { useEffect, useState } from 'react'
import AdminLayout from '@/pages/Admin/components/AdminLayout'
import BranchSelect from '@/pages/Admin/components/BranchSelect'
import { adminGetInventory, adminUpdateInventory } from '@/api/admin'
import type { AdminInventoryRow } from '@/types'

const BRANCH_ID = 1 // TODO(follow-up): map BranchSelect's string id to a real numeric branch id

function AdminInventoryPage() {
  const [branchId, setBranchId] = useState('incheon-t1')
  const [rows, setRows] = useState<AdminInventoryRow[]>([])

  useEffect(() => {
    adminGetInventory(BRANCH_ID).then(setRows).catch(() => setRows([]))
  }, [])

  const updateStock = (currencyCode: string, stock: number) => {
    setRows((prev) => prev.map((r) => (r.currencyCode === currencyCode ? { ...r, stock } : r)))
  }

  const handleSave = async () => {
    const updated = await adminUpdateInventory(
      BRANCH_ID,
      rows.map((r) => ({ currencyCode: r.currencyCode, stock: r.stock })),
    )
    setRows(updated)
  }

  return (
    <AdminLayout active="inventory" title="Inventory" subtitle="Track and adjust currency stock">
      <div className="mt-10">
        <BranchSelect value={branchId} onChange={setBranchId} />
      </div>

      <ul className="mt-14">
        {rows.map(({ currencyCode, stock, lowStock }) => (
          <li
            key={currencyCode}
            className="flex items-center justify-between border-t border-gray-200 py-6 pl-7 last:border-b"
          >
            <span className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-gray-900">{currencyCode}</span>
              {lowStock && (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] text-red-500">Low stock</span>
              )}
            </span>
            <span className="flex items-baseline gap-3">
              <input
                type="number"
                value={stock}
                onChange={(e) => updateStock(currencyCode, Number(e.target.value))}
                className="h-9 w-[140px] rounded-md border border-gray-200 text-right text-[15px] font-bold text-gray-900 focus:border-primary focus:outline-none"
              />
              <span className="text-[12px] text-gray-400">in stock</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-28 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="h-12 w-[300px] cursor-pointer rounded-lg bg-primary text-[16px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Adjust stock
        </button>
      </div>
    </AdminLayout>
  )
}

export default AdminInventoryPage
