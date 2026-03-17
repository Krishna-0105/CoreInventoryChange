import { useState, useEffect } from 'react'
import API from '../api/axios'
import KPICard from '../components/KPICard'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import LowStockChart from '../components/LowStockChart'
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
  CurrencyRupeeIcon, // ✅ ADD THIS
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

    useEffect(() => {
  const fetchData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        API.get('/dashboard'),
        API.get('/products'),
      ])

      setStats(statsRes.data)
      setProducts(productsRes.data)

    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])
  const lowStockProducts = products.filter(
  (product) => product.currentStock < product.reorderLevel
);
const outOfStockProducts = products.filter(
  (product) => product.currentStock === 0
);
const totalInventoryValue = products.reduce((total, product) => {
  const price = Number(product.price) || 0;
  const stock = Number(product.currentStock) || 0;
  return total + (price * stock);
}, 0);
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your inventory operations
          </p>
        </div>

        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium">
          Inventory Overview
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12'>
        <KPICard
          title='Total Products'
          value={products.length}
          icon={CubeIcon}
          color='bg-blue-500'
          subtitle='Active products in system'
        />
        <KPICard
  title='Total Inventory Value'
  value={`₹${totalInventoryValue.toLocaleString('en-IN')}`}
  icon={CurrencyRupeeIcon}
  color='bg-green-600'
  subtitle='Total stock worth'
/>
        <KPICard
          title='Low Stock Items'
          value={lowStockProducts.length}
          icon={ExclamationTriangleIcon}
          color='bg-yellow-500'
          subtitle='Below reorder level'
        />
        <KPICard
          title='Out of Stock'
          value={outOfStockProducts.length}
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
      <div className="border-t border-gray-200 mb-8"></div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Low Stock Products */}
        <div className='bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100 p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Low Stock Alerts
          </h2>
          {lowStockProducts.length === 0 ? (
  <p className='text-gray-400 text-sm'>All products are well stocked!</p>
) : (
  <div className='space-y-4'>
    {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className='flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-md transition'
                >
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{product.name}</p>
                    <p className='text-xs text-gray-400'>{product.sku}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-red-500'>{product.currentStock}</p>
                    <p className='text-xs text-gray-400'>min: {product.reorderLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Movements */}
        <div className='bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100 p-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            Recent Stock Movements
          </h2>
          {stats?.recentMovements?.length === 0 ? (
            <p className='text-gray-400 text-sm'>No recent movements</p>
          ) : (
            <div className='space-y-4'>
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
                    <p className={`text-base font-bold mt-1 ${movement.quantityChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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