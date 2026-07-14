import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from './icons'

interface HeaderProps {
  backTo?: string
  right?: ReactNode
}

function Header({ backTo, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[46px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">
      <div className="flex items-center gap-2.5">
        {backTo && (
          <Link to={backTo} aria-label="Back" className="text-primary">
            <ArrowLeftIcon className="h-[22px] w-[22px]" />
          </Link>
        )}
        <Link to="/" className="text-[21px] font-extrabold tracking-tight text-primary">
          TravelX
        </Link>
      </div>
      {right}
    </header>
  )
}

export default Header
