import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { Signin } from "../api/auth";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LoginBg from "../../public/images/letterheader-removebg-preview.png";
import {
  showSuccessToast,
  showErrorToast,
} from "../../src/components/utils/toastHelper"; // Adjust path as needed
import axiosInstance from "../api/interceptors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      showErrorToast("Please fill in the email and password");
      return;
    }
    setLoading(true);
    try {
      const data = await axiosInstance.post("/admin/adminLogin", {
        email,
        password,
      });
      console.log(data, "this is the data");
      if (data.success) {
        dispatch(loginSuccess({ token: data.token, user: data.user }));
        setTimeout(() => {
          showSuccessToast("Login Successful");
          setLoading(false);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      const errMsg =
        error.data?.message || "Something went wrong. Please try again.";
      showErrorToast(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <img
            src={LoginBg}
            alt="Defence Habitat Housing Logo"
            // width={120}

            className="justify-center flex m-auto h-44"
          />
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex  justify-center p-4">
        <div className="w-full max-w-md pt-16">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 ">
            Admin Login
          </h2>
          <div className="bg-[#faf5f0] rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-start font-medium text-gray-900"
                >
                  Email Id
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter email id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-start font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-blue-600 cursor-not-allowed"
                    : "bg-blue-400 hover:bg-blue-500"
                } text-white hover:to-blue-800 font-semibold rounded-md py-2 px-4 w-full flex  items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="mr-2 animate-spin"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M526 1394q0 53...z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
