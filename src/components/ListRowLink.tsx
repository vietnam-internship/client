import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ListRowLinkProps {
  to: string
  title: string
  subtitle: string
  right: ReactNode
  onClick?: () => void
  /** Extra classes for the row, e.g. vertical padding */
  className?: string
}

function ListRowLink({ to, title, subtitle, right, onClick, className = '' }: ListRowLinkProps) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center justify-between border-b border-gray-100 transition-colors hover:bg-gray-50 ${className}`}
      >
        <span>
          <span className="block text-[13px] font-bold text-gray-900">{title}</span>
          <span className="block text-[11px] text-gray-400">{subtitle}</span>
        </span>
        {right}
      </Link>
    </li>
  )
}

export default ListRowLink
