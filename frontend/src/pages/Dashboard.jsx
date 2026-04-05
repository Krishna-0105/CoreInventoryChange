import { useState, useEffect, useMemo, useRef } from 'react'
import API from '../api/axios'
import KPICard from '../components/KPICard'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import LowStockChart from '../components/LowStockChart'
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  XCircleIcon,
  CurrencyRupeeIcon,
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [stats, setStats] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes, notifRes] = await Promise.all([
  API.get('/dashboard'),
  API.get('/products'),
  API.get('/notifications'),
])

        setStats(statsRes.data || {})
        setProducts(productsRes.data || [])
        setNotifications(notifRes.data || [])
      } catch (error) {
        console.error(error)
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🔥 Derived Data
  const lowStockProducts = useMemo(() => {
  return products.filter(
    (p) => p.currentStock <= p.reorderLevel
  )
}, [products])
  //     useEffect(() => {
  // if (hasRun.current) return
  // hasRun.current = true

  // if (lowStockProducts.length > 0) {

    useEffect(() => {
  if (products.length === 0) return
  if (lowStockProducts.length === 0) return


          const notified = JSON.parse(localStorage.getItem('notifiedProducts')) || []

          const newNotifications = []

          lowStockProducts.forEach((p) => {
            if (!notified.includes(p._id)) {
              toast.error(`${p.name} is low on stock!`)
              notified.push(p._id)

              // 🔥 ADD TO NOTIFICATION PANEL
              newNotifications.push({
                id: p._id, // 🔥 FIX
                message: `${p.name} is low on stock`,
                time: new Date().toLocaleTimeString(),
                read: false, // 🔥 NEW
              })
            }
          })

          if (newNotifications.length > 0) {
            setNotifications((prev) => {
      const existingIds = prev.map((n) => n.id)

      const filtered = newNotifications.filter(
        (n) => !existingIds.includes(n.id)
      )

      return [...filtered, ...prev]
    })
          }

          localStorage.setItem('notifiedProducts', JSON.stringify(notified))
        
      }, [products])

  

  useEffect(() => {
    const notified = JSON.parse(localStorage.getItem('notifiedProducts')) || []

    const updated = notified.filter((id) =>
      lowStockProducts.some((p) => p._id === id)
    )

    localStorage.setItem('notifiedProducts', JSON.stringify(updated))
  }, [lowStockProducts])


  const outOfStockProducts = products.filter(
    (p) => p.currentStock === 0
  )

  const totalInventoryValue = products.reduce((total, p) => {
    const price = Number(p.price) || 0
    const stock = Number(p.currentStock) || 0
    return total + price * stock
  }, 0)

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your inventory operations
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            🔔

            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Notifications</h3>

                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400">No notifications</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n._id || n.productId}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item._id === n._id ? { ...item, read: true } : item
                          )
                        )
                      }
                      className={`text-sm border-b pb-2 cursor-pointer ${n.read ? 'text-gray-400' : 'font-medium'
                        }`}
                    >
                      <p>{n.message}</p>
                      <p className="text-xs text-gray-400">
  {n.createdAt
    ? new Date(n.createdAt).toLocaleTimeString()
    : ''}
</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
          value={stats.pendingReceipts || 0}
          icon={ArrowDownTrayIcon}
          color='bg-green-500'
          subtitle='Awaiting validation'
        />

        <KPICard
          title='Pending Deliveries'
          value={stats.pendingDeliveries || 0}
          icon={ArrowUpTrayIcon}
          color='bg-purple-500'
          subtitle='Awaiting validation'
        />

        <KPICard
          title='Pending Transfers'
          value={stats.pendingTransfers || 0}
          icon={ArrowsRightLeftIcon}
          color='bg-indigo-500'
          subtitle='Internal movements'
        />
      </div>

      <div className="border-t border-gray-200 mb-8"></div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Low Stock Alerts */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>
            Low Stock Alerts
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className='text-gray-400 text-sm'>
              All products are well stocked!
            </p>
          ) : (
            <div className='space-y-4'>
              {lowStockProducts.map((p) => (
                <div key={p._id} className='flex justify-between'>
                  <div>
                    <p className='text-sm font-medium'>{p.name}</p>
                    <p className='text-xs text-gray-400'>{p.sku}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-red-500 font-bold'>
                      {p.currentStock}
                    </p>
                    <p className='text-xs text-gray-400'>
                      min: {p.reorderLevel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Movements */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4'>
            Recent Stock Movements
          </h2>

          {stats?.recentMovements?.length === 0 ? (
            <p className='text-gray-400 text-sm'>
              No recent movements
            </p>
          ) : (
            <div className='space-y-4'>
              {stats?.recentMovements?.map((m) => (
                <div key={m._id} className='flex justify-between'>
                  <div>
                    <p className='text-sm font-medium'>
                      {m.product?.name}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {m.referenceNumber}
                    </p>
                  </div>

                  <div className='text-right'>
                    <StatusBadge status={m.type} />
                    <p
                      className={`font-bold ${m.quantityChange >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                        }`}
                    >
                      {m.quantityChange >= 0 ? '+' : ''}
                      {m.quantityChange}
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