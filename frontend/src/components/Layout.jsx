import { useState } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          
          {/* Top Bar */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white hover:scale-105 transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Page Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition-all duration-300">
            {children}
          </div>

        </main>
      </div>

    </div>
  );
};

export default Layout;