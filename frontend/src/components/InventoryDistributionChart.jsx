import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InventoryDistributionChart = ({ data }) => {
  
  const chartData = data
    .map((product) => ({
      name: product.name,
      value: product.currentStock,
    }))
    .filter((item) => item.value > 0)
    .slice(0, 5); // top 5

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Inventory Distribution
      </h2>

      {chartData.length === 0 ? (
        <p className="text-gray-400 text-sm">No inventory data</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default InventoryDistributionChart;