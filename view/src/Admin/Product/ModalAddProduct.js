import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { addNewProduct } from '../admin-general/services/apiService';
import { toast } from 'react-toastify';

const ModalAddProduct = () => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        description: '',
        imageUrl: ''
    });
    const [previewImage, setPreviewImage] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        // TODO: Add validation and API call
        console.log(formData);
        let response = await addNewProduct(formData);
        if (response && response.status) {
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

    return (
        <>
            <button onClick={handleShow} 
                className="inline-flex items-center justify-center rounded-full border-none outline-none bg-purple-600 hover:bg-purple-700 active:bg-purple-600 px-4 py-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14px" fill="#fff" className="inline mr-2" viewBox="0 0 512 512">
                    <path d="M467 211H301V45c0-24.853-20.147-45-45-45s-45 20.147-45 45v166H45c-24.853 0-45 20.147-45 45s20.147 45 45 45h166v166c0 24.853 20.147 45 45 45s45-20.147 45-45V301h166c24.853 0 45-20.147 45-45s-20.147-45-45-45z" />
                </svg>
                Thêm sản phẩm mới
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm sản phẩm mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="space-y-4">
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
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalAddProduct;