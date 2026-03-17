import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const LowStockChart = ({ data }) => {
  const [chartType, setChartType] = useState("bar");

  const chartData = data
    .map((product) => ({
      name:
        product.name.length > 10
          ? product.name.substring(0, 10) + "..."
          : product.name,
      stock: product.currentStock,
      shortage: product.reorderLevel - product.currentStock,
    }))
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 5);

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Top Critical Low Stock Products
        </h2>

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>
      </div>

      {/* Empty State */}
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-sm">No low stock products</p>
      ) : (
        <>
          {/* ✅ SINGLE ITEM MESSAGE (CORRECT POSITION) */}
          {chartData.length === 1 && (
            <p className="text-xs text-gray-400 mb-2">
              Only one critical product available — add more data for better comparison
            </p>
          )}

          <ResponsiveContainer width="100%" height={300}>
            
            {/* BAR CHART */}
            {chartType === "bar" && (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis
                  label={{
                    value: "Stock",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip
                  formatter={(value, name, props) => [
                    `Stock: ${props.payload.stock}, Shortage: ${props.payload.shortage}`,
                    "Details",
                  ]}
                />

                <Bar
                  dataKey="stock"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={80}
                >
                  {chartData.map((entry, index) => {
                    let color = "#3b82f6";

                    if (entry.shortage > 10) color = "#ef4444"; // critical
                    else if (entry.shortage > 5) color = "#f59e0b"; // medium

                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            )}

            {/* PIE CHART */}
            {chartType === "pie" && (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="stock"
                  nameKey="name"
                  outerRadius={100}
                  label
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
            )}
          </ResponsiveContainer>

          {/* LEGEND */}
          {chartType === "bar" && (
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Medium</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Low</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LowStockChart;