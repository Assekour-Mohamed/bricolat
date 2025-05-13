import React, { useState } from "react";
import axios from "axios";
const AdminInfo = ({ admin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: admin.fullName,
    phone: admin.Phone,
    username: admin.username,
    email: admin.email,
    password: "",
    imageFile: null,
    imageUrl: admin.imageUrl,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file), // for preview
      }));
    }
  };

  const handleSave = async () => {
    const updatedData = new FormData();
    updatedData.append("userID", admin.userId);
    updatedData.append("fullName", formData.fullName);
    updatedData.append("phone", formData.phone);
    updatedData.append("username", formData.username);
    updatedData.append("email", formData.email);

    const password = formData.password;
    const isValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) && // at least one uppercase letter
      /[a-z]/.test(password) && // at least one lowercase letter
      /\d/.test(password) && // at least one digit
      /[^A-Za-z0-9]/.test(password); // at least one special character

    if (!isValid) {
      alert("Invalid Password, Password wont be updated.");
    }

    updatedData.append("password", formData.password);

    if (formData.imageFile) {
      updatedData.append("image", formData.imageFile);
    } else {
      updatedData.append("oldImageUrl", formData.imageUrl);
    }
    try {
      const response = await axios.post(
        `https://bricolat.free.nf/admin/updateAdminInfo.php?adminID=${admin.adminId}`,
        updatedData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully ✅");
      } else console.error("Update result:", response.data);
    } catch (error) {
      console.error("Error occurred while sending data:", error);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: admin.fullName,
      phone: admin.phone,
      username: admin.username,
      email: admin.email,
      password: "",
      imageFile: null,
      imageUrl: admin.imageUrl,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <div className="flex flex-col items-center space-y-6">
        <img
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
          src={formData.imageUrl}
          alt="Admin Avatar"
        />

        {isEditing ? (
          <div className="w-full space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="New Password"
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 pt-3 bg-white rounded-md shadow-md">
              <div className="grid justify-start space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {admin.fullName}
                </h2>
                <p className="text-gray-600">{admin.Phone}</p>
                <p className="text-gray-600">{admin.username}</p>
                <p className="text-gray-600">{admin.email}</p>
                <p className="text-gray-500 text-sm">
                  Admin ID: {admin.adminId}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition ease-in-out duration-200"
              >
                Edit Info
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminInfo;
