import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAdminHistory, getAllAdmin } from '../admin-general/services/apiService';

const AdminHistory = () => {
    const [actions, setActions] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAdminHistory();
        getAdmin();
    }, []);

    const getAdminHistory = async () => {
        try {
            const data = await getAllAdminHistory();
            if (data && data.actions) {
                setActions(data.actions);
            }
        } catch (error) {
            console.error('getAllAdminHistory', error);
        }
    };

    const getAdmin = async () => {
        try {
            const data = await getAllAdmin();
            if (data && data.administrators) {
                setAdmins(data.administrators);
                setLoading(false);
            }
        } catch (error) {
            console.error('getAllAdmin', error);
        }
    };

    const getAdminName = (adminId) => {
        const admin = admins.find(a => a.adminId === adminId);
        return admin ? admin.fullName : 'Unknown Admin';
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Lịch sử hoạt động Admin</h2>
            
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Admin ID</th>
                            <th className="px-6 py-3">Tên Admin</th>
                            <th className="px-6 py-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions.map((action) => (
                            <tr key={action.actionId} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{action.actionId}</td>
                                <td className="px-6 py-4">{action.adminId}</td>
                                <td className="px-6 py-4">{getAdminName(action.adminId)}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {action.action}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminHistory;