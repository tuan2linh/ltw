import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../helper/showToast";
import { clearCart } from "../../redux/action/cartAction";
import apiService from "../../services/api";
const CheckoutItem = (props) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-3 shrink-0 bg-gray-300 rounded-md">
        <img
          src={props.image}
          className="w-full object-contain"
          alt={props.productName}
        />
      </div>
      <div className="w-full">
        <h3 className="text-base text-white">{props.productName}</h3>
        <ul className="text-xs text-gray-300 space-y-2 mt-2">
          <li className="flex flex-wrap gap-4">
            Số lượng <span className="ml-auto">{props.quantity}</span>
          </li>
          <li className="flex flex-wrap gap-4">
            Tổng tiền
            <span className="ml-auto">${props.price * props.quantity}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState("");
  const [Reciever, setReciever] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCancelOrder = () => {
    showToast.warning("Đã hủy đặt hàng");
    navigate("/");
  };

  const handleCompleteOrder = () => {
    const orderInfos = {
      payStatus: "Pending",
      Reciever,
      phoneNumber,
      address,
      products: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    apiService.createOrder(orderInfos).then((res) => {
      if (res?.data?.message !== "Tạo đơn hàng thành công") {
        showToast.error(res?.data?.message);
        return;
      }
      showToast.success("Đã hoàn thành đặt hàng");
      dispatch(clearCart());
      navigate("/");
    });
  };

  return (
    <div className="font-[sans-serif] bg-white container mx-auto">
      <div className="flex max-sm:flex-col gap-12 max-lg:gap-4 h-full">
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 sm:h-screen sm:sticky sm:top-0 lg:min-w-[370px] sm:min-w-[300px]">
          <div className="relative h-full">
            <div className="px-4 py-8 sm:overflow-auto sm:h-[calc(100vh-60px)]">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CheckoutItem key={item.id} {...item} />
                ))}
              </div>
            </div>

            <div className="md:absolute md:left-0 md:bottom-0 bg-gray-800 w-full p-4">
              <h4 className="flex flex-wrap gap-4 text-base text-white">
                Tổng <span className="ml-auto">${totalPrice}</span>
              </h4>
            </div>
          </div>
        </div>

        <div className="max-w-4xl w-full h-max rounded-md px-4 py-8 sticky top-0">
          <h2 className="text-2xl font-bold text-gray-800">
            Hoàn thành đặt hàng
          </h2>
          <form className="mt-8">
            <div>
              <h3 className="text-base text-gray-800 mb-4">
                Thông tin khách hàng
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Họ"
                    onChange={(e) =>
                      setReciever(
                        e.target.value +
                          " " +
                          document.querySelector('input[placeholder="Tên"]')
                            .value
                      )
                    }
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Tên"
                    onChange={(e) =>
                      setReciever(
                        document.querySelector('input[placeholder="Họ"]')
                          .value +
                          " " +
                          e.target.value
                      )
                    }
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">
                Địa chỉ giao hàng
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tỉnh/Thành phố"
                    onChange={(e) => {
                      const city = e.target.value;
                      const district = document.querySelector(
                        'input[placeholder="Huyện/Quận"]'
                      ).value;
                      const ward = document.querySelector(
                        'input[placeholder="Xã/Thị trấn"]'
                      ).value;
                      const street = document.querySelector(
                        'input[placeholder="Số nhà, đường"]'
                      ).value;
                      setAddress(
                        `${street}, ${ward}, ${district}, ${city}`.trim()
                      );
                    }}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Huyện/Quận"
                    onChange={(e) => {
                      const district = e.target.value;
                      const city = document.querySelector(
                        'input[placeholder="Tỉnh/Thành phố"]'
                      ).value;
                      const ward = document.querySelector(
                        'input[placeholder="Xã/Thị trấn"]'
                      ).value;
                      const street = document.querySelector(
                        'input[placeholder="Số nhà, đường"]'
                      ).value;
                      setAddress(
                        `${street}, ${ward}, ${district}, ${city}`.trim()
                      );
                    }}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Xã/Thị trấn"
                    onChange={(e) => {
                      const ward = e.target.value;
                      const city = document.querySelector(
                        'input[placeholder="Tỉnh/Thành phố"]'
                      ).value;
                      const district = document.querySelector(
                        'input[placeholder="Huyện/Quận"]'
                      ).value;
                      const street = document.querySelector(
                        'input[placeholder="Số nhà, đường"]'
                      ).value;
                      setAddress(
                        `${street}, ${ward}, ${district}, ${city}`.trim()
                      );
                    }}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Số nhà, đường"
                    onChange={(e) => {
                      const street = e.target.value;
                      const city = document.querySelector(
                        'input[placeholder="Tỉnh/Thành phố"]'
                      ).value;
                      const district = document.querySelector(
                        'input[placeholder="Huyện/Quận"]'
                      ).value;
                      const ward = document.querySelector(
                        'input[placeholder="Xã/Thị trấn"]'
                      ).value;
                      setAddress(
                        `${street}, ${ward}, ${district}, ${city}`.trim()
                      );
                    }}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 max-md:flex-col mt-8">
                <button
                  type="button"
                  className="rounded-md px-6 py-3 w-full text-sm tracking-wide bg-transparent hover:bg-gray-100 border-solid border-2 border-gray-300 text-gray-800 max-md:order-1"
                  onClick={() => handleCancelOrder()}
                >
                  Hủy đặt hàng
                </button>
                <button
                  type="button"
                  className="rounded-md px-6 py-3 w-full text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleCompleteOrder()}
                >
                  Hoàn thành đặt hàng
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
