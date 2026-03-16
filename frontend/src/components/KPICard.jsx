const KPICard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200 border border-gray-100'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-500 font-medium'>{title}</p>
          <p className='text-3xl font-bold text-gray-800 mt-1'>{value}</p>
          {subtitle && (
            <p className='text-xs text-gray-400 mt-1'>{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-sm`}>
          <Icon className='w-6 h-6 text-white' />
        </div>
      </div>
    </div>
  )
}

export default KPICard