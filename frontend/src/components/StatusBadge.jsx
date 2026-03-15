const statusStyles = {
  Draft: 'bg-gray-100 text-gray-600',
  Waiting: 'bg-yellow-100 text-yellow-700',
  Ready: 'bg-blue-100 text-blue-700',
  Done: 'bg-green-100 text-green-700',
  Canceled: 'bg-red-100 text-red-700',
}

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge