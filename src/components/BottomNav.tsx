import { useNavigate } from 'react-router-dom'
import { ExchangeIcon, HomeIcon, MapPinIcon, ProfileIcon } from './icons'

const TABS = [
  { key: 'home', label: 'Home', Icon: HomeIcon, to: '/' },
  { key: 'maps', label: 'Maps', Icon: MapPinIcon, to: '/maps' },
  { key: 'exchange', label: 'Exchange', Icon: ExchangeIcon, to: null },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon, to: '/mypage' },
] as const

export type TabKey = (typeof TABS)[number]['key']

interface BottomNavProps {
  active: TabKey
}

function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-[393px] -translate-x-1/2 grid-cols-4 border-t border-gray-200 bg-white pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
      {TABS.map(({ key, label, Icon, to }) => (
        <button
          key={key}
          type="button"
          onClick={() => to && navigate(to)}
          className={`flex cursor-pointer flex-col items-center gap-1 ${
            active === key ? 'text-primary' : 'text-gray-300'
          }`}
        >
          <Icon className="h-6 w-6" />
          <span className="text-[11px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
