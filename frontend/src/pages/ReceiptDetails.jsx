import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../api/axios"

const ReceiptDetails = () => {
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await API.get(`/receipts/${id}`)
        setReceipt(res.data)
      } catch (err) {
        console.error("Failed to load receipt")
      }
    }

    fetchReceipt()
  }, [id])

  if (!receipt) return <div className="p-6">Loading receipt...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Receipt {receipt.receiptNumber}
      </h1>

      <p><strong>Supplier:</strong> {receipt.supplier}</p>
      <p><strong>Status:</strong> {receipt.status}</p>

      <h2 className="mt-4 font-semibold">Items</h2>

      <ul className="list-disc ml-6">
        {receipt.items.map((item) => (
          <li key={item._id}>
            {item.product?.name} — Qty: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReceiptDetails