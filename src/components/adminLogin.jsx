import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection

const AdminLogin = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [InvalidInfo, setIsInvalidInfo] = useState(false);
  const navigate = useNavigate(); // for redirection after successful login

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bricolat.free.nf/admin/adminLogin.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Enable sending credentials with request
        }
      );

      const result = response.data;

      if (result.status === "success") {
        onSubmit(result.admin); // Send the admin info to parent component
        setIsInvalidInfo(false);
        // Redirect to the admin dashboard
        // or any other page
      } else {
        setIsInvalidInfo(true); // Display error if credentials are wrong
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-4">
          Log in
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              User name
            </label>
            <input
              type="text"
              name="username"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="user name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {InvalidInfo && (
            <p className="text-red-600 text-sm mb-3">
              Invalid username or password
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
