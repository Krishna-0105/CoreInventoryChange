
import { useState, useEffect } from 'react'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    customer: '',
    notes: '',
    items: [{ product: '', quantity: 1 }],
  })

  const fetchData = async () => {
    try {
      const [deliveriesRes, productsRes] = await Promise.all([
        API.get('/deliveries'),
        API.get('/products'),
      ])
      setDeliveries(deliveriesRes.data)
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

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.customer.toLowerCase().includes(search.toLowerCase()) ||
    delivery.deliveryNumber.toLowerCase().includes(search.toLowerCase())
  )

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
      await API.post('/deliveries', formData)
      toast.success('Delivery order created!')
      setShowModal(false)

      setFormData({
        customer: '',
        notes: '',
        items: [{ product: '', quantity: 1 }],
      })

      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create delivery')
    }
  }

  const handleValidate = async (id) => {
    try {
      await API.put(`/deliveries/${id}/validate`)
      toast.success('Delivery validated! Stock updated.')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to validate')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this delivery?')) return

    try {
      await API.delete(`/deliveries/${id}`)
      toast.success('Delivery deleted!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div>

      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Deliveries</h1>
          <p className='text-gray-500 text-sm mt-1'>Manage outgoing stock to customers</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium'
        >
          <PlusIcon className='w-4 h-4' />
          New Delivery
        </button>
      </div>

      {/* SEARCH BAR */}

      <input
        type="text"
        placeholder="Search deliveries..."
        className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-sm'>

          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Delivery #</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Customer</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Items</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Status</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Date</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Actions</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>

            {loading ? (
              <tr>
                <td colSpan={6} className='text-center py-10 text-gray-400'>
                  Loading...
                </td>
              </tr>
            ) : filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className='text-center py-10 text-gray-400'>
                  No deliveries found
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery._id} className='hover:bg-gray-50'>

                  <td className='px-6 py-4 font-medium text-blue-600'>
                    <Link to={`/deliveries/${delivery._id}`}>
                      {delivery.deliveryNumber}
                    </Link>
                  </td>

                  <td className='px-6 py-4 text-gray-700'>
                    {delivery.customer}
                  </td>

                  <td className='px-6 py-4 text-gray-500'>
                    {delivery.items
                      .map(i => `${i.product?.name} (${i.quantity})`)
                      .join(', ')}
                  </td>

                  <td className='px-6 py-4'>
                    <StatusBadge status={delivery.status} />
                  </td>

                  <td className='px-6 py-4 text-gray-500'>
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </td>

                  <td className='px-6 py-4 flex items-center gap-3'>

                    {delivery.status !== 'Done' && delivery.status !== 'Canceled' && (
                      <button
                        onClick={() => handleValidate(delivery._id)}
                        className='flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-medium'
                      >
                        <CheckIcon className='w-4 h-4' />
                        Validate
                      </button>
                    )}

                    {delivery.status !== 'Done' && (
                      <button
                        onClick={() => handleDelete(delivery._id)}
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

      {/* CREATE DELIVERY MODAL */}

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>

          <div className='bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto'>

            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              New Delivery Order
            </h2>

            <form onSubmit={handleSubmit} className='space-y-3'>

              <input
                type='text'
                placeholder='Customer Name'
                required
                value={formData.customer}
                onChange={(e) =>
                  setFormData({ ...formData, customer: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Items</label>

                {formData.items.map((item, index) => (
                  <div key={index} className='flex gap-2'>

                    <select
                      required
                      value={item.product}
                      onChange={(e) =>
                        updateItem(index, 'product', e.target.value)
                      }
                      className='flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >

                      <option value=''>Select Product</option>

                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Stock: {p.currentStock})
                        </option>
                      ))}

                    </select>

                    <input
                      type='number'
                      min='1'
                      placeholder='Qty'
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, 'quantity', Number(e.target.value))
                      }
                      className='w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    {formData.items.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeItem(index)}
                        className='text-red-500 hover:text-red-700 text-xs px-2'
                      >
                        ✕
                      </button>
                    )}

                  </div>
                ))}

                <button
                  type='button'
                  onClick={addItem}
                  className='text-blue-600 hover:text-blue-800 text-xs font-medium'
                >
                  + Add Item
                </button>

              </div>

              <textarea
                placeholder='Notes (optional)'
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={2}
              />

              <div className='flex gap-3 pt-2'>

                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium'
                >
                  Create Delivery
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Deliveries