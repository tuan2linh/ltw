import { useState } from 'react';
import './Register.scss';
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../admin-general/services/apiService';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const Register = (props) => {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");

    const [isShowPassword, setIsShowPassword] = useState(false);

    const navigate = useNavigate();

    // const validateEmail = (email) => {
    //     return String(email)
    //         .toLowerCase()
    //         .match(
    //             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //         );
    // };

    const handleRegister = async () => {
        // const isValidEmail = validateEmail(email);
        // if (!isValidEmail) {
        //     toast.error('Invalid email');
        //     return;
        // }
        if (!username) {
            toast.error('Invalid username');
            return;
        }
        if (!password) {
            toast.error('Invalid password');
            return;
        }
        if (!fullName) {
            toast.error('Invalid full name');
            return;
        }
        if (!dob) {
            toast.error('Invalid date of birth');
            return;
        }
        if (!phone) {
            toast.error('Invalid phone');
            return;
        }

        let data = await postRegister(password, username, fullName, dob, phone);
        if (data && data.message === 'User registered successfully with cart') {
            toast.success(data.message);
            navigate('/login-admin');
        }
        if (data && data.message !== 'User registered successfully with cart') {
            toast.error(data.message);
        }
        // if (data && data.EC === 0) {
        //     toast.success(data.EM);
        //     navigate('/login');
        // }

        // if (data && +data.EC !== 0) {
        //     toast.error(data.EM);
        // }
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://saotrucdaoduy.com/wp-content/uploads/2022/07/z3532944604603_c7f4c10d5f37d4c987fa30260fa6620c.jpg" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 pb-0 pt-0 w-full lg:w-1/2">
                <h1 className="text-3xl font-bold mb-6 text-center">Đóm Bán Sáo</h1>
                <h1 className="text-2xl font-semibold mb-4">Đăng kí</h1>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-600">Tên đăng nhập</label>
                    <input type="text" id="username" name="username" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-gray-600">Mật khẩu</label>
                    <div className="relative">
                        <input type={isShowPassword ? "text" : "password"} id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:border-blue-500" autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? <VscEye /> : <VscEyeClosed />}
                        </span>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-600">Họ tên đầy đủ</label>
                    <input type="text" id="fullName" name="fullName" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dob" className="block text-gray-600">Ngày sinh</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                        autoComplete="off"
                        min="1900-01-01" // Set reasonable minimum date
                        max={new Date().toISOString().split('T')[0]} // Max date is today
                        value={dob}
                        onChange={(e) => {
                            const selectedDate = e.target.value;
                            // Ensure date is in YYYY-MM-DD format
                            const formattedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';
                            setDob(formattedDate);
                        }}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-600">Số điện thoại</label>
                    <input type="text" id="phone" name="phone" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                    onClick={() => handleRegister()}
                >Đăng kí</button>
                <div className="mt-6 text-blue-500 text-center">
                    <button onClick={() => navigate('/login')} className="hover:underline text-blue-500">
                        Đã có tài khoản? Đăng nhập tại đây
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4">Về trang chủ</button>
                </div>
            </div>
        </div>
    );
}

export default Register;