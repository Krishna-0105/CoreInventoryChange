import { useState, useEffect } from 'react'
import API from '../api/axios'
import KPICard from '../components/KPICard'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/dashboard')
        setStats(data)
      } catch (error) {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard</h1>
        <p className='text-gray-500 text-sm mt-1'>Overview of your inventory operations</p>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        <KPICard
          title='Total Products'
          value={stats?.totalProducts}
          icon={CubeIcon}
          color='bg-blue-500'
          subtitle='Active products in system'
        />
        <KPICard
          title='Low Stock Items'
          value={stats?.lowStockItems}
          icon={ExclamationTriangleIcon}
          color='bg-yellow-500'
          subtitle='Below reorder level'
        />
        <KPICard
          title='Out of Stock'
          value={stats?.outOfStockItems}
          icon={XCircleIcon}
          color='bg-red-500'
          subtitle='Needs immediate attention'
        />
        <KPICard
          title='Pending Receipts'
          value={stats?.pendingReceipts}
          icon={ArrowDownTrayIcon}
          color='bg-green-500'
          subtitle='Awaiting validation'
        />
        <KPICard
          title='Pending Deliveries'
          value={stats?.pendingDeliveries}
          icon={ArrowUpTrayIcon}
          color='bg-purple-500'
          subtitle='Awaiting validation'
        />
        <KPICard
          title='Pending Transfers'
          value={stats?.pendingTransfers}
          icon={ArrowsRightLeftIcon}
          color='bg-indigo-500'
          subtitle='Internal movements'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Low Stock Products */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <h2 className='text-base font-semibold text-gray-800 mb-4'>
            Low Stock Alerts
          </h2>
          {stats?.lowStockProducts?.length === 0 ? (
            <p className='text-gray-400 text-sm'>All products are well stocked!</p>
          ) : (
            <div className='space-y-3'>
              {stats?.lowStockProducts?.map((product) => (
                <div
                  key={product._id}
                  className='flex items-center justify-between py-2 border-b border-gray-50 last:border-0'
                >
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{product.name}</p>
                    <p className='text-xs text-gray-400'>{product.sku}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-red-500'>{product.currentStock}</p>
                    <p className='text-xs text-gray-400'>min: {product.reorderLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Movements */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <h2 className='text-base font-semibold text-gray-800 mb-4'>
            Recent Stock Movements
          </h2>
          {stats?.recentMovements?.length === 0 ? (
            <p className='text-gray-400 text-sm'>No recent movements</p>
          ) : (
            <div className='space-y-3'>
              {stats?.recentMovements?.map((movement) => (
                <div
                  key={movement._id}
                  className='flex items-center justify-between py-2 border-b border-gray-50 last:border-0'
                >
                  <div>
                    <p className='text-sm font-medium text-gray-800'>
                      {movement.product?.name}
                    </p>
                    <p className='text-xs text-gray-400'>{movement.referenceNumber}</p>
                  </div>
                  <div className='text-right'>
                    <StatusBadge status={movement.type} />
                    <p className={`text-sm font-bold mt-1 ${movement.quantityChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {movement.quantityChange >= 0 ? '+' : ''}{movement.quantityChange}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard