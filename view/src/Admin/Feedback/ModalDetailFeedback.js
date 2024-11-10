import { useState, useEffect } from 'react';
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
        if (res && res.feedbacks) {
            const filteredFeedbacks = res.feedbacks.filter(
                feedback => feedback.productId === props.id
            );
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

            {show && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                {/* Modal Header */}
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="flex items-center justify-between pb-4">
                                        <h3 className="text-lg font-semibold">Đánh giá cho sản phẩm {props.id}</h3>
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
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Đóng
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
}

export default ModealDetailFeedback;