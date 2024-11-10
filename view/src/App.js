import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import OrderList from "./pages/OrderList";
import Profile from "./pages/Profile";


//admin
import Admin from "./Admin/Admin";
import ManageUser from './Admin/User/ManageUser';
import ManageProduct from './Admin/Product/ManageProduct';
import DashBoard from './Admin/DashBoard/DashBoard';
import ManagerOrder from './Admin/Order/ManagerOrder';
import ManageFeedback from './Admin/Feedback/ManagerFeedBack';
import LoginAdmin from './Admin/Auth/Login'
import AdminHistory from "./Admin/AdminHistory/AdminHistory";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/order" element={<Order />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/profile" element={<Profile />} />

        {/* admin */}
        <Route path="/admins" element={<Admin />}>
          <Route index element={<DashBoard />} />
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-products" element={<ManageProduct />} />
          <Route path="manage-orders" element={<ManagerOrder />} />
          <Route path="manage-feedback" element={<ManageFeedback />} />
          <Route path="admin-history" element={<AdminHistory />} />
        </Route>
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/login" element={<Login />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
