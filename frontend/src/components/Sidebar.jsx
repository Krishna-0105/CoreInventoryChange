import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  CubeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
  { name: 'Receipts', path: '/receipts', icon: ArrowDownTrayIcon },
  { name: 'Deliveries', path: '/deliveries', icon: ArrowUpTrayIcon },
  { name: 'Transfers', path: '/transfers', icon: ArrowsRightLeftIcon },
  { name: 'Adjustments', path: '/adjustments', icon: AdjustmentsHorizontalIcon },
]

const Sidebar = () => {
  const { user, logout } = useAuth()

  return (
    <div className='flex flex-col h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 z-10'>
      {/* Logo */}
      <div className='flex items-center gap-2 px-6 py-5 border-b border-gray-700'>
        <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm'>
          CI
        </div>
        <span className='text-lg font-semibold'>CoreInventory</span>
      </div>

      {/* Nav Links */}
      <nav className='flex-1 px-3 py-4 space-y-1'>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className='w-5 h-5' />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className='px-4 py-4 border-t border-gray-700'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold'>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className='text-sm font-medium'>{user?.name}</p>
            <p className='text-xs text-gray-400 capitalize'>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className='w-full text-left text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar