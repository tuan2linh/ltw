import { useState } from 'react';
import { addNewProduct, postNewAction } from '../admin-general/services/apiService';
import { toast } from 'react-toastify';

const ModalAddProduct = (props) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        description: '',
        imageUrl: ''
    });
    const [prevFormData, setPrevFormData] = useState({
        productName: '',
        price: '',
        description: '',
        imageUrl: ''
    });

    const [previewImage, setPreviewImage] = useState('');

    const handleClose = () => {
        setShow(false);
        setPrevFormData({
            productName: '',
            price: '',
            description: '',
            imageUrl: ''
        });
    }
    const handleShow = () => {
        setShow(true)
        setPrevFormData(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Update preview when imageUrl changes
        if (name === 'imageUrl') {
            setPreviewImage(value);
        }
    };

    const handleSubmit = async () => {
        let changeContent = `Thêm sản phẩm mới có tên là ${formData.productName}`;
        console.log(formData);
        let response = await addNewProduct(formData);
        if (response && response.status) {
                await handleCreateAdminAction(changeContent);
                toast.success('Thêm sản phẩm thành công');
                setFormData({
                    productName: '',
                    price: '',
                    description: '',
                    imageUrl: ''
                });
                setPreviewImage('');
        }
        else {
            toast.error(response.message);
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
            <button onClick={handleShow} 
                className="inline-flex items-center justify-center rounded-full border-none outline-none bg-purple-600 hover:bg-purple-700 active:bg-purple-600 px-4 py-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14px" fill="#fff" className="inline mr-2" viewBox="0 0 512 512">
                    <path d="M467 211H301V45c0-24.853-20.147-45-45-45s-45 20.147-45 45v166H45c-24.853 0-45 20.147-45 45s20.147 45 45 45h166v166c0 24.853 20.147 45 45 45s45-20.147 45-45V301h166c24.853 0 45-20.147 45-45s-20.147-45-45-45z" />
                </svg>
                Thêm sản phẩm mới
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
                                        <h3 className="text-lg font-semibold">Thêm sản phẩm mới</h3>
                                        <button
                                            onClick={handleClose}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                            <input
                                                type="text"
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleChange}
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Giá</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={3}
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">URL hình ảnh</label>
                                            <input
                                                type="text"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleChange}
                                                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:bg-white hover:bg-gray-100 outline-none transition-colors duration-200"
                                            />
                                            {previewImage && (
                                                <div className="mt-2 flex justify-center">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="block max-w-full h-48 object-contain rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/150?text=Preview+Image';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
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

export default ModalAddProduct;