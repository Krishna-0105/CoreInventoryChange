import { useEffect, useState } from "react";
import API from "../api/axios";
import LowStockChart from "../components/LowStockChart";
import InventoryDistributionChart from "../components/InventoryDistributionChart";
import InventoryValueChart from "../components/InventoryValueChart";

const Analytics = () => {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  // 🔄 Fetch function (reusable)
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // 🔄 Real-time effect
  useEffect(() => {
    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  // 🔍 Filtered products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // ⚠️ Low stock products
  const lowStockProducts = filteredProducts.filter(
    (product) => product.currentStock < product.reorderLevel
  );

  // 📤 Export CSV
  const exportToCSV = () => {
    const headers = ["Name", "Stock", "Reorder Level", "Price"];

    const rows = filteredProducts.map((p) => [
      p.name,
      p.currentStock,
      p.reorderLevel,
      p.price,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Analytics Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Visual insights and inventory analysis
      </p>

      {/* 🔍 Search + Export */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockChart data={lowStockProducts} />
        <InventoryDistributionChart data={filteredProducts} />
        <InventoryValueChart data={filteredProducts} />
      </div>

    </div>
  );
};

export default Analytics;