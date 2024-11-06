import React from "react";
import CheckoutForm from "../components/Order/CheckoutForm";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useEffect } from "react";
import { scrollToTop } from "../helper/scrollToTop";
const Order = () => {
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <>
      <Header />
      <CheckoutForm />
      <Footer />
    </>
  );
};

export default Order;
