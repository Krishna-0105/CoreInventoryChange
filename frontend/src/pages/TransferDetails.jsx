import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'

const TransferDetails = () => {
  const { id } = useParams()
  const [transfer, setTransfer] = useState(null)

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const res = await API.get(`/transfers/${id}`)
        setTransfer(res.data)
      } catch (error) {
        console.error('Error fetching transfer', error)
      }
    }

    fetchTransfer()
  }, [id])

  if (!transfer) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Transfer Details</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p><strong>Transfer #:</strong> {transfer.transferNumber}</p>
        <p><strong>From:</strong> {transfer.fromLocation}</p>
        <p><strong>To:</strong> {transfer.toLocation}</p>
        <p><strong>Status:</strong> {transfer.status}</p>
        <p><strong>Date:</strong> {new Date(transfer.createdAt).toLocaleDateString()}</p>

        <h2 className="mt-4 font-semibold">Items</h2>
        <ul className="mt-2">
          {transfer.items.map((item, index) => (
            <li key={index}>
              {item.product?.name || item.product} — Qty: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TransferDetails