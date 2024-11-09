import { useEffect } from 'react';
import Header from "./Header/Header";
import { Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Admin = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Don't render anything while checking auth
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-container">
            <Header />
            <div className="admin-content">
                <div className="admin-header"> 
                </div>
                <div className="admin-main">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default Admin;