import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBox,
  FaCalendar,
} from "react-icons/fa";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import apiService from "../services/api";

const OrderList = () => {
  //   const orders = {
  //     data: [
  //       {
  //         orderId: 4,
  //         payStatus: "Pending",
  //         dayBooking: "2024-11-02",
  //         Reciever: "Hồ Hùng",
  //         shipStatus: "Processing",
  //         address: "123 Street",
  //         phoneNumber: "1234567890",
  //         cartId: null,
  //         products: [
  //           {
  //             productId: 1,
  //             productName: "Sáo Trúc A",
  //             price: "15.99",
  //             quantity: 4,
  //             image:
  //               "https://saotrucdaoduy.com/wp-content/uploads/2022/07/z3532944604603_c7f4c10d5f37d4c987fa30260fa6620c.jpg",
  //           },
  //           {
  //             productId: 2,
  //             productName: "Sáo Trúc B",
  //             price: "18.49",
  //             quantity: 1,
  //             image:
  //               "https://saotrucdaoduy.com/wp-content/uploads/2022/07/z3532942324485_165582f4ee548f8806ec4b9179c05e67.jpg",
  //           },
  //         ],
  //       },
  //       {
  //         orderId: 5,
  //         payStatus: "Pending",
  //         dayBooking: "2024-11-02",
  //         Reciever: "ádf ádf",
  //         shipStatus: "Processing",
  //         address: "2345, 2345, 2345, 452",
  //         phoneNumber: "0345812806",
  //         cartId: null,
  //         products: [
  //           {
  //             productId: 24,
  //             productName: "Sáo Trúc X",
  //             price: "21.49",
  //             quantity: 1,
  //             image:
  //               "https://saotrucdaoduy.com/wp-content/uploads/2021/11/2021_11_20_14_41_IMG_6716.jpg",
  //           },
  //         ],
  //       },
  //       {
  //         orderId: 6,
  //         payStatus: "Pending",
  //         dayBooking: "2024-11-02",
  //         Reciever: "ádf ádf",
  //         shipStatus: "Processing",
  //         address: "2345, 2345, 2345, 452",
  //         phoneNumber: "0345812806",
  //         cartId: null,
  //         products: [
  //           {
  //             productId: 25,
  //             productName: "Sáo Trúc Y",
  //             price: "23.99",
  //             quantity: 1,
  //             image:
  //               "https://saotrucdaoduy.com/wp-content/uploads/2021/06/z2584514545497_c1b473464a406373d93bc757c06a6772-1.jpg",
  //           },
  //         ],
  //       },
  //       {
  //         orderId: 7,
  //         payStatus: "Pending",
  //         dayBooking: "2024-11-02",
  //         Reciever: "ádf ádf",
  //         shipStatus: "Processing",
  //         address: "2345, 2345, 2345, 452",
  //         phoneNumber: "0345812806",
  //         cartId: null,
  //         products: [
  //           {
  //             productId: 2,
  //             productName: "Sáo Trúc B",
  //             price: "18.49",
  //             quantity: 1,
  //             image:
  //               "https://saotrucdaoduy.com/wp-content/uploads/2022/07/z3532942324485_165582f4ee548f8806ec4b9179c05e67.jpg",
  //           },
  //         ],
  //       },
  //     ],
  //   };

  const [orders, setOrders] = useState({});
  const [sortedOrders, setSortedOrders] = useState([]);
  // Fetch orders from the API
  useEffect(() => {
    apiService
      .readOrders()

      .then((response) => {
        setOrders(response?.data);
        if (response?.data?.data) {
          setSortedOrders(
            [...response.data.data].sort((a, b) => {
              return b.orderId - a.orderId;
            })
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi >>>>>>>>>>", error);
      });

  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Đơn hàng của bạn
        </h1>

        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-blue-100 p-6 border-b">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FaBox className="text-blue-600" />
                      <span className="font-semibold text-lg">
                        Đơn hàng #{order.orderId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar className="text-gray-400" />
                      <span>{order.dayBooking}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
                      ${
                        order.payStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {order.payStatus}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
                      ${
                        order.shipStatus === "Processing"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      {order.shipStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Người nhận</p>
                      <p className="font-medium">{order.Reciever}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{order.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium">{order.address}</p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div
                      key={product.productId}
                      className="flex gap-6 items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {product.productName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Quantity: {product.quantity}</span>
                          <span>Price: ${product.price}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-semibold text-lg">
                          $
                          {(
                            product.quantity * parseFloat(product.price)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderList;
