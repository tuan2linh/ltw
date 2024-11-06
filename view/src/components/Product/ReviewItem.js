import React from "react";

const ReviewItem = ({ name, time, text, rating }) => {
  return (
    <div className="flex items-start mt-4">
      <img
        src="https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/03/avatar-nu-nguoi-that-1.jpg"
        className="w-12 h-12 rounded-full border-2 border-white"
        alt="Reviewer"
      />
      <div className="ml-3">
        <h4 className="text-sm font-bold text-gray-800">{name}</h4>
        <div className="flex space-x-1 mt-1">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-4 ${index < rating ? 'fill-blue-600' : 'fill-[#CED5D8]'}`}
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
            </svg>
          ))}
        </div>
        <p className="text-sm mt-4 text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
