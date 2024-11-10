import { useState,useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { getProductById, putUpdateProduct, postNewAction } from '../admin-general/services/apiService';
import { toast } from 'react-toastify';

const ModalEditProduct = (props) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        description: '',
        image: ''
    });
    const [prevFormData, setPrevFormData] = useState({
        productName: '',
        price: '',
        description: '',
        image: ''
    });

    const [previewImage, setPreviewImage] = useState('');

    const handleClose = () => {
        setShow(false);
        setPrevFormData({
            productName: '',
            price: '',
            description: '',
            image: ''
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
        
        // Update preview when image changes
        if (name === 'image') {
            setPreviewImage(value);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let response = await getProductById(props.id);
        if (response) {
            let data = response;
            setFormData({
                productName: data.productName,
                price: data.price,
                description: data.description,
                image: data.image
            });
            setPreviewImage(data.image);
        }
        else {
            toast.error('Lỗi khi lấy dữ liệu sản phẩm');
        }
    };

    const handleSubmit = async () => {
        let changeContent = '';
        if (prevFormData.productName !== formData.productName) {
            changeContent += `Thay đổi tên sản phẩm có ID ${props.id} từ ${prevFormData.productName} thành ${formData.productName}\n`;
        }
        if (prevFormData.price !== formData.price) {
            changeContent += `Thay đổi giá sản phẩm có ID ${props.id} từ ${prevFormData.price} thành ${formData.price}\n`;
        }
        if (prevFormData.description !== formData.description) {
            changeContent += `Thay đổi mô tả sản phẩm có ID ${props.id} từ ${prevFormData.description} thành ${formData.description}\n`;
        }
        if (prevFormData.image !== formData.image) {
            changeContent += `Thay đổi URL hình ảnh sản phẩm có ID ${props.id} từ ${prevFormData.image} thành ${formData.image}\n`;
        }
        // TODO: Add validation and API call
        // thêm froductId vào formData
         let formDataFull = {
            ...formData,
            productId: props.id
        };
        console.log(formDataFull);
        let data = await putUpdateProduct(formDataFull);
        if (data && data.message==='Product updated') {
            if (changeContent !== '') {
                await handleCreateAdminAction(changeContent);
            }
            toast.success('Cập nhật sản phẩm thành công');
            fetchData();
            await props.refreshProducts();
        };
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
                                name="image"
                                value={formData.image}
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

export default ModalEditProduct;