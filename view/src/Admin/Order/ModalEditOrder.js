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
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                {/* Modal Header */}
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="flex items-center justify-between pb-4">
                                        <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>
                                        <button
                                            onClick={handleClose}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Keep existing form content */}
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                                            <input
                                                type="text"
                                                name="orderId"
                                                value={formData.orderId}
                                                readOnly
                                                disabled
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Người nhận</label>
                                            <input
                                                type="text"
                                                name="Reciever"
                                                value={formData.Reciever}
                                                readOnly
                                                disabled
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Ngày đặt</label>
                                            <input
                                                type="text"
                                                name="dayBooking"
                                                value={formData.dayBooking}
                                                readOnly
                                                disabled
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Trạng thái thanh toán</label>
                                            <select
                                                name="payStatus"
                                                onChange={handleChange}
                                                value={formData.payStatus}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="Pending">Chưa thanh toán</option>
                                                <option value="Paid">Đã thanh toán</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Trạng thái giao hàng</label>
                                            <select
                                                name="shipStatus"
                                                onChange={handleChange}
                                                value={formData.shipStatus}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="Processing">Đang giao</option>
                                                <option value="Shipped">Đã giao</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mã thành viên</label>
                                            <input
                                                type="text"
                                                name="memberId"
                                                value={formData.memberId}
                                                readOnly
                                                disabled
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
                                            <div className="grid grid-cols-4 gap-4">
                                                {formData.products && formData.products.map((product, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-2">
                                                        <img src={product.image} alt={product.productName} className="w-full h-20 object-cover" />
                                                        <p className="text-sm font-medium text-gray-700">{product.productName}</p>
                                                        <p className="text-sm font-medium text-gray-700">{product.price}</p>
                                                        <p className="text-sm font-medium text-gray-700">{product.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tổng tiền</label>
                                            <input
                                                type="text"
                                                name="total"
                                                value={formData.total}
                                                readOnly
                                                disabled
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                    </form>

                                    {/* Modal Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Hủy
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