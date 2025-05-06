import React from "react";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";


function Dashboard() {
  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/adminlogin"); // Redirect to login page
  };
  return (
    <>
      <div className="bg-[#E7F2FD] w-full h-screen">
        <div className="min-h-full bg-[#E7F2FD]">
          
          <header className="bg-[#E7F2FD] shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-5xl font-bold justify-center items-center flex pt-4">
                Dashboard
              </h1>
            </div>
          </header>
        </div>
      </div>
    </>
  );
}

export default Dashboard;