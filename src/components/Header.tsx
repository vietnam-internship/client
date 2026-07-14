import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  right?: ReactNode
}

function Header({ right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[46px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4">
      <Link to="/" className="text-[21px] font-extrabold tracking-tight text-primary">
        TravelX
      </Link>
      {right}
    </header>
  )
}

export default Header
