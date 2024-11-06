import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = (props) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-2xl p-5 cursor-pointer hover:-translate-y-2 transition-all relative"
      onClick={() => {
        navigate("/product/" + props.productId);
      }}
    >
      <div className="w-5/6 h-[210px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
        <img
          src={props.image}
          alt="Product 3"
          className="h-full w-full object-contain"
        />
      </div>

      <div>
        <h3 className="text-lg font-extrabold text-gray-800">
          {props.productName}
        </h3>
        <p className="text-gray-600 text-sm mt-2">{props.description}</p>
        <h4 className="text-lg text-gray-800 font-bold mt-4">${props.price}</h4>
      </div>
    </div>
  );
};

export default ProductCard;
