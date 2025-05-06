import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./navbar.css"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
         const dispatch = useDispatch();
         const navigate = useNavigate();
         //  dispatch(logout());
         const handleLogout = () => {
           dispatch(logout()); // Dispatch logout action
           navigate("/adminlogin"); // Redirect to login page
  };
  return (
    <nav className="fixed top-0 z-50 w-full  bg-white border-b border-gray-200 shadow-sm pt-3 pb-6">
    <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
      <div className="flex items-center">
        <a href="/" className="flex items-center no-underline">
          <img
            src="https://adminpanel.defencehousingsociety.com/img/logo200.png"
            alt="Defence Housing Society Logo"
            width={'92'}
            height={'92'}
            className="mr-3"
          />
          <div className="flex flex-col">
          <span className="font-bold text-1xl text-gray-900">
              ಡಿಫೆನ್ಸ್ ಹ್ಯಾಬಿಟಾಟ್ ಹೌಸಿಂಗ್ ಕೋ-ಆಪರೇಟಿವ್ ಸೊಸೈಟಿ ಲಿ.
            </span>
            <span className="font-bold text-1xl text-gray-900">
              DEFENCE HABITAT HOUSING CO-OPERATIVE SOCIETY LTD.
            </span>
            <span className="font-bold text-1xl text-gray-600">Reg. No.:- HSG-3/64/HHS/53744</span>
          </div>
        </a>
      </div>

      {/* Mobile menu button */}
      <div className="flex md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center justify-center p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {/* <Menu className="w-6 h-6" /> */}
        </button>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          admin
        </Link>
        <button onClick={handleLogout}
       className="inline-block px-4 py-3 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md transition duration-300"
     >Logout</button>
      </div>
    </div>

    {/* Mobile menu, show/hide based on menu state */}
    {isOpen && (
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
          <Link
            href="/admin"
            className="block px-3 py-2 text-base font-medium text-blue-600 rounded-md hover:bg-gray-100"
          >
            admin
          </Link>
          <Link
            to="/logout"
            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md transition duration-300"
            >
            Logout
            </Link>
        </div>
      </div>
    )}
  </nav>
   
  );
};

export default Navbar;
