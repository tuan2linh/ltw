import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getOrderById, putUpdateOrder, postNewAction } from '../admin-general/services/apiService';
import { toast } from 'react-toastify';

const ModelEditOrder = (props) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        orderId: '',
        payStatus: '',
        dayBooking: '',
        Reciever: '',
        shipStatus: '',
        address: '',
        phoneNumber: '',
        memberId: '',
        products: [
            {
                productName: '',
                price: '',
                quantity: '',
                image: ''
            }
        ],
        total: ''
    });
    const [prevFormData, setPrevFormData] = useState({
        orderId: '',
        payStatus: '',
        dayBooking: '',
        Reciever: '',
        shipStatus: '',
        address: '',
        phoneNumber: '',
        memberId: '',
        products: [
            {
                productName: '',
                price: '',
                quantity: '',
                image: ''
            }
        ],
        total: ''
    });


    const handleClose = () => {
        setShow(false)
        setPrevFormData({
            orderId: '',
            payStatus: '',
            dayBooking: '',
            Reciever: '',
            shipStatus: '',
            address: '',
            phoneNumber: '',
            memberId: '',
            products: [
                {
                    productName: '',
                    price: '',
                    quantity: '',
                    image: ''
                }
            ],
            total: ''
        });
    };
    const handleShow = () => {
        setShow(true);
        setPrevFormData(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let response = await getOrderById(props.id, props.memId);
        if (response) {
            let data = response;
            setFormData({
                orderId: data.orderId,
                payStatus: data.payStatus,
                dayBooking: data.dayBooking,
                Reciever: data.Reciever,
                shipStatus: data.shipStatus,
                address: data.address,
                phoneNumber: data.phoneNumber,
                memberId: data.memberId,
                products: data.products,
                total: data.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
            });
        }
        else {
            toast.error('Lỗi khi lấy dữ liệu sản phẩm');
        }
    };

    const handleSubmit = async () => {
        let type1 = '';
        let type2 = '';
        if(formData.payStatus === 'Paid'){
            type2 = 'pay';
        }
        else{
            type2 = 'unpay';
        }
        if(formData.shipStatus === 'Shipped'){
            type1 = 'ship';
        }   
        else{
            type1 = 'unship';
        }

        let changeContent = '';
        if (prevFormData.address !== formData.address) {
            changeContent += `Thay đổi địa chỉ của đơn hàng mã ${formData.orderId} từ ${prevFormData.address} thành ${formData.address}\n`;
        }
        if (prevFormData.phoneNumber !== formData.phoneNumber) {
            changeContent += `Thay đổi số điện thoại của đơn hàng mã ${formData.orderId} từ ${prevFormData.phoneNumber} thành ${formData.phoneNumber}\n`;
        }
        if (prevFormData.payStatus !== formData.payStatus) {
            changeContent += `Thay đổi trạng thái thanh toán của đơn hàng mã ${formData.orderId} từ ${prevFormData.payStatus} thành ${formData.payStatus}\n`;
        }
        if (prevFormData.shipStatus !== formData.shipStatus) {
            changeContent += `Thay đổi trạng thái giao hàng của đơn hàng mã ${formData.orderId} từ ${prevFormData.shipStatus} thành ${formData.shipStatus}\n`;
        }

        let data = await putUpdateOrder(props.id, type1, type2);
        if (data && data.message === 'Shipping status updated successfully') {
            console.log(changeContent)
            if (changeContent !== '') {
                console.log(changeContent);
                await handleCreateAdminAction(changeContent);
            }
            toast.success('Cập nhật đơn hàng thành công');
            fetchData();
            await props.refreshOrders();
        }
        else {
            toast.error('Lỗi khi cập nhật đơn hàng');
        }
        handleClose();
    };
    const handleCreateAdminAction = async (action) => {
        const dataAdd = {
            adminId: props.adminId,
            action: action
        };
        let data = await postNewAction(dataAdd);
        if (data && data.message === 'Action created') {
            console.log('Action created');
        };
    };
    return (
        <>
            <button className="mr-4" title="Edit" onClick={handleShow}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-blue-500 hover:fill-blue-700"
                    viewBox="0 0 348.882 348.882">
                    <path
                        d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                        data-original="#000000" />
                    <path
                        d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                        data-original="#000000" />
                </svg>
            </button>

            {show && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-start justify-center p-4 mt-16 sm:mt-20">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-2xl max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)]">
                                {/* Modal Header - Fixed at top */}
                                <div className="sticky top-0 bg-white px-4 py-3 border-b z-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
                                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Scrollable Content Area */}
                                <div className="overflow-y-auto p-4 max-h-[calc(90vh-8rem)] md:max-h-[calc(85vh-8rem)]">
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Left Column - Order Details */}
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mã đơn hàng</label>
                                                    <input
                                                        type="text"
                                                        name="orderId"
                                                        value={formData.orderId}
                                                        readOnly
                                                        disabled
                                                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mã thành viên</label>
                                                    <input
                                                        type="text"
                                                        name="memberId"
                                                        value={formData.memberId}
                                                        readOnly
                                                        disabled
                                                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Người nhận</label>
                                                    <input
                                                        type="text"
                                                        name="Reciever"
                                                        value={formData.Reciever}
                                                        readOnly
                                                        disabled
                                                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Ngày đặt</label>
                                                    <input
                                                        type="text"
                                                        name="dayBooking"
                                                        value={formData.dayBooking}
                                                        readOnly
                                                        disabled
                                                        className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
                                                    <select
                                                        name="payStatus"
                                                        onChange={handleChange}
                                                        value={formData.payStatus}
                                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                                    >
                                                        <option value="Pending">Chưa thanh toán</option>
                                                        <option value="Paid">Đã thanh toán</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái giao hàng</label>
                                                    <select
                                                        name="shipStatus"
                                                        onChange={handleChange}
                                                        value={formData.shipStatus}
                                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                                    >
                                                        <option value="Processing">Đang giao</option>
                                                        <option value="Shipped">Đã giao</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại</label>
                                                    <input
                                                        type="text"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Products */}
                                        <div className="h-full">
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Sản phẩm</label>
                                            <div className="space-y-2 overflow-y-auto max-h-[250px] pr-2 bg-gray-50 rounded-lg p-2">
                                                {formData.products && formData.products.map((product, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                                                        <img src={product.image} alt={product.productName} className="w-14 h-14 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{product.productName}</p>
                                                            <div className="flex gap-4 text-xs text-gray-500">
                                                                <span>Giá: {product.price}</span>
                                                                <span>SL: {product.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 border-t pt-3">
                                                <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                    <span className="text-sm font-medium text-gray-700">Tổng tiền:</span>
                                                    <span className="text-lg font-semibold text-gray-900">{formData.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Modal Footer - Fixed at bottom */}
                                <div className="sticky bottom-0 bg-gray-50 px-4 py-3 border-t">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ModelEditOrder;