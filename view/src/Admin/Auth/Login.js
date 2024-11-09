import { useState } from "react";
import './Login.scss'
import { useNavigate } from "react-router-dom";
import { postLogin } from "../admin-general/services/apiService";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/action/authAction";

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        // const isValidEmail = validateEmail(email);
        if (!username) {
            toast.error('Invalid email')
            return;
        }
        if (!password) {
            toast.error('Invalid password')
            return;
        }
        let data = await postLogin(username, password);
        if (data && data.message === 'Login successful') {  
            const adminData = {
                id: data.admin.id,
                username: data.admin.username,
                role: data.role,
                token: data.token,
            };
            dispatch(loginSuccess(adminData));
            toast.success(data.message);
            navigate('/admins');
        }
        if (data && data.message !== 'Login successful') {
            toast.error(data.message);
        }
    }

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://saotrucdaoduy.com/wp-content/uploads/2022/07/z3532944604603_c7f4c10d5f37d4c987fa30260fa6620c.jpg" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>

            <div className="lg:p-36 md:p-52 sm:20 p-8 pt-0 w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-20 text-center">Đóm Bán Sáo</h1>
                <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-600">Tên đăng nhập</label>
                    <input type="text" id="username" name="username" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-600">Mật khẩu</label>
                    <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <input type="checkbox" id="remember" name="remember" className="text-blue-500" />
                    <label htmlFor="remember" className="text-gray-600 ml-2">Ghi nhớ tôi</label>
                </div>
                <div className="mb-6 text-blue-500">
                    <a href="#" className="hover:underline">Quên mật khẩu?</a>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                    onClick={() => handleLogin()}
                >Đăng nhập</button>
                <div className="mt-6 text-blue-500 text-center">
                    <button onClick={() => navigate('/register')} className="hover:underline text-blue-500">
                        Chưa có tài khoản? Đăng kí tại đây
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/admins')} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4">Về trang chủ</button>
                </div>
            </div>
        </div>
    )
}

export default Login;