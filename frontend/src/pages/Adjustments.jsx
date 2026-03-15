import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { PlusIcon } from '@heroicons/react/24/outline'

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    countedQuantity: 0,
    notes: '',
  })

  const fetchData = async () => {
    try {
      const [adjustmentsRes, productsRes] = await Promise.all([
        API.get('/adjustments'),
        API.get('/products'),
      ])
      setAdjustments(adjustmentsRes.data)
      setProducts(productsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/adjustments', formData)
      toast.success('Stock adjusted successfully!')
      setShowModal(false)
      setFormData({ productId: '', countedQuantity: 0, notes: '' })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to adjust stock')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Stock Adjustments</h1>
          <p className='text-gray-500 text-sm mt-1'>Fix stock mismatches from physical counts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium'
        >
          <PlusIcon className='w-4 h-4' />
          New Adjustment
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Reference</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Product</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Before</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Change</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>After</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Notes</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Date</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {loading ? (
              <tr><td colSpan={7} className='text-center py-10 text-gray-400'>Loading...</td></tr>
            ) : adjustments.length === 0 ? (
              <tr><td colSpan={7} className='text-center py-10 text-gray-400'>No adjustments found</td></tr>
            ) : (
              adjustments.map((adj) => (
                <tr key={adj._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-blue-600'>{adj.referenceNumber}</td>
                  <td className='px-6 py-4 text-gray-700'>{adj.product?.name}</td>
                  <td className='px-6 py-4 text-gray-500'>{adj.stockBefore}</td>
                  <td className='px-6 py-4'>
                    <span className={`font-semibold ${adj.quantityChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {adj.quantityChange >= 0 ? '+' : ''}{adj.quantityChange}
                    </span>
                  </td>
                  <td className='px-6 py-4 font-semibold text-gray-800'>{adj.stockAfter}</td>
                  <td className='px-6 py-4 text-gray-500'>{adj.notes}</td>
                  <td className='px-6 py-4 text-gray-500'>
                    {new Date(adj.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-xl'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>New Stock Adjustment</h2>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Product</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Current: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Actual Counted Quantity
                </label>
                <input
                  type='number' min='0' required
                  value={formData.countedQuantity}
                  onChange={(e) => setFormData({ ...formData, countedQuantity: Number(e.target.value) })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
                <textarea
                  placeholder='Reason for adjustment...'
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowModal(false)}
                  className='flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50'>
                  Cancel
                </button>
                <button type='submit'
                  className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium'>
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Adjustments