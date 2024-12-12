import axios from '../utils/axiosCustomize';

const postCreateNewUser = (email, password, username, role, image) => {

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("username", username);
    data.append("role", role);
    data.append("userImage", image);
    return axios.post("/api/v1/participant", data);
}

// Dashboard

const getActionandInfo = () => {
    const getCurrentDate = () => {
        // Create date object in local timezone
        const date = new Date();
        // Add timezone offset
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        // Format to YYYY-MM-DD
        return localDate.toISOString().split('T')[0];
    };
    return axios.get('/api/action/action.php', { 
        params: {
            date: getCurrentDate()
        }
    });
}

const getAllUsers = () => {
    return axios.get("/api/member/read.php");
}

const deleteUser = (id) => {
    return axios.delete('/api/v1/participant', { data: { id: id } });
}

const getUserWithPaginate = (page, limit) => {
    return axios.get(`/api/v1/participant?page=${page}&limit=${limit}`)
}

const postLogin = async (userName, userPassword) => {
    return axios.post(`/api/authenticate/login.php`,
        { username: userName, password: userPassword }
    );
}

const postRegister = async (password, username,fullName,dob,phone) => {
    return axios.post('/api/authenticate/register.php', { password, username,fullName,birth: dob,phoneNumber: phone });
}

const postLogout = async (token) => {
    return axios.post('/api/authenticate/logout.php',{token: token});
}

const getUserById = (id) => {
    return axios.get(`/api/member/show.php?memberId=${id}`);
}
const putUpdateUser = (id,data) => {
    return axios.put(`/api/member/update.php?memberId=${id}`, data);
}

// Product
const getAllProducts = () => {
    return axios.get('/api/product/read.php');
}
const addNewProduct = (data) => {
    return axios.post('/api/product/create.php', data);
}
const getProductById = (id) => {
    return axios.get(`/api/product/show.php?productId=${id}`);
}
const putUpdateProduct = (data) => {
    return axios.put('/api/product/update.php', data);
}
const deleteProduct = (id) => {
    return axios.delete(`/api/product/delete.php?productId=${id}`);
}

// Order
const getAllOrders = () => {
    return axios.get('/api/order/read.php');
}
const getOrderById = (id,memId) => {
    return axios.get(`/api/order/show.php?orderId=${id}&memberId=${memId}`);
}
const putUpdateOrder = (id, type1,type2) => {
    return axios.put(`/api/order/updateAdmin.php?orderId=${id}&type1=${type1}&type2=${type2}`);
}

// feedback
const getAllFeedbacks = () => {
    return axios.get('/api/feedback/read.php');
}

// admin history
const getAllAdminHistory = () => {
    return axios.get('/api/adminActionHistory/read.php');
}
const postNewAction = (data) => {
    return axios.post('/api/adminActionHistory/create.php', data);
}

const getAllAdmin = () => {
    return axios.get('/api/administrator/read.php');
}

export {
    postCreateNewUser,
    getAllUsers,
    putUpdateUser,
    deleteUser,
    getUserWithPaginate,
    postLogin,
    postRegister,
    getAllProducts,
    getAllOrders,
    getActionandInfo,
    postLogout,
    addNewProduct,
    getProductById,
    putUpdateProduct,
    getUserById,
    getOrderById,
    putUpdateOrder,
    getAllFeedbacks,
    getAllAdminHistory,
    getAllAdmin,
    postNewAction,
    deleteProduct
};  