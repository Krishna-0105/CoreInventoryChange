import { useState, useEffect } from 'react'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitOfMeasure: 'pcs',
    currentStock: 0,
    reorderLevel: 10,
    warehouse: 'Main Warehouse',
    description: '',
  })

  const fetchProducts = async () => {
    try {
      const { data } = await API.get(`/products?search=${search}`)
      setProducts(data)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/products', formData)
      toast.success('Product created successfully!')
      setShowModal(false)
      setFormData({
        name: '', sku: '', category: '', unitOfMeasure: 'pcs',
        currentStock: 0, reorderLevel: 10, warehouse: 'Main Warehouse', description: '',
      })
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      toast.success('Product deleted!')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Products</h1>
          <p className='text-gray-500 text-sm mt-1'>Manage your product catalogue</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
        >
          <PlusIcon className='w-4 h-4' />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className='relative mb-4'>
        <MagnifyingGlassIcon className='w-4 h-4 absolute left-3 top-3 text-gray-400' />
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Product</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>SKU</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Category</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Stock</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Warehouse</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Status</th>
              <th className='text-left px-6 py-3 text-gray-500 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {loading ? (
              <tr>
                <td colSpan={7} className='text-center py-10 text-gray-400'>
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className='text-center py-10 text-gray-400'>
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-800'>{product.name}</td>
                  <td className='px-6 py-4 text-gray-500'>{product.sku}</td>
                  <td className='px-6 py-4 text-gray-500'>{product.category}</td>
                  <td className='px-6 py-4'>
                    <span className={`font-semibold ${product.currentStock <= product.reorderLevel ? 'text-red-500' : 'text-gray-800'}`}>
                      {product.currentStock} {product.unitOfMeasure}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-gray-500'>{product.warehouse}</td>
                  <td className='px-6 py-4'>
                    {product.currentStock === 0 ? (
                      <StatusBadge status='Canceled' />
                    ) : product.currentStock <= product.reorderLevel ? (
                      <StatusBadge status='Waiting' />
                    ) : (
                      <StatusBadge status='Done' />
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className='text-red-500 hover:text-red-700 text-xs font-medium'
                    >
                      Delete
                    </button>
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
          <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-xl'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>Add New Product</h2>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <input
                type='text' placeholder='Product Name' required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text' placeholder='SKU Code' required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text' placeholder='Category' required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <div className='grid grid-cols-2 gap-3'>
                <input
                  type='number' placeholder='Initial Stock'
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='number' placeholder='Reorder Level'
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <input
                type='text' placeholder='Warehouse'
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products