import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import apiService from "../services/api";
import { showToast } from "../helper/showToast";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  useEffect(() => {
    apiService.readInfoMember().then((res) => {
      setUserInfo(res?.data);
      setEditedInfo(res?.data);
    });
  }, []);

  const handleChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
    apiService.updateInfoMember(editedInfo).then((res) => {
      if (res?.data?.message === "Member updated successfully") {
        showToast.success("Cập nhật thông tin thành công");
      } else {
        showToast.error(res?.data?.message);
      }
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaEdit /> Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <FaSave /> Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedInfo(userInfo);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <FaTimes /> Hủy
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ID thành viên
                </label>
                <input
                  type="text"
                  value={userInfo.memberId}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={userInfo.username}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Editable fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={isEditing ? editedInfo.password : userInfo.password}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={isEditing ? editedInfo.fullName : userInfo.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birth"
                  value={isEditing ? editedInfo.birth : userInfo.birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={
                    isEditing ? editedInfo.phoneNumber : userInfo.phoneNumber
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
