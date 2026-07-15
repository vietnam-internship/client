import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from './icons'

interface HeaderProps {
  /** Path to navigate back to, or -1 to go back in history */
  backTo?: string | number
  right?: ReactNode
}

function Header({ backTo, right }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex h-[46px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">
      <div className="flex items-center gap-2.5">
        {typeof backTo === 'string' ? (
          <Link to={backTo} aria-label="Back" className="text-primary">
            <ArrowLeftIcon className="h-[22px] w-[22px]" />
          </Link>
        ) : (
          typeof backTo === 'number' && (
            <button
              type="button"
              aria-label="Back"
              onClick={() => navigate(backTo)}
              className="cursor-pointer text-primary"
            >
              <ArrowLeftIcon className="h-[22px] w-[22px]" />
            </button>
          )
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
