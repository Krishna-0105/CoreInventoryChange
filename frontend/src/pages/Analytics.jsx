import { useEffect, useState } from "react";
import API from "../api/axios";
import LowStockChart from "../components/LowStockChart";
import InventoryDistributionChart from "../components/InventoryDistributionChart";
import InventoryValueChart from "../components/InventoryValueChart";

const Analytics = () => {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(""); // ✅ filter state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Filtered products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Low stock from filtered data
  const lowStockProducts = filteredProducts.filter(
    (product) => product.currentStock < product.reorderLevel
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Analytics Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Visual insights and inventory analysis
      </p>

      {/* 🔍 SEARCH FILTER */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 📊 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockChart data={lowStockProducts} />
        <InventoryDistributionChart data={filteredProducts} />
        <InventoryValueChart data={filteredProducts} />
      </div>

    </div>
  );
};

export default Analytics;