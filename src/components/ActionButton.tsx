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
  disabled?: boolean
}

function ActionButton({
  children,
  variant = 'primary',
  to,
  onClick,
  className = '',
  disabled = false,
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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer ${classes} disabled:cursor-default disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

export default ActionButton
