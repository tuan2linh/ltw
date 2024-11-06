import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/action/cartAction";

const ProductInfo = (props) => {
  const product = { ...props };
  const dispatch = useDispatch();
  return (
    <div className="font-sans">
      <div className="p-4 lg:max-w-5xl max-w-lg mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-6 max-lg:gap-12">
          <div className="w-full lg:sticky top-0 sm:flex gap-2">
            <img
              src={props.image}
              alt="Product"
              className="w-4/5 rounded-md object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {props.productName}
            </h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <p className="text-gray-800 text-xl font-bold">${props.price}</p>
            </div>

            <button
              type="button"
              className="w-full mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md"
              onClick={() => dispatch(addToCart(product))}
            >
              Thêm vào giỏ hàng
            </button>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">
                Thông tin về sản phẩm
              </h3>
              <ul className="space-y-3 list-disc mt-4 pl-4 text-sm text-gray-800">
                <li>Tên sản phẩm: {props.productName}</li>
                <li>Mô tả: {props.description}</li>
                <li>Giá: ${props.price}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
