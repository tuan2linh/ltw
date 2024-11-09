import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getAllFeedbacks } from '../admin-general/services/apiService';

function ModealDetailFeedback(props) {
    const [show, setShow] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchFeedbacks();
    };

    const fetchFeedbacks = async () => {
        let res = await getAllFeedbacks();
        console.log(res);
        if (res && res.feedbacks) {
            const filteredFeedbacks = res.feedbacks.filter(
                feedback => feedback.productId === props.id
            );
            console.log(filteredFeedbacks);
            setFeedbacks(filteredFeedbacks);
        }
    };

    return (
        <>
            <button className="mr-4" title="View Feedbacks" onClick={handleShow}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 fill-blue-500 hover:fill-blue-700"
                    viewBox="0 0 348.882 348.882">
                    <path d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z" />
                    <path d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z" />
                </svg>
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá cho sản phẩm {props.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback, index) => (
                            <div key={index} className="border-b p-4">
                                {/* First row - User ID and Rating */}
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div className="flex items-center">
                                        <span className="font-medium">User ID: {feedback.memberId}</span>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className="w-4 h-4 inline"
                                                viewBox="0 0 14 13"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z"
                                                    fill={star <= feedback.rating ? "#facc15" : "#CED5D8"}
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Second row - Comment */}
                                <textarea 
                                    className="w-full mt-2 p-2 bg-gray-50 rounded border border-gray-200" 
                                    value={feedback.comment}
                                    readOnly
                                    rows="2"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No feedbacks available for this product.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModealDetailFeedback;