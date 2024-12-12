import axios from "axios";
import { store } from "../redux/store";
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://bengal-eminent-lamprey.ngrok-free.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor cho request
instance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token && config.requiresAuth !== false) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Interceptor cho response
// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       // Xử lý lỗi unauthorized (ví dụ: đăng xuất người dùng)
//     }
//     return Promise.reject(error);
//   }
// );

export default instance;
