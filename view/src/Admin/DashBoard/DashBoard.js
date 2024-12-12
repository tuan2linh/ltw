import { useNavigate } from 'react-router-dom';
import { getAllOrders, getActionandInfo } from '../admin-general/services/apiService';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";


const DashBoard = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    if (!isAuthenticated) {
        navigate('/');
    }
    const handleView = (path) => {
        navigate(path);
    };
    const [totalUser, setTotalUser] = useState(0);
    const [totalNewUser, setTotalNewUser] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalNewProduct, setTotalNewProduct] = useState(0);
    const [totalProductBuy, setTotalProductBuy] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    const [totalNewOrder, setTotalNewOrder] = useState(0);
    const [totalOrderDelivered, setTotalOrderDelivered] = useState(0);
    const [totalOrderShipping, setTotalOrderShipping] = useState(0);
    const [totalReview, setTotalReview] = useState(0);
    const [totalNewReview, setTotalNewReview] = useState(0);
    const [totalGoodReview, setTotalGoodReview] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getActionInfo();
                await getOrders();
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    }, []);


    const getActionInfo = async () => {
        let data = await getActionandInfo();
        if (data && data.totals) {
            setTotalUser(data.totals.total_members);
            setTotalProduct(data.totals.total_products);
            setTotalOrder(data.totals.total_orders);
            setTotalReview(data.totals.total_feedback);
        }
        if (data && data.actions) {
            setTotalNewUser(data.actions[0].count)
            setTotalNewProduct(data.actions[1].count)
            setTotalProductBuy(data.actions[2].count)
            setTotalNewOrder(data.actions[3].count)
            setTotalOrderDelivered(data.actions[4].count)
            setTotalNewReview(data.actions[5].count)
            setTotalGoodReview(data.actions[6].count)
        }
    };

    const getOrders = async () => {
        let data = await getAllOrders();
        if (data && data.data) {
            const processingOrderCount = data.data.filter(order => order.shipStatus === 'Processing').length;
            setTotalOrderShipping(processingOrderCount);
        }
        else {
            console.error("Error fetching orders");
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div className="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" className="w-full" />
                </div>
                <div className="p-6">
                    <h3 className="text-gray-800 text-xl font-bold mb-4">Khách hàng</h3>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="flex items-center">
                            <i className="fas fa-users text-blue-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Tổng khách hàng</p>
                                <p className="text-lg font-semibold">{totalUser}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-user-plus text-green-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Mới hôm nay</p>
                                <p className="text-lg font-semibold">{totalNewUser}</p>
                            </div>
                        </div>
                    </div>
                    <button type="button"
                        className="mt-20 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-users')}>Chi tiết</button>
                </div>
            </div>

            <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div className="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" className="w-full" />
                </div>
                <div className="p-6">
                    <h3 className="text-gray-800 text-xl font-bold mb-4">Sản phẩm</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <i className="fas fa-box text-blue-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Tổng sản phẩm</p>
                                <p className="text-lg font-semibold">{totalProduct}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-plus-circle text-green-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Mới hôm nay</p>
                                <p className="text-lg font-semibold">{totalNewProduct}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-shopping-cart text-orange-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Đã bán hôm nay</p>
                                <p className="text-lg font-semibold">{totalProductBuy}</p>
                            </div>
                        </div>
                    </div>
                    <button type="button"
                        className="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-products')}>Chi tiết</button>
                </div>
            </div>

            <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div className="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" className="w-full" />
                </div>
                <div className="p-6">
                    <h3 className="text-gray-800 text-xl font-bold mb-4">Đơn hàng</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <i className="fas fa-file-invoice text-blue-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
                                <p className="text-lg font-semibold">{totalOrder}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-clock text-yellow-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Mới hôm nay</p>
                                <p className="text-lg font-semibold">{totalNewOrder}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-check-circle text-green-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Đã giao hôm nay</p>
                                <p className="text-lg font-semibold">{totalOrderDelivered}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-shipping-fast text-red-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Đang giao</p>
                                <p className="text-lg font-semibold">{totalOrderShipping}</p>
                            </div>
                        </div>
                    </div>
                    <button type="button"
                        className="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-orders')}>Chi tiết</button>
                </div>
            </div>

            <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div className="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" className="w-full" />
                </div>
                <div className="p-6">
                    <h3 className="text-gray-800 text-xl font-bold mb-4">Đánh giá sản phẩm</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <i className="fas fa-star text-blue-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Tổng đánh giá</p>
                                <p className="text-lg font-semibold">{totalReview}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-comment text-green-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Mới hôm nay</p>
                                <p className="text-lg font-semibold">{totalNewReview}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-thumbs-up text-yellow-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Đánh giá tốt</p>
                                <p className="text-lg font-semibold">{totalGoodReview}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-thumbs-down text-red-600 text-xl mr-2"></i>
                            <div>
                                <p className="text-gray-500 text-sm">Đánh giá xấu</p>
                                <p className="text-lg font-semibold">{totalNewReview - totalGoodReview}</p>
                            </div>
                        </div>
                    </div>
                    <button type="button"
                        className="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-feedback')}>Chi tiết</button>
                </div>
            </div>
        </div>
    )
}
export default DashBoard;