import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import ProductCard from "../common/ProductCard";
import ReactPaginate from "react-paginate";

const ProductsList = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const productsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      const response = await apiService.readProducts();
      setProducts(response.data.products);
    }

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Áp dụng tìm kiếm
    if (filters.searchTerm) {
      result = result.filter((product) =>
        product.productName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Áp dụng khoảng giá
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Áp dụng sắp xếp
    switch (filters.sort) {
      case "Giá tăng dần":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Giá giảm dần":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Bán chạy nhất":
        // Giả sử có trường sales để sắp xếp
        result.sort((a, b) => b.sales - a.sales);
        break;
      default:
        // "Phù hợp với bạn" - giữ nguyên thứ tự mặc định
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(0);
  }, [products, filters]);

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="bg-gray-100 px-4 md:px-8 py-8">
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts
            .slice(offset, offset + productsPerPage)
            .map((product, index) => (
              <ProductCard key={`product-${index}`} {...product} />
            ))}
        </div>
        <ReactPaginate
          previousLabel={"Trước"}
          nextLabel={"Sau"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex justify-center mt-8 space-x-2"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link px-3 py-2 rounded bg-white"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link px-3 py-2 rounded bg-white"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link px-3 py-2 rounded bg-white"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link px-3 py-2 rounded bg-white"}
          activeClassName={"active bg-blue-500 font-bold"}
        />
      </div>
    </div>
  );
};

export default ProductsList;
