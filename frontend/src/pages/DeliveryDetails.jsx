import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'

const DeliveryDetails = () => {
  const { id } = useParams()
  const [delivery, setDelivery] = useState(null)

  useEffect(() => {
    const fetchDelivery = async () => {
      const res = await API.get(`/deliveries/${id}`)
      setDelivery(res.data)
    }
    fetchDelivery()
  }, [id])

  if (!delivery) return <p className="p-6">Loading delivery...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Details</h1>

      <div className="bg-white p-6 rounded-xl shadow border">
        <p><strong>Delivery #:</strong> {delivery.deliveryNumber}</p>
        <p><strong>Customer:</strong> {delivery.customer}</p>
        <p><strong>Status:</strong> {delivery.status}</p>
        <p><strong>Date:</strong> {new Date(delivery.createdAt).toLocaleDateString()}</p>

        <h2 className="mt-6 font-semibold">Items</h2>

        <ul className="mt-2 space-y-2">
          {delivery.items.map((item) => (
            <li key={item._id} className="border p-2 rounded">
              {item.product?.name} — Qty: {item.quantity}
            </li>
          ))}
        </ul>

        {delivery.notes && (
          <>
            <h2 className="mt-6 font-semibold">Notes</h2>
            <p>{delivery.notes}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default DeliveryDetails