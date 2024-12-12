import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../admin-general/services/apiService';
import { useState, useEffect } from 'react';
import ModelEditOrder from './ModalEditOrder';
import { useSelector } from "react-redux";

const ManagerOrder = () => {
    const navigate = useNavigate();
    const adminId = useSelector(state => state.auth.id);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState(0); // 0: default, 1: completed first, 2: shipping first
    const [sortPayStatus, setSortPayStatus] = useState(0); // 0: default, 1: paid first, 2: pending first

    // Add sorting handler
    const handleSortByStatus = () => {
        setSortStatus((prev) => (prev + 1) % 3); // Cycle through 0, 1, 2
    };

    // Add payment sorting handler
    const handleSortByPayStatus = () => {
        setSortPayStatus((prev) => (prev + 1) % 3); // Cycle through 0, 1, 2
    };

    // Add sorting logic before filtering
    const sortedOrders = [...orders].sort((a, b) => {
        // First handle shipping status sorting
        if (sortStatus === 1) { // Completed first
            if (a.shipStatus === 'Shipped' && b.shipStatus !== 'Shipped') return -1;
            if (a.shipStatus !== 'Shipped' && b.shipStatus === 'Shipped') return 1;
        } else if (sortStatus === 2) { // Shipping first
            if (a.shipStatus === 'Processing' && b.shipStatus !== 'Processing') return -1;
            if (a.shipStatus !== 'Processing' && b.shipStatus === 'Processing') return 1;
        }

        // Then handle payment status sorting
        if (sortPayStatus === 1) {
            if (a.payStatus === 'Paid' && b.payStatus !== 'Paid') return -1;
            if (a.payStatus !== 'Paid' && b.payStatus === 'Paid') return 1;
        } else if (sortPayStatus === 2) {
            if (a.payStatus === 'Pending' && b.payStatus !== 'Pending') return -1;
            if (a.payStatus !== 'Pending' && b.payStatus === 'Pending') return 1;
        }

        return 0;
    });

    // search function
    const filteredOrders = sortedOrders.filter((order) => {
        const searchLower = search.toLowerCase();
        return (
            order.orderId.toString().toLowerCase().includes(searchLower) ||
            order.Reciever.toLowerCase().includes(searchLower) ||
            order.phoneNumber.toLowerCase().includes(searchLower) ||
            order.address.toLowerCase().includes(searchLower)  
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    //change pageNumber
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        getAllOrder();
    }, []);
    const getAllOrder = async () => {
        try {
            setLoading(true);
            let data = await getAllOrders();
            console.log(data);
            if (data && data.data) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const refreshOrders = async () => {
        await getAllOrder();
    };

    // handle status style
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Shipped':
                return 'border-green-500 text-green-600';
            case 'Processing':
                return 'border-red-500 text-red-600';
            case 'Pending':
                return 'border-yellow-500 text-yellow-600';
            default:
                return 'border-gray-500 text-gray-600';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'Shipped':
                return 'Hoàn thành';
            case 'Processing':
                return 'Đang giao';
            case 'Pending':
                return 'Chờ xử lý';
            default:
                return 'Không xác định';
        }
    };
    // handle pay status style
    const getPayStatusStyle = (status) => {
        switch (status) {
            case 'Paid':
                return 'border-green-500 text-green-600';
            case 'Pending':
                return 'border-yellow-500 text-yellow-600';
            default:
                return 'border-gray-500 text-gray-600';
        }
    };
    const getPayStatusText = (status) => {
        switch (status) {
            case 'Paid':
                return 'Đã thanh toán';
            case 'Pending':
                return 'Chờ thanh toán';
            default:
                return 'Không xác định';
        }
    };

    //generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-2 md:p-8 gap-3">
                <div className="w-full md:w-auto">
                    <input type='text' 
                        placeholder='Tìm kiếm đơn hàng'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className='w-full md:w-96 bg-gray-100 focus:bg-transparent px-4 py-3 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
            </div>

            <div className="font-[sans-serif] p-2 md:p-8">
                {/* Desktop view */}
                <div className="hidden md:block min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100 whitespace-nowrap">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-black">
                                    ID đơn hàng
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-black">
                                    Người nhận
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-black">
                                    Số điện thoại
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-black">
                                    Địa chỉ
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-black cursor-pointer" onClick={handleSortByStatus}>
                                    Trạng thái giao hàng
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className={`w-3 h-3 fill-gray-500 inline ml-2 ${sortStatus !== 0 ? 'text-blue-500' : ''}`}
                                        viewBox="0 0 401.998 401.998">
                                        <path
                                            d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                                            data-original="#000000" />
                                    </svg>
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-black cursor-pointer" onClick={handleSortByPayStatus}>
                                    Trạng thái thanh toán
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className={`w-3 h-3 fill-gray-500 inline ml-2 ${sortPayStatus !== 0 ? 'text-blue-500' : ''}`}
                                        viewBox="0 0 401.998 401.998">
                                        <path
                                            d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                                            data-original="#000000" />
                                    </svg>
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-black">
                                    Hành động
                                </th>
                            </tr>
                        </thead>

                        <tbody className="whitespace-nowrap divide-y divide-gray-200">
                            {currentOrders.map((order, index) => (
                                <tr key={order.id || index} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm">
                                        {order.orderId}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="flex items-center cursor-pointer">
                                            <img
                                                src={order.customerAvatar || 'https://readymadeui.com/profile_6.webp'}
                                                className="w-7 h-7 rounded-full shrink-0"
                                                alt="profile"
                                            />
                                            <div className="ml-4">
                                                <p className="text-sm text-gray-800">{order.Reciever}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {order.phoneNumber}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {order.address}
                                    </td>
                                    <td className="p-4 text-sm text-gray-800">
                                        <span className={`w-[100px] block text-center py-1 border rounded text-xs ${getStatusStyle(order.shipStatus)}`}>
                                            {getStatusText(order.shipStatus)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-800">
                                        <span className={`w-[100px] block text-center py-1 border rounded text-xs ${getPayStatusStyle(order.payStatus)}`}>
                                            {getPayStatusText(order.payStatus)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <ModelEditOrder 
                                        id={order.orderId} 
                                        memId={order.memberId}
                                        adminId={adminId}
                                        refreshOrders={refreshOrders} />
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

                {/* Mobile view */}
                <div className="md:hidden space-y-4">
                    {currentOrders.map((order, index) => (
                        <div key={order.id || index} className="bg-white p-4 rounded-lg shadow space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={order.customerAvatar || 'https://readymadeui.com/profile_6.webp'}
                                        className="w-12 h-12 rounded-full"
                                        alt="profile" />
                                    <div>
                                        <p className="font-medium text-sm">{order.Reciever}</p>
                                        <p className="text-xs text-gray-500">ID: {order.orderId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ModelEditOrder 
                                        id={order.orderId} 
                                        memId={order.memberId}
                                        adminId={adminId}
                                        refreshOrders={refreshOrders} />
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

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                    <span className="text-gray-600">{order.phoneNumber}</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <svg className="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span className="text-gray-600 flex-1">{order.address}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <div className={`px-3 py-1 rounded-full border text-xs ${getStatusStyle(order.shipStatus)}`}>
                                    {getStatusText(order.shipStatus)}
                                </div>
                                <div className={`px-3 py-1 rounded-full border text-xs ${getPayStatusStyle(order.payStatus)}`}>
                                    {getPayStatusText(order.payStatus)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
                    <div className="order-2 md:order-1 text-center md:text-left">
                        <p className="text-xs text-gray-500">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} entries
                            {search && ` (filtered from ${orders.length} total entries)`}
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
                            <button
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded ${
                                    currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                disabled={currentPage === 1}
                            >
                                <span className="sr-only">Previous</span>
                                &lt;
                            </button>
                            
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`w-8 h-8 flex items-center justify-center rounded ${
                                        currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded ${
                                    currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Next</span>
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ManagerOrder;