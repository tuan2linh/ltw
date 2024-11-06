import React, { useState, useEffect } from "react";
import { X, Filter, Search, RotateCcw } from "lucide-react";

const FilterSidebar = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Phù hợp với bạn");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchTerm, setSearchTerm] = useState("");

  const sortOptions = [
    "Giá tăng dần",
    "Giá giảm dần",
    "Bán chạy nhất",
    "Phù hợp với bạn",
  ];

  useEffect(() => {
    onFilterChange({
      sort: selectedSort,
      priceRange,
      searchTerm,
    });
  }, [selectedSort, priceRange, searchTerm]);

  const resetFilters = () => {
    setSelectedSort("Phù hợp với bạn");
    setPriceRange([0, 100]);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      {/* Mobile filter button */}
      <button
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:sticky top-[80px] h-[calc(100vh-80px)] md:h-auto w-64 max-w-[80vw] 
        bg-white shadow-lg z-40 transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-4">
          {/* Mobile header */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-lg font-semibold">Bộ lọc</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-4">Khoảng giá</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Sort options */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Sắp xếp</h3>
            <div className="space-y-2 text-sm">
              {sortOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={selectedSort === option}
                    onChange={() => setSelectedSort(option)}
                    className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center justify-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
