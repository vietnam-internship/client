import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-primary text-white transition-opacity hover:opacity-90',
  secondary: 'border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-50',
} as const

interface ActionButtonProps {
  children: ReactNode
  variant?: keyof typeof VARIANTS
  /** Renders a Link when set, otherwise a button */
  to?: string
  onClick?: () => void
  className?: string
}

function ActionButton({
  children,
  variant = 'primary',
  to,
  onClick,
  className = '',
}: ActionButtonProps) {
  const classes = `flex h-12 w-full items-center justify-center rounded-xl text-[14px] font-bold ${VARIANTS[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={`cursor-pointer ${classes}`}>
      {children}
    </button>
  )
}

export default ActionButton
