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
  FaRegEye,
  FaUsers,
  FaUserPlus,
  FaUserFriends,
  FaTasks,
  FaFolderOpen,
  FaUsersCog,
  FaFileAlt,
} from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { FaUsersSlash } from "react-icons/fa";

import { MdRoomPreferences } from "react-icons/md";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [projectOpen, setProjectOpen] = useState(
    location.pathname.startsWith("/project")
  );

  const [memberDetailsOpen, setMemberDetailsOpen] = useState(
    // location.pathname.startsWith("/memberDetails")
    location.pathname.startsWith("/addmemberdetails")
  );
  const [recieptDetailsOpen, setRecieptDetailsOpen] = useState(
    // location.pathname.startsWith("/memberDetails")
    location.pathname.startsWith("/addmemberdetails")
  );
  const [plotDetailsOpen, setPlotDetailsOpen] = useState(
    // location.pathname.startsWith("/memberDetails")
    location.pathname.startsWith("/addmemberdetails")
  );

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed top-16 bottom-0 left-0 z-30  h-full min-h-screen overflow-y-auto overflow-x-hidden text-black transition-all duration-300 ease-in-out bg-white shadow-lg ${
          sidebarOpen ? "w-72" : "w-0"
        }`}
      >
        <div className="flex flex-col items-stretch justify-between h-full">
          {/* Header */}
          <div className="flex flex-col flex-shrink-0 w-full">
            <div className="flex items-center justify-center px-8 py-4 text-center">
              <a href="#" className="text-xl font-semibold text-black"></a>
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
                <FaFolderOpen className="text-lg" />
                <span className="ml-4 flex-grow text-left">Project</span>
                {projectOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Project Sub-Menu */}
              {projectOpen && (
                <div className="ml-8 mt-2 space-y-3 text-[15px]">
                  <Link
                    to="/projectLand"
                    className={`no-underline flex items-center px-3 py-2 rounded-lg ${
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
              {/* Member Details Menu */}
              <button
                onClick={() => setMemberDetailsOpen(!memberDetailsOpen)}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  location.pathname.startsWith("/addreferencedetails")
                    ? "bg-blue-100 text-blue-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {/* <FaRegEye className="text-lg" /> */}
                <FaUsers className="text-lg" />

                <span className="ml-4 flex-grow text-left">Member Details</span>
                {memberDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Member Details Sub-Menu */}
              {memberDetailsOpen && (
                <div className="ml-8 mt-2 space-y-3 text-[15px]">
                  <Link
                    to="/addmemberdetails"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/addmemberdetails"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUserPlus className="text-base" />

                    <span className="ml-3">Add New User</span>
                  </Link>
                  <Link
                    to="/viewmemberdetails"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/viewmemberdetails"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUsersCog className="text-base" />
                    <span className="ml-3">View Member Details</span>
                  </Link>
                  <Link
                    to="/viewInactiveMembers"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/viewInactiveMembers"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUsersSlash className="text-base" />
                    <span className="ml-3 w">Inactive Members</span>
                  </Link>
                  <Link
                    to="/ViewUserDetails"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/ViewUserDetails"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUsers className="text-base" />
                    <span className="ml-3 w">View User Details</span>
                  </Link>
                </div>
              )}
              {/* Recipt Details Menu */}
              <button
                onClick={() => setRecieptDetailsOpen(!recieptDetailsOpen)}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  location.pathname.startsWith("/addreferencedetails")
                    ? "bg-blue-100 text-blue-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {/* <FaRegEye className="text-lg" /> */}
                <FaUsers className="text-lg" />

                <span className="ml-4 flex-grow text-left">
                  Reciept Details
                </span>
                {memberDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {recieptDetailsOpen && (
                <div className="ml-8 mt-2 space-y-3 text-[15px]">
                  <Link
                    to="/viewsiteBooking"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/viewsiteBooking"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUserPlus className="text-base" />

                    <span className="ml-3">Booking Confirmation</span>
                  </Link>
                  <Link
                    to="/viewReceipts"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/viewReceipts"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUserPlus className="text-base" />

                    <span className="ml-3">View Receipts</span>
                  </Link>
                  <Link
                    to="/view-share-certificate"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/view-share-certificate"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaFileAlt className="text-base" />

                    <span className="ml-3">View Share Certificate</span>
                  </Link>
                </div>
              )}

              {/* Recipt Details Menu */}
              <button
                onClick={() => setPlotDetailsOpen(!plotDetailsOpen)}
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  location.pathname.startsWith("/addreferencedetails")
                    ? "bg-blue-100 text-blue-700"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                {/* <FaRegEye className="text-lg" /> */}
                <FaUsers className="text-lg" />

                <span className="ml-4 flex-grow text-left">Plot Details</span>
                {plotDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {plotDetailsOpen && (
                <div className="ml-8 mt-2 space-y-3 text-[15px]">
                  <Link
                    to="/plotTransferForm"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/plotTransferForm"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUserPlus className="text-base" />
                    <span className="ml-3">Plot Transfer Form</span>
                  </Link>
                  <Link
                    to="/plotTransferhistory"
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      // location.pathname === "/addreferencedetails"
                      location.pathname === "/plotTransferhistory"
                        ? "bg-blue-100 text-blue-700"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    {/* <FaPlusCircle className="text-base" /> */}
                    <FaUserPlus className="text-base" />
                    <span className="ml-3">View Transferred Plot History</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="fixed top-20 left-0 z-40 transition-all duration-300">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`transition-all duration-300 pt-4 w-8 p-1 mx-3 my-2 rounded-full focus:outline-none ${
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
  );
};

export default Sidebar;
