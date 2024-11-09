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
            <div class="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div class="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" class="w-full" />
                </div>

                <div class="p-6">
                    <h3 class="text-gray-800 text-xl font-bold">Khách hàng</h3>
                    <p class="mt-4 text-sm text-gray-500 leading-relaxed">
                        Tổng số khách hàng: {totalUser} <br />
                        Số khách hàng đăng ký hôm nay: {totalNewUser} <br />
                        Quản lý thông tin khách hàng
                        <br />
                        <br />
                        <br />
                    </p>
                    <button type="button"
                        class="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-users')}>Chi tiết</button>
                </div>
            </div>
            <div class="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div class="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" class="w-full" />
                </div>

                <div class="p-6">
                    <h3 class="text-gray-800 text-xl font-bold">Sản phẩm</h3>
                    <p class="mt-4 text-sm text-gray-500 leading-relaxed">
                        Tổng số sản phẩm: {totalProduct} <br />
                        Số sản phẩm mới hôm nay: {totalNewProduct} <br />
                        Số sản phẩm được mua trong ngày : {totalProductBuy} <br />
                        Quản lý thông tin sản phẩm <br />
                        <br />
                    </p>
                    <button type="button"
                        class="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-products')} >Chi tiết</button>
                </div>
            </div>
            <div class="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div class="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" class="w-full" />
                </div>

                <div class="p-6">
                    <h3 class="text-gray-800 text-xl font-bold">Đơn hàng</h3>
                    <p class="mt-4 text-sm text-gray-500 leading-relaxed">
                        Tổng số đơn hàng: {totalOrder} <br />
                        Số đơn hàng hôm nay: {totalNewOrder} <br />
                        Số đơn hàng đã giao hôm nay: {totalOrderDelivered} <br />
                        Số đơn hàng chưa giao thành công: {totalOrderShipping} <br />
                        Quản lý thông tin đơn hàng
                    </p>
                    <button type="button"
                        class="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-orders')}
                    >Chi tiết</button>
                </div>
            </div>
            <div class="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full max-w-sm rounded-lg overflow-hidden mx-auto font-[sans-serif] mt-4">
                <div class="min-h-[256px]">
                    <img src="https://readymadeui.com/Imagination.webp" class="w-full" />
                </div>

                <div class="p-6">
                    <h3 class="text-gray-800 text-xl font-bold">Đánh giá sản phẩm</h3>
                    <p class="mt-4 text-sm text-gray-500 leading-relaxed">
                        Tổng số đánh giá: {totalReview} <br />
                        Số đánh giá mới hôm nay: {totalNewReview} <br />
                        Số đánh giá tốt: {totalGoodReview} <br />
                        Số đánh giá xấu: {totalNewReview - totalGoodReview} <br />
                        Quản lý thông tin đánh giá
                    </p>
                    <button type="button"
                        class="mt-6 px-5 py-2.5 rounded-lg text-white text-sm tracking-wider border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                        onClick={() => handleView('/admins/manage-feedback')}
                    >Chi tiết</button>
                </div>
            </div>
        </div>

    )
}
export default DashBoard;