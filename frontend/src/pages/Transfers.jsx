import { useState, useEffect } from 'react'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
const Transfers = () => {
  const navigate = useNavigate()
  const [transfers, setTransfers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    notes: '',
    items: [{ product: '', quantity: 1 }],
  })

  const fetchData = async () => {
    try {
      const [transfersRes, productsRes] = await Promise.all([
        API.get('/transfers'),
        API.get('/products'),
      ])
      setTransfers(transfersRes.data)
      setProducts(productsRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { product: '', quantity: 1 }] })
  }

  const updateItem = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    setFormData({ ...formData, items: updatedItems })
  }

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // ✅ STEP 1: Validate stock BEFORE anything
      for (let item of formData.items) {
        const product = products.find(p => p._id === item.product)

        if (!product) continue

        if (product.currentStock < item.quantity) {
          toast.error(`Not enough stock for ${product.name}`)
          return
        }
      }

      // ✅ STEP 2: Create transfer
      await API.post('/transfers', formData)

      // ✅ STEP 3: Update stock
      for (let item of formData.items) {
        const product = products.find(p => p._id === item.product)

        const newStock = product.currentStock - item.quantity

        await API.put(`/products/${product._id}`, {
          ...product,
          currentStock: newStock
        })
      }

      toast.success('Transfer created & stock updated!')

      await fetchData()

      setShowModal(false)

      setFormData({
        fromLocation: '',
        toLocation: '',
        notes: '',
        items: [{ product: '', quantity: 1 }]
      })

    } catch (error) {
      console.log(error.response?.data?.message)
      toast.error(error.response?.data?.message || 'Failed to create transfer')
    }
  }
  const handleValidate = async (id) => {
    try {
      await API.put(`/transfers/${id}/validate`)
      toast.success('Transfer validated!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to validate')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transfer?')) return
    try {
      await API.delete(`/transfers/${id}`)
      toast.success('Transfer deleted!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Internal Transfers</h1>
          <p className='text-gray-500 text-sm mt-1'>Move stock between locations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium'
        >
          <PlusIcon className='w-4 h-4' />
          New Transfer
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Transfer #</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>From</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>To</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Items</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Status</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Date</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {loading ? (
              <tr><td colSpan={7} className='text-center py-10 text-gray-400'>Loading...</td></tr>
            ) : transfers.length === 0 ? (
              <tr><td colSpan={7} className='text-center py-10 text-gray-400'>No transfers found</td></tr>
            ) : (
              transfers.map((transfer) => (
                <tr key={transfer._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-blue-600'>{transfer.transferNumber}</td>
                  <td className='px-6 py-4 text-gray-700'>{transfer.fromLocation}</td>
                  <td className='px-6 py-4 text-gray-700'>{transfer.toLocation}</td>
                  <td className='px-6 py-4 text-gray-500'>{transfer.items.length} item(s)</td>
                  <td className='px-6 py-4'><StatusBadge status={transfer.status} /></td>
                  <td className='px-6 py-4 text-gray-500'>
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 flex items-center gap-3'>
                    <td className='px-6 py-4 flex items-center gap-3 text-sm'>

                      {transfer.status === 'Done' ? (
                        <span className='text-gray-400'>Completed</span>
                      ) : (
                        <button
                          onClick={() => handleValidate(transfer._id)}
                          className='text-green-600 hover:text-green-800 font-medium'
                        >
                          Validate
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/transfers/${transfer._id}`)}
                        className='text-blue-600 hover:text-blue-800 font-medium'
                      >
                        View
                      </button>

                    </td>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>New Internal Transfer</h2>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <div className='grid grid-cols-2 gap-3'>
                <input
                  type='text' placeholder='From Location' required
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='text' placeholder='To Location' required
                  value={formData.toLocation}
                  onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className='flex gap-2'>
                    <select
                      required value={item.product}
                      onChange={(e) => updateItem(index, 'product', e.target.value)}
                      className='flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value=''>Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>{p.name} (Stock: {p.currentStock})</option>
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
                  Create Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transfers