import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const InventoryValueChart = ({ data }) => {

  const chartData = data
    .map((product) => ({
      name:
        product.name.length > 10
          ? product.name.substring(0, 10) + "..."
          : product.name,
      value: product.price * product.currentStock,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 by value

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Inventory Value (₹)
      </h2>

      {chartData.length === 0 ? (
        <p className="text-gray-400 text-sm">No value data</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />
            <YAxis />

            <Tooltip
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />

            <Bar
              dataKey="value"
              fill="#8b5cf6"
              radius={[5, 5, 0, 0]}
            />
          
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default InventoryValueChart;