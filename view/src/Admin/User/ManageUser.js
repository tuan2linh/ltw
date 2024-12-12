import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAllOrders } from '../admin-general/services/apiService';
import { useState, useEffect } from 'react';
import ModelEditUser from './ModelEditUser';
import { useSelector } from "react-redux";

const ManageUser = (props) => {
    const adminId = useSelector(state => state.auth.id);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null
    });

    // Add this search filter function
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.fullName?.toLowerCase().includes(searchLower) ||
            user.phoneNumber?.includes(searchTerm)
        );
    });

    // Define getOrderCountForUser first
    const getOrderCountForUser = (memberId) => {
        return orders.filter(order => order.memberId === memberId).length;
    };

    // Add sorting logic
    const handleSort = (key) => {
        let direction = 'asc';
        
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') direction = 'desc';
            else if (sortConfig.direction === 'desc') direction = null;
        }

        setSortConfig({ key, direction });
    };

    const getSortedUsers = () => {
        if (!sortConfig.key || !sortConfig.direction) return filteredUsers;

        return [...filteredUsers].sort((a, b) => {
            if (sortConfig.key === 'orderCount') {
                const aCount = getOrderCountForUser(a.memberId);
                const bCount = getOrderCountForUser(b.memberId);
                return sortConfig.direction === 'asc' 
                    ? aCount - bCount 
                    : bCount - aCount;
            }
            return 0;
        });
    };

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = getSortedUsers().slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Change page handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    useEffect(() => {
        getAllUser();
        getAllOrder();
    }, []);

    const getAllUser = async () => {
        try {
            setLoading(true);
            let data = await getAllUsers();
            if (data && data.members) {
                setUsers(data.members);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAllOrder = async () => {
        try {
            setLoading(true);
            let data = await getAllOrders();
            if (data && data.data) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };


    const refreshUsers = async () => {
        await getAllUser();
        await getAllOrder();
    };

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="p-2 m-5 md:p-4">
            {/* Improve search input responsiveness */}
            <div className="flex justify-center mb-2 px-2">
                <input
                    type='text'
                    placeholder='Tìm kiếm...'
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className='w-full md:w-96 bg-gray-100 focus:bg-transparent px-3 py-2 rounded-lg h-10 outline-[#333] text-sm transition-all'
                />
            </div>

            {/* Mobile view info cards */}
            <div className="md:hidden space-y-3">
                {currentUsers.map((user, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                        {/* User header with avatar */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={user.avatar || 'https://readymadeui.com/profile_4.webp'}
                                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                                    alt={user.fullName} 
                                />
                                <div>
                                    <div className="font-semibold text-gray-800">{user.fullName}</div>
                                    <div className="text-sm text-gray-500">@{user.username}</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 px-2 py-1 rounded-full">
                                <span className="text-xs text-blue-600 font-medium">
                                    {getOrderCountForUser(user.memberId)} đơn
                                </span>
                            </div>
                        </div>

                        {/* User details grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                                <div className="text-gray-500 mb-1">Số điện thoại</div>
                                <div className="font-medium">{user.phoneNumber || 'Chưa cập nhật'}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-1">Ngày sinh</div>
                                <div className="font-medium">{user.birth || 'Chưa cập nhật'}</div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end items-center space-x-2 pt-2 border-t border-gray-100">
                            <ModelEditUser
                                id={user.memberId}
                                refreshUsers={refreshUsers}
                                adminId={adminId}
                            />
                            <button 
                                title="Delete" 
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    className="w-6 h-6 fill-red-500" 
                                    viewBox="0 0 24 24">
                                    <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block font-sans -mx-4 overflow-x-auto sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-black whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-gray-500 inline mr-3" viewBox="0 0 512 512">
                                        <path
                                            d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                                            data-original="#000000"></path>
                                    </svg>
                                    Tên người dùng
                                </th>
                                <th className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-800 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-gray-500 inline mr-3" viewBox="0 0 512 512">
                                        <path
                                            d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                                            data-original="#000000"></path>
                                    </svg>
                                    Họ và tên
                                </th>
                                <th className="hidden md:table-cell p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-800 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-gray-500 inline mr-3" viewBox="0 0 482.6 482.6">
                                        <path
                                            d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z"
                                            data-original="#000000" />
                                    </svg>
                                    Số điện thoại
                                </th>
                                <th className="hidden md:table-cell p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-800 whitespace-nowrap">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-gray-500 inline mr-3" viewBox="0 0 24 24">
                                        <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm1-17h-2v6h6v-2h-4z" />
                                    </svg>
                                    Ngày sinh
                                </th>
                                <th onClick={() => handleSort('orderCount')} 
                                    className="p-2 md:p-4 text-center text-xs md:text-sm font-semibold text-gray-800 cursor-pointer whitespace-nowrap">
                                    Số đơn hàng đã mua
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className={`w-3 h-3 inline ml-2 ${
                                            sortConfig.key === 'orderCount' 
                                                ? 'fill-blue-500' 
                                                : 'fill-gray-500'
                                        }`}
                                        viewBox="0 0 401.998 401.998">
                                        <path
                                            d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                                            data-original="#000000" />
                                    </svg>
                                </th>
                                <th className="p-2 md:p-4 text-left text-xs md:text-sm font-semibold text-gray-800 whitespace-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {currentUsers.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-2 md:p-4 text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                        {user.username}
                                    </td>
                                    <td className="p-2 md:p-4 text-xs md:text-sm text-gray-800">
                                        <div className="flex items-center space-x-2 md:space-x-3">
                                            <img src={user.avatar || 'https://readymadeui.com/profile_4.webp'}
                                                className="w-6 h-6 md:w-7 md:h-7 rounded-full shrink-0"
                                                alt="profile" />
                                            <span className="truncate max-w-[100px] md:max-w-[200px]">
                                                {user.fullName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell p-2 md:p-4 text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                        {user.phoneNumber}
                                    </td>
                                    <td className="hidden md:table-cell p-2 md:p-4 text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                        {user.birth}
                                    </td>
                                    <td className="p-2 md:p-4 text-xs md:text-sm text-gray-800 text-center whitespace-nowrap">
                                        {getOrderCountForUser(user.memberId)}
                                    </td>
                                    <td className="p-2 md:p-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <ModelEditUser
                                                id={user.memberId}
                                                refreshUsers={refreshUsers}
                                                adminId={adminId}
                                            />
                                            <button title="Delete">
                                                <svg xmlns="http://www.w3.org/2000/svg" 
                                                    className="w-4 h-4 md:w-5 md:h-5 fill-red-500 hover:fill-red-700" 
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                        data-original="#000000" />
                                                    <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                        data-original="#000000" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Replace the old pagination section with this new one */}
            <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
                <div className="order-2 md:order-1 text-center md:text-left">
                    <p className="text-xs text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
                        {searchTerm && ` (filtered from ${users.length} total entries)`}
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
    )
}
export default ManageUser;