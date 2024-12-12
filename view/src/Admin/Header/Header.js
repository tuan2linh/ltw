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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className='flex shadow-lg py-3 px-3 sm:py-4 sm:px-10 bg-gradient-to-r from-white to-gray-50 font-[sans-serif] min-h-[70px] tracking-wide relative z-50'>
                <div className='flex flex-wrap items-center justify-between lg:gap-y-4 gap-y-6 gap-x-4 w-full'>
                    <a href="/admins" className="transition-transform hover:scale-105">
                        <img src="/logo.png" alt="logo" className="h-[35px] sm:h-[45px]" />
                    </a>

                    <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'} fixed lg:relative inset-0 lg:inset-auto bg-white lg:bg-transparent z-[60]`}>
                        <div className="lg:hidden flex justify-end p-4">
                            <button onClick={toggleMobileMenu} className='rounded-full bg-gray-100 p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <ul className='lg:flex lg:gap-x-8 max-lg:space-y-3 max-lg:p-6 lg:items-center'>
                            <li className={`max-lg:border-b max-lg:py-2 relative group`}>
                                <a href='#' 
                                   className={`text-gray-700 block text-[15px] no-underline flex items-center hover:text-black transition-colors duration-300 ${activeTab === 'dashboard' ? 'font-semibold text-black' : ''}`} 
                                   onClick={(e) => {
                                       handleView('/admins', 'dashboard');
                                       toggleMobileMenu();
                                   }}>
                                    Bảng điều khiển
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-300 ${activeTab === 'dashboard' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-2 relative group`}>
                                <a href='#' 
                                   className={`text-gray-700 block text-[15px] no-underline flex items-center hover:text-black transition-colors duration-300 ${activeTab === 'users' ? 'font-semibold text-black' : ''}`} 
                                   onClick={(e) => {
                                       handleView('/admins/manage-users', 'users');
                                       toggleMobileMenu();
                                   }}>
                                    Người dùng
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-300 ${activeTab === 'users' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-2 relative group`}>
                                <a href='#' 
                                   className={`text-gray-700 block text-[15px] no-underline flex items-center hover:text-black transition-colors duration-300 ${activeTab === 'products' ? 'font-semibold text-black' : ''}`} 
                                   onClick={(e) => {
                                       handleView('/admins/manage-products', 'products');
                                       toggleMobileMenu();
                                   }}>
                                    Sản phẩm
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-300 ${activeTab === 'products' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-2 relative group`}>
                                <a href='#' 
                                   className={`text-gray-700 block text-[15px] no-underline flex items-center hover:text-black transition-colors duration-300 ${activeTab === 'orders' ? 'font-semibold text-black' : ''}`} 
                                   onClick={(e) => {
                                       handleView('/admins/manage-orders', 'orders');
                                       toggleMobileMenu();
                                   }}>
                                    Đơn hàng
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-300 ${activeTab === 'orders' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </a>
                            </li>
                            <li className={`max-lg:border-b max-lg:py-2 relative group`}>
                                <a href='#' 
                                   className={`text-gray-700 block text-[15px] no-underline flex items-center hover:text-black transition-colors duration-300 ${activeTab === 'reviews' ? 'font-semibold text-black' : ''}`} 
                                   onClick={(e) => {
                                       handleView('/admins/manage-feedback', 'reviews');
                                       toggleMobileMenu();
                                   }}>
                                    Đánh giá sản phẩm
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform origin-left transition-transform duration-300 ${activeTab === 'reviews' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className='flex items-center space-x-4 sm:space-x-6'>
                        <ul>
                            <li className="relative">
                                <button onClick={handleToggle} 
                                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" 
                                         className="cursor-pointer" viewBox="0 0 512 512">
                                        <path
                                            d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                                            data-original="#000000" />
                                    </svg>
                                </button>
                                {toggle && (
                                    <div className="bg-white z-[70] shadow-lg rounded-lg py-4 sm:py-6 px-4 sm:px-6 w-[280px] sm:w-[320px] absolute right-0 top-12 border border-gray-100">
                                        <h6 className="font-semibold text-[16px] text-gray-800">Welcome</h6>
                                        {isAuthenticated ? (
                                            <>
                                                <p className="text-2xl font-medium text-gray-700 mt-2">{info?.username}</p>
                                                <ul className="space-y-2 pl-0 mt-4">
                                                    <li><a href='#' className="text-sm text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">Profile</a></li>
                                                    <li><a href='#' onClick={() => handleView('admin-history', 'admin-history')} className="text-sm text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">Admin History</a></li>
                                                    <li><a href='#' className="text-sm text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">Contact Us</a></li>
                                                </ul>
                                                <hr className="border-gray-200 my-4" />
                                                <button type='button' onClick={handleLogout}
                                                    className="w-full bg-gray-900 hover:bg-black text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-300">
                                                    LOG OUT
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm text-gray-600 mt-2">To access account and manage orders</p>
                                                <button type='button' onClick={handleLogin}
                                                    className="w-full bg-gray-900 hover:bg-black text-white rounded-lg px-4 py-2.5 mt-4 text-sm font-semibold transition-colors duration-300">
                                                    LOGIN / SIGNUP
                                                </button>
                                                <hr className="border-gray-200 my-4" />
                                                <a href='#' className="text-sm text-gray-600 hover:text-black transition-colors duration-300">Contact Us</a>
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        </ul>

                        <button onClick={toggleMobileMenu} className='lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-300'>
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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