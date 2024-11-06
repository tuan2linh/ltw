import React, { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";
import apiService from "../../services/api";
const ProductNewList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await apiService.readProducts();
      setProducts(response.data.products);
    }

    fetchData();
  }, []);
  return (
    <div className="bg-gray-100 px-16 py-16">
      <div className="p-4 mx-auto lg:max-w-7xl sm:max-w-full">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          Sản phẩm mới
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
          {products.slice(-8).map((product, index) => (
            <ProductCard key={"product" + index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductNewList;
