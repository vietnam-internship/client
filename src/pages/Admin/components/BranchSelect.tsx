import { BRANCHES } from '@/data/branches'

interface BranchSelectProps {
  value: string
  onChange: (id: string) => void
}

function BranchSelect({ value, onChange }: BranchSelectProps) {
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
        {BRANCHES.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export default BranchSelect
