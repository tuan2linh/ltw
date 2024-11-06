import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "../components/Product/ProductInfo";
import Review from "../components/Product/Review";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import apiService from "../services/api";
import { scrollToTop } from "../helper/scrollToTop";
const Product = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  const { id } = useParams();

  const [productData, setProductData] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    try {
      apiService.readProductById(id).then((res) => {
        setProductData(res.data);
      });
    } catch (error) {
      console.log(error);
    }

    try {
      apiService.readFeedbacks().then((res) => {
        const feedbacks = res?.data?.feedbacks?.filter(
          (feedback) => +feedback.productId === +id
        );
        setFeedbacks(feedbacks);
      });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  return (
    <div className="product-page">
      <Header />
      <ProductInfo {...productData} />
      <Review feedbacks={feedbacks} productId={id} />
      <Footer />
    </div>
  );
};

export default Product;
