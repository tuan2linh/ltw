import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getAllProducts, getAllFeedbacks } from '../admin-general/services/apiService';
import ModealDetailFeedback from './ModalDetailFeedback';

const ManageFeedback = (props) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    let productCount = products.length;
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null
    });

    // Filter products by search keyword
    const filteredProducts = products.filter(product => {
        const searchLower = search.toLowerCase();
        return (
            product.productId?.toString().toLowerCase().includes(searchLower) ||
            product.productName?.toLowerCase().includes(searchLower)
        );
    });

    // Add this function to sort products
    const getSortedProducts = () => {
        if (!sortConfig.key || !sortConfig.direction) return filteredProducts;

        return [...filteredProducts].sort((a, b) => {
            if (sortConfig.key === 'price') {
                const aValue = parseFloat(a.price);
                const bValue = parseFloat(b.price);
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            if (sortConfig.key === 'rating') {
                const aValue = calculateProductRating(a.productId);
                const bValue = calculateProductRating(b.productId);
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }
        });
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Change page handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        getAllProduct();
        getAllFeedback();
    }, []);

    const getAllProduct = async () => {
        try {
            setLoading(true);
            let data = await getAllProducts();
            if (data && data.products) {
                setProducts(data.products);
                productCount = data.products.length;
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAllFeedback = async () => {
        try {
            setLoading(true);
            let data = await getAllFeedbacks();
            if (data && data.feedbacks) {
                setFeedbacks(data.feedbacks);
            }
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProductRating = (productId) => {
        // Find all feedbacks for this product
        const productFeedbacks = feedbacks.filter(f => f.productId === productId);

        // If no feedbacks, return default rating of 5
        if (productFeedbacks.length === 0) {
            return 5;
        }

        // Calculate average rating
        const totalRating = productFeedbacks.reduce((sum, feedback) => {
            return sum + Number(feedback.rating);
        }, 0);

        return totalRating / productFeedbacks.length;
    };

    // Add this sorting function
    const handleSort = (key) => {
        let direction = 'asc';

        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') direction = 'desc';
            else if (sortConfig.direction === 'desc') direction = null;
        }

        setSortConfig({ key, direction });
    };

    return (
        <div className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-2 md:p-8 gap-3">
                <div className="w-full md:w-auto">
                    <input type='text'
                        placeholder='Tìm kiếm sản phẩm'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className='w-full md:w-96 bg-gray-100 focus:bg-transparent px-4 py-3 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block min-w-full bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 whitespace-nowrap">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-black">
                                ID
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-black">
                                Sản phẩm
                            </th>
                            <th onClick={() => handleSort('rating')} className="p-4 text-left text-sm font-semibold text-black cursor-pointer">
                                Đánh giá
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className={`w-3 h-3 fill-gray-500 inline ml-2 ${sortConfig.key === 'rating' ? 'fill-blue-500' : ''}`}
                                    viewBox="0 0 401.998 401.998">
                                    <path
                                        d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                                        data-original="#000000" />
                                </svg>
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-black">
                                Số Lượng Đáng Giá
                            </th>
                            <th className="p-4 text-left text-sm font-semibold text-black">
                                Hành động
                            </th>
                        </tr>
                    </thead>

                    <tbody className="whitespace-nowrap divide-y divide-gray-200">
                        {getSortedProducts().slice(indexOfFirstItem, indexOfLastItem).map((product, index) => (
                            <tr key={product.id || index} className="hover:bg-gray-50">
                                <td className="pl-4 w-8">
                                    {product.productId}
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="flex items-center cursor-pointer">
                                        <img src={product.image || 'default-image.jpg'}
                                            className="w-10 h-10 p-1.5 shrink-0 bg-gray-100"
                                            alt={product.productName} />
                                        <div className="mx-4">
                                            <p className="text-sm text-black">{product.productName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className="w-4 h-4 inline mr-1.5"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"
                                                fill={star <= calculateProductRating(product.productId) ? "#facc15" : "#CED5D8"}
                                            />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-xs text-gray-500">
                                        ({calculateProductRating(product.productId).toFixed(1)})
                                    </span>
                                </td>
                                <td className="p-4 text-sm">
                                    {feedbacks.filter(feedback => feedback.productId === product.productId).length}
                                </td>
                                <td className="p-4">
                                    <ModealDetailFeedback  
                                    id = {product.productId}
                                    />
                                    <button className="mr-4" title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                            <path
                                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                data-original="#000000" />
                                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                data-original="#000000" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden space-y-4">
                {getSortedProducts().slice(indexOfFirstItem, indexOfLastItem).map((product, index) => (
                    <div key={product.id || index} className="bg-white p-4 rounded-lg shadow space-y-3">
                        <div className="flex items-center space-x-3">
                            <img src={product.image || 'default-image.jpg'}
                                className="w-16 h-16 rounded-lg object-cover"
                                alt={product.productName} />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{product.productName}</p>
                                <p className="text-xs text-gray-500">ID: {product.productId}</p>
                                <div className="flex items-center mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-4 h-4"
                                            viewBox="0 0 14 13"
                                            fill={star <= calculateProductRating(product.productId) ? "#facc15" : "#CED5D8"}>
                                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"/>
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-xs text-gray-500">
                                        ({calculateProductRating(product.productId).toFixed(1)})
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    {feedbacks.filter(feedback => feedback.productId === product.productId).length} đánh giá
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2 pt-2 border-t">
                            <ModealDetailFeedback id={product.productId} />
                            <button className="mr-4" title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                            <path
                                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                data-original="#000000" />
                                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                data-original="#000000" />
                                        </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination section - Make it more mobile friendly */}
            <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
                <div className="order-2 md:order-1 text-center md:text-left">
                    <p className="text-xs text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
                    </p>
                </div>

                <div className="order-1 md:order-2 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Hiển thị</label>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="text-xs border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className="flex justify-center gap-1">
                        <ul className="flex space-x-1 ml-4">
                            <li
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                className={`flex items-center justify-center cursor-pointer ${currentPage === 1 ? 'bg-gray-100' : 'bg-gray-200'} w-8 h-8 rounded`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-gray-500" viewBox="0 0 55.753 55.753">
                                    <path
                                        d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                                        data-original="#000000" />
                                </svg>
                            </li>
                            {pageNumbers.map(number => (
                                <li
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`flex items-center justify-center cursor-pointer text-sm w-8 h-8 rounded
                                        ${currentPage === number ? 'bg-[#007bff] text-white' : ''}`}
                                >
                                    {number}
                                </li>
                            ))}
                            <li
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                className={`flex items-center justify-center cursor-pointer ${currentPage === totalPages ? 'bg-gray-100' : 'bg-gray-200'} w-8 h-8 rounded`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-gray-500 rotate-180" viewBox="0 0 55.753 55.753">
                                    <path
                                        d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                                        data-original="#000000" />
                                </svg>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ManageFeedback;
