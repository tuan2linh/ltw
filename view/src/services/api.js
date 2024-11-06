import axiosInstance from "../axios/axios";

export const apiService = {
  readProducts: () =>
    axiosInstance.get("/product/read.php", { requiresAuth: false }),
  readProductById: (id) =>
    axiosInstance.get(`product/show.php?productId=${id}`, {
      requiresAuth: false,
    }),
  readFeedbacks: () =>
    axiosInstance.get("/feedback/read.php", { requiresAuth: false }),
  login: (credentials) =>
    axiosInstance.post("/authenticate/login.php", JSON.stringify(credentials)),
  register: (userInfos) =>
    axiosInstance.post("/authenticate/register.php", JSON.stringify(userInfos)),
  createOrder: (orderInfos) =>
    axiosInstance.post("/order/create.php", JSON.stringify(orderInfos)),
  readOrders: () => axiosInstance.get("/order/read.php"),
  readInfoMember: () => axiosInstance.get("/member/show.php"),
  updateInfoMember: (memberInfos) =>
    axiosInstance.put("/member/update.php", JSON.stringify(memberInfos)),
  createFeedback: (feedbackInfos) => axiosInstance.post("/feedback/create.php", JSON.stringify(feedbackInfos)),
};

export default apiService;
