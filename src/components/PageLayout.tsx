import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className={`mx-auto flex w-full max-w-[393px] flex-1 flex-col bg-white ${className}`}>
      {children}
    </div>
  )
}

export default PageLayout
