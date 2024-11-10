import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { postLogout } from "../admin-general/services/apiService";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/action/authAction";
// import { doLogout } from "../admin-general/redux/action/userAction";
import { toast } from 'react-toastify';

const Header = (pros) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    // const acccount = useSelector((state) => state.user.account);
    const token = useSelector((state) => state.auth.token);
    const info = useSelector((state) => state.auth);


    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const [toggle, setToggle] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        // Update activeTab based on the current path
        if (location.pathname.includes('/admins/manage-users')) {
            setActiveTab('users');
        } else if (location.pathname.includes('/admins/manage-products')) {
            setActiveTab('products');
        } else if (location.pathname.includes('/admins/manage-orders')) {
            setActiveTab('orders');
        } else if (location.pathname.includes('/admins/manage-feedback')) {
            setActiveTab('reviews');
        }else if (location.pathname.includes('/admins/admin-history')) {
            setActiveTab('');
        }
         else {
            setActiveTab('dashboard');
        }
    }, [location.pathname]);

    const handleToggle = () => {
        setToggle(!toggle);
    };
    const handleView = (path, tab) => {
        setActiveTab(tab);
        navigate(path);
        if(tab === 'admin-history'){
            handleToggle();
        }
    };

    const handleLogin = () => {
        navigate('/login-admin');
    };

    const handleLogout = async () => {
        let data = await postLogout(token);
        if (data && data.message === 'Logout successful') {
            dispatch(logout());
            toast.success(data.message);
            navigate('/admins');
        }
        if (data && data.message !== 'Logout successful') {
            toast.error(data.message);
        }
    };

    return (
        <>
            <header className='flex shadow-sm py-3 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50'>
                <div className='flex flex-wrap items-center justify-between lg:gap-y-4 gap-y-6 gap-x-4 w-full'>
                    <a href="#"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" className='w-36' />
                    </a>

                    <div id="collapseMenu"
                        className='max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-40 max-lg:before:inset-0 max-lg:before:z-50'>
                        <button id="toggleClose" className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-black" viewBox="0 0 320.591 320.591">
                                <path
                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                    data-original="#000000"></path>
                                <path
                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                    data-original="#000000"></path>
                            </svg>
                        </button>

                        <ul
                            className='lg:flex lg:gap-x-10 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-2/3 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-4 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50 pt-3'>
                            <li className={`max-lg:border-b max-lg:py-3 max-lg:px-3 relative lg:after:absolute lg:after:bg-black ${activeTab === 'dashboard' ? 'lg:after:w-full' : 'lg:after:w-0'} lg:after:h-[2px] lg:after:block lg:after:top-6 lg:after:transition-all lg:after:duration-300`}>
                                <a href='#' className='text-black block text-[15px] no-underline flex items-center' onClick={() => handleView('/admins', 'dashboard')}>Bảng điều khiển</a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-3 max-lg:px-3 relative lg:after:absolute lg:after:bg-black ${activeTab === 'users' ? 'lg:after:w-full' : 'lg:after:w-0'} lg:after:h-[2px] lg:after:block lg:after:top-6 lg:after:transition-all lg:after:duration-300`}>
                                <a href='#' className='text-black block text-[15px] no-underline flex items-center' onClick={() => handleView('/admins/manage-users', 'users')}>Người dùng</a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-3 max-lg:px-3 relative lg:after:absolute lg:after:bg-black ${activeTab === 'products' ? 'lg:after:w-full' : 'lg:after:w-0'} lg:after:h-[2px] lg:after:block lg:after:top-6 lg:after:transition-all lg:after:duration-300`}>
                                <a href='#' className='text-black block text-[15px] no-underline flex items-center' onClick={() => handleView('/admins/manage-products', 'products')}>Sản phẩm</a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-3 max-lg:px-3 relative lg:after:absolute lg:after:bg-black ${activeTab === 'orders' ? 'lg:after:w-full' : 'lg:after:w-0'} lg:after:h-[2px] lg:after:block lg:after:top-6 lg:after:transition-all lg:after:duration-300`}>
                                <a href='#' className='text-black block text-[15px] no-underline flex items-center' onClick={() => handleView('/admins/manage-orders', 'orders')}>Đơn hàng</a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-3 max-lg:px-3 relative lg:after:absolute lg:after:bg-black ${activeTab === 'reviews' ? 'lg:after:w-full' : 'lg:after:w-0'} lg:after:h-[2px] lg:after:block lg:after:top-6 lg:after:transition-all lg:after:duration-300`}>
                                <a href='#' className='text-black block text-[15px] no-underline flex items-center' onClick={() => handleView('/admins/manage-feedback', 'reviews')}>Đánh giá sản phẩm</a>
                            </li>
                        </ul>
                    </div>

                    <div className='flex items-center max-sm:ml-auto space-x-6'>
                        <ul>
                            <li
                                className="relative px-1 after:absolute after:bg-black after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer hover:fill-black"
                                    viewBox="0 0 512 512" onClick={handleToggle}>
                                    <path
                                        d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                                        data-original="#000000" />
                                </svg>
                                {toggle && (
                                    <div className="bg-white z-20 shadow-md py-6 px-6 sm:min-w-[320px] max-sm:min-w-[250px] absolute right-0 top-10">
                                        <h6 className="font-semibold text-[15px]">Welcome</h6>
                                        {isAuthenticated ?
                                            <>
                                                <p className="text-2xl text-gray-500 mt-1">{info?.username}</p>
                                                <ul className="space-y-1.5 pl-0">
                                                    <li><a href='#' className="text-sm text-gray-500 hover:text-black">Profile</a></li>
                                                    <li><a href='#'
                                                    onClick={() => handleView('admin-history', 'admin-history')}
                                                    className="text-sm text-gray-500 hover:text-black">Admin History</a></li>
                                                    <li><a href='#' className="text-sm text-gray-500 hover:text-black">Contact Us</a></li>
                                                </ul>
                                                <hr className="border-b-0 my-4" />
                                                <button type='button'
                                                    onClick={handleLogout}
                                                    className="bg-transparent border-2 border-gray-300 hover:border-black rounded px-4 py-2.5 mt-0 text-sm text-black font-semibold"
                                                    >LOG OUT</button>
                                            </>
                                            :
                                            <>
                                                <p className="text-sm text-gray-500 mt-1">To access account and manage orders</p>
                                                <button type='button'
                                                    className="bg-transparent border-2 border-gray-300 hover:border-black rounded px-4 py-2.5 mt-4 text-sm text-black font-semibold"
                                                     onClick={handleLogin}
                                                     >LOGIN
                                                    / SIGNUP</button>
                                                <hr className="border-b-0 my-4" />
                                                <li><a href='#' className="text-sm text-gray-500 hover:text-black">Contact Us</a></li>

                                            </>
                                        }
                                    </div>
                                )}
                            </li>
                        </ul>

                        <button id="toggleOpen" className='lg:hidden ml-7'>
                            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;