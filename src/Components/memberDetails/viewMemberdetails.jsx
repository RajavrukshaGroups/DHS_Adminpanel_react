import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

function ViewMemberdetails() {
  const [memberDetails, setMemberDetails] = useState([]);
  const [emailSendStatus, setEmailSendStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async (page = 1, search = "") => {
    try {
      const response = await axiosInstance.get(
        `/member/view-member-details?page=${page}&search=${encodeURIComponent(
          search,
        )}`,
        // `https://adminpanel.defencehousingsociety.com/member/view-member-details?page=${page}&search=${encodeURIComponent(
        //   search
        // )}`
      );
      console.log("response", response);
      setMemberDetails(response.data || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(Math.max(response.totalPages || 1, 1));
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

  const handleStatusToggle = async (memberId, currentStatus) => {
    try {
      await axiosInstance.put(
        // `http://localhost:4000/member/update-status/${memberId}`,
        `https://adminpanel.defencehousingsociety.com/member/update-status/${memberId}`,
        { isActive: !currentStatus },
      );
      setMemberDetails((prev) =>
        prev.map((m) =>
          m._id === memberId ? { ...m, isActive: !currentStatus } : m,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  const handleSendEmail = async (member) => {
    setEmailSendStatus(member._id);
    try {
      const response = await axiosInstance.post(
        // "http://localhost:4000/member/membercredentials",
        "https://adminpanel.defencehousingsociety.com/member/membercredentials",
        {
          name: member.name,
          email: member.email,
          SeniorityID: member.SeniorityID,
          password: member.password,
        },
      );
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setEmailSendStatus(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <div className="mt-4 overflow-x-auto">
          <h1 className="text-center text-xl font-semibold mb-4">
            View Member Details
          </h1>
          <div className="mb-4 text-center">
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
                <th className="border px-3 py-2 text-center">Member Name</th>
                <th className="border px-3 py-2 text-center">Mobile No</th>
                <th className="border px-3 py-2 text-center">Email</th>
                <th className="border px-3 py-2 text-center">Seniority ID</th>
                <th className="border px-3 py-2 text-center">Password</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Send email</th>
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
                memberDetails.map((member, index) => (
                  <tr key={member._id}>
                    <td className="border px-3 py-2 text-center">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.name}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.mobileNumber}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.email}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.SeniorityID}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.password}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <div className="flex items-center gap-2 border px-2 py-1 rounded">
                          <button
                            onClick={() =>
                              handleStatusToggle(member._id, member.isActive)
                            }
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              member.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                member.isActive ? "translate-x-6" : ""
                              }`}
                            ></span>
                          </button>
                          <span
                            className={`text-sm ${
                              member.isActive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleSendEmail(member)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                        disabled={
                          !member.isActive || emailSendStatus === member._id
                        }
                      >
                        {emailSendStatus === member._id
                          ? "Sending..."
                          : "Send Email"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {memberDetails.length > 0 && (
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
              disabled={
                currentPage === totalPages || memberDetails.length === 0
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewMemberdetails;
