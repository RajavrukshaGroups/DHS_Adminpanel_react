import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/interceptors";
import toast from "react-hot-toast";

function ViewUserdetails() {
  const [memberDetails, setMemberDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         "http://localhost:3000/member/view-member-details"
  //       );
  //       console.log(response, "api calling");
  //       setMemberDetails(response.data || []);
  //     } catch (error) {
  //       console.error("Error fetching member details:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const fetchData = async (page = 1, search = "") => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3000/member/view-member-details?page=${page}&search=${encodeURIComponent(
          search
        )}`
      );
      console.log("response", response);
      setMemberDetails(response.data || []);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error);
      if (error.status && error.status === 404) {
        setMemberDetails([]);
        toast.error(error.data.message);
        setErrorMessage(error.response.data.message);
      } else {
        console.error("Error fetching member details:", error);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);
  return (
    <div className="flex justify-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          View User Details
        </h1>

        <div className="mt-4 overflow-x-auto">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, email or Seniority ID"
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on new search
              }}
            />
          </div>
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">
                  Name & Seniority ID
                </th>
                <th className="border px-3 py-2 text-center">Project Name</th>
                <th className="border px-3 py-2 text-center">
                  Project Size (sqft)
                </th>
                <th className="border px-3 py-2 text-center">
                  Project Price (₹)
                </th>
                <th className="border px-3 py-2 text-center">
                  Paid Amount (₹)
                </th>
                <th className="border px-3 py-2 text-center">
                  Pending Amount (₹)
                </th>
                <th className="border px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {memberDetails.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No member data found.
                  </td>
                </tr>
              ) : (
                memberDetails.map((member, index) => {
                  const { propertyDetails = {}, Amount = 0 } = member;
                  const {
                    projectName = "",
                    propertySize = 0,
                    propertyCost = 0,
                  } = propertyDetails;
                  const pending = propertyCost - Amount;

                  return (
                    <tr key={member._id}>
                      <td className="border px-3 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {member.name} <br />
                        <span className="text-xs text-gray-500">
                          {member.SeniorityID}
                        </span>
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {projectName}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {propertySize}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {propertyCost}
                      </td>
                      <td className="border px-3 py-2 text-center">{Amount}</td>
                      <td className="border px-3 py-2 text-center text-red-500">
                        {pending}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            member.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-6 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium mt-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewUserdetails;
