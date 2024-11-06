import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import ProductNewList from "../components/Home/ProductNewList";
import { useEffect } from "react";
import { scrollToTop } from "../helper/scrollToTop";
const Home = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <Header />
      <div className="banner">
        <div className="relative">
          <div className="absolute inset-0 bg-black/100" />

          <img
            src="https://down-vn.img.susercontent.com/file/22bd054b3eef24a5f5e7c08de6aeaf30.webp"
            alt="Travel destination"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative min-h-[350px] flex flex-col items-center justify-center p-6 text-white">
            <h2 className="text-5xl font-extrabold mb-6 text-white-300 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] hover:scale-105 transition-transform duration-300">
              Sáo Trúc Chính Hãng
            </h2>
            <p className="text-xl text-gray-100 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] tracking-wide max-w-xl text-center font-bold">
              Khơi Dậy Đam Mê Âm Nhạc Với Những Cây Sáo Tuyệt Đẹp - Âm Thanh
              Tinh Tế, Phong Cách Độc Đáo!
            </p>

            <button className="mt-8 px-6 py-3 border-2 border-solid border-white rounded-lg hover:bg-white hover:text-black font-bold" onClick={() => navigate("/shop")}>
              Xem ngay
            </button>
          </div>
        </div>
      </div>

      <ProductNewList />

      <Footer />
    </div>
  );
};

export default Home;
