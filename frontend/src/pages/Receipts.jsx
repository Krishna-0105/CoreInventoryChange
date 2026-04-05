import { useState, useEffect } from 'react'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const Receipts = () => {
  const [receipts, setReceipts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    supplier: '',
    notes: '',
    items: [{ product: '', quantity: 1 }],
  })

  const fetchData = async () => {
    try {
      const [receiptsRes, productsRes] = await Promise.all([
        API.get('/receipts'),
        API.get('/products'),
      ])
      setReceipts(receiptsRes.data)
      setProducts(productsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }],
    })
  }

  const updateItem = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    setFormData({ ...formData, items: updatedItems })
  }

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/receipts', formData)
      toast.success('Receipt created!')
      setShowModal(false)
      setFormData({ supplier: '', notes: '', items: [{ product: '', quantity: 1 }] })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create receipt')
    }
  }

  const handleValidate = async (id) => {
    try {
      await API.put(`/receipts/${id}/validate`)
      toast.success('Receipt validated! Stock updated.')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to validate')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this receipt?')) return
    try {
      await API.delete(`/receipts/${id}`)
      toast.success('Receipt deleted!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Receipts</h1>
          <p className='text-gray-500 text-sm mt-1'>Manage incoming stock from suppliers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium'
        >
          <PlusIcon className='w-4 h-4' />
          New Receipt
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Receipt #</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Supplier</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Items</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Status</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Date</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {loading ? (
              <tr><td colSpan={6} className='text-center py-10 text-gray-400'>Loading...</td></tr>
            ) : receipts.length === 0 ? (
              <tr><td colSpan={6} className='text-center py-10 text-gray-400'>No receipts found</td></tr>
            ) : (
              receipts.map((receipt) => (
                <tr key={receipt._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-blue-600'>
  <a href={`/receipts/${receipt._id}`} className='hover:underline'>
    {receipt.receiptNumber}
  </a>
</td>
                  <td className='px-6 py-4 text-gray-700'>{receipt.supplier}</td>
                  <td className='px-6 py-4 text-gray-500'>{receipt.items.length} item(s)</td>
                  <td className='px-6 py-4'><StatusBadge status={receipt.status} /></td>
                  <td className='px-6 py-4 text-gray-500'>
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 flex items-center gap-3'>
                    <Link
  to={`/receipts/${receipt._id}`}
  className='text-blue-600 hover:text-blue-800 text-xs font-medium'
>
  View
</Link>
                    {receipt.status !== 'Done' && receipt.status !== 'Canceled' && (
                      <button
                        onClick={() => handleValidate(receipt._id)}
                        className='flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-medium'
                      >
                        <CheckIcon className='w-4 h-4' />
                        Mark as Received
                      </button>
                    )}
                    {receipt.status !== 'Done' && (
                      <button
                        onClick={() => handleDelete(receipt._id)}
                        className='text-red-500 hover:text-red-700 text-xs font-medium'
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>New Receipt</h2>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <input
                type='text' placeholder='Supplier Name' required
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className='flex gap-2'>
                    <select
                      required
                      value={item.product}
                      onChange={(e) => updateItem(index, 'product', e.target.value)}
                      className='flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value=''>Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type='number' min='1' placeholder='Qty'
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className='w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    {formData.items.length > 1 && (
                      <button type='button' onClick={() => removeItem(index)}
                        className='text-red-500 hover:text-red-700 text-xs px-2'>✕</button>
                    )}
                  </div>
                ))}
                <button type='button' onClick={addItem}
                  className='text-blue-600 hover:text-blue-800 text-xs font-medium'>
                  + Add Item
                </button>
              </div>

              <textarea
                placeholder='Notes (optional)'
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={2}
              />

              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowModal(false)}
                  className='flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50'>
                  Cancel
                </button>
                <button type='submit'
                  className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium'>
                  Create Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Receipts