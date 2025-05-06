import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaPlusCircle,
  FaListAlt,
  FaRulerCombined,
  FaMapMarkedAlt,
  FaClipboardList,
  FaRegEye
} from "react-icons/fa";
import { MdRoomPreferences } from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [projectOpen, setProjectOpen] = useState(
    location.pathname.startsWith("/project")
  );

  return (
    <div className="relative flex items-start">
      {/* Toggle Button */}
      <div className="fixed top-0 z-40 transition-all duration-300">
        <div className="flex justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`transition-all duration-300 w-8 p-1 mx-3 my-2 rounded-full focus:outline-none ${
              sidebarOpen ? "hover:bg-gray-200" : "hover:bg-gray-300"
            }`}
          >
            <svg
              viewBox="0 0 20 20"
              className={`w-6 h-6 fill-current text-gray-600`}
            >
              {!sidebarOpen ? (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-30 h-full min-h-screen overflow-y-auto overflow-x-hidden text-black transition-all duration-300 ease-in-out bg-white shadow-lg ${
          sidebarOpen ? "w-72" : "w-0"
        }`}
      >
        <div className="flex flex-col items-stretch justify-between h-full">
          {/* Header */}
          <div className="flex flex-col flex-shrink-0 w-full">
            <div className="flex items-center justify-center px-8 py-4 text-center border-b">
              <a href="#" className="text-xl font-semibold text-black">
                My App
              </a>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-6 space-y-5 text-[16px] font-medium">
              {/* Dashboard Link */}
              <Link
                to="/"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  location.pathname === "/"
                    ? "bg-blue-100 text-blue-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <FaHome className="text-lg" />
                <span className="ml-4">Dashboard</span>
              </Link>

              {/* Project Menu */}
              <button
                onClick={() => setProjectOpen(!projectOpen)}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  location.pathname === "/project"
                    ? "bg-blue-100 text-blue-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <MdRoomPreferences className="text-lg" />
                <span className="ml-4 flex-grow text-left">Project</span>
                {projectOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Project Sub-Menu */}
              {projectOpen && (
                <div className="ml-8 mt-2 space-y-3 text-[15px]">
                  <Link
                    to="/projectLand"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      location.pathname === "/projectLand"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <FaPlusCircle className="text-base" />
                    <span className="ml-3">Add Project Details</span>
                  </Link>
                  <Link
                    to="/addprojectstatus"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      location.pathname === "/addprojectstatus"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <FaClipboardList className="text-base" />
                    <span className="ml-3">Add Project Status</span>
                  </Link>
                  <Link
                    to="/viewProjects"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      location.pathname === "/viewProjects"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <FaListAlt className="text-base" />
                    <span className="ml-3">View Projects</span>
                  </Link>
                  <Link
                    to="/plotDimensions"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      location.pathname === "/plotDimensions"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <FaRulerCombined className="text-base" />
                    <span className="ml-3">Plot Dimensions</span>
                  </Link>
                  <Link
                    to="/viewlanddetails"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      location.pathname === "/viewlanddetails"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <FaMapMarkedAlt className="text-base" />
                    <span className="ml-3">View Land Details</span>
                  </Link>
                  <Link
                    to="/viewprojectstatus"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      location.pathname === "/viewprojectstatus"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <FaRegEye className="text-base" />
                    <span className="ml-3">View Project Status</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
