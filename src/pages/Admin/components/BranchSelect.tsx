import { useEffect, useState } from 'react'
import { listBranches } from '@/api/branch'
import type { BranchSummary } from '@/types'

interface BranchSelectProps {
  value: string
  onChange: (id: string) => void
}

function BranchSelect({ value, onChange }: BranchSelectProps) {
  const [branches, setBranches] = useState<BranchSummary[]>([])

  useEffect(() => {
    let cancelled = false
    listBranches()
      .then((result) => {
        if (!cancelled) setBranches(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <label className="flex h-12 w-full items-center gap-2 rounded-lg border border-gray-200 px-4">
      <span aria-hidden="true" className="text-[13px]">
        📍
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer bg-transparent text-[14px] text-gray-700 focus:outline-none"
      >
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export default BranchSelect
