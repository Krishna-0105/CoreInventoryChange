import { createContext, useContext, useState } from "react";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <InventoryContext.Provider value={{ products, addProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);