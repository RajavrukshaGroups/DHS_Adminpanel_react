import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

function ViewUserdetails() {
  const [memberDetails, setMemberDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fetchData = async (page = 1, search = "") => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:4000/member/view-member-details?page=${page}&search=${encodeURIComponent(
          search
        )}`
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

  const handleCheckAndNavigate = async (id) => {
    try {
      // Step 1: Check membership fee
      const feeResponse = await axiosInstance.get(
        `/receipt/checkMembershipFee/${id}`
      );
      console.log(feeResponse, "Membership Fee Response");

      if (feeResponse.feeAdded) {
        // Step 2: Check if affidavit exists
        const affidavitResponse = await axiosInstance.get(
          `receipt/check-affidavit-model/${id}`
        );
        console.log(affidavitResponse.data, "Affidavit Response");

        if (affidavitResponse.isExist) {
          // If both are true, navigate to edit confirmation
          navigate(`/edit-confirmationletter/${id}`);
        } else {
          // If only fee is true, navigate to add confirmation
          navigate(`/addconfirmationLetter/${id}`);
        }
      } else {
        toast.error(feeResponse.message || "Membership fee condition not met.");
      }
    } catch (error) {
      console.error("Error during navigation checks:", error);
      toast.error("Something went wrong while checking the requirements.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axiosInstance.delete(
        `http://localhost:4000/member/delete-member/${id}`
        // `https://adminpanel.defencehousingsociety.com/member/delete-member/${id}`
      );
      toast.success("Member deleted successfully");

      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
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
                <th className="border px-3 py-2 text-center">
                  Member details & Seniority ID
                </th>
                <th className="border px-3 py-2 text-center">Project</th>
                <th className="border px-3 py-2 text-center">Project Size </th>
                <th className="border px-3 py-2 text-center">
                  Project Price (₹)
                </th>
                <th className="border px-3 py-2 text-center">
                  Paid Amount (₹)
                </th>
                <th className="border px-3 py-2 text-center">
                  Pending Amount (₹)
                </th>
                <th className="border px-3 py-2 text-center">
                  Payment History
                </th>
                <th className="border px-3 py-2 text-center">Status</th>

                <th className="border px-3 py-2 text-center">
                  Additional Details
                </th>

                <th className="border px-3 py-2 text-center">Delete</th>

                <th className="border px-3 py-2 text-center">Edit</th>
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
                  const pending =
                    propertyCost - member.propertyDetails?.paidAmount;

                  return (
                    <tr key={member._id}>
                      <td className="border px-3 py-2 text-center">
                        {/* {index + 1} */}
                        {(currentPage - 1) * 10 + index + 1}
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
                      <td className="border px-3 py-2 text-center">{`${member.propertyDetails.length} X ${member.propertyDetails.breadth} `}</td>
                      <td className="border px-3 py-2 text-center">
                        ₹{Number(propertyCost).toLocaleString("en-IN")}
                      </td>
                      {/* <td className="border px-3 py-2 text-center">{Amount}</td> */}
                      <td className="border px-3 py-2 text-center">
                        ₹
                        {Number(
                          member.propertyDetails?.paidAmount
                        ).toLocaleString("en-IN") || "-"}
                      </td>

                      <td className="border px-3 py-2 text-center text-red-500">
                        ₹{Number(pending).toLocaleString("en-IN")}
                      </td>
                      {/* <td className="border px-3 py-2 text-center text-red-500">
                        {(propertyCost)-(member.propertyDetails?.paidAmount)}
                      </td> */}
                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() =>
                            navigate(`/view-history/${member._id}`)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          View History
                        </button>
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
                      <td className="border px-3 py-2 text-center text-red-500">
                        <div
                          onClick={() => handleCheckAndNavigate(member._id)}
                          title="Add Confirmation Letter"
                          className="cursor-pointer"
                        >
                          <IoIosAddCircleOutline className="text-2xl flex m-auto text-blue-500" />
                        </div>
                      </td>

                      <td className="border px-3 py-2 text-center text-red-500">
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt className="text-red-600 text-xl cursor-pointer hover:text-red-700" />
                        </button>
                      </td>
                      {/* // In the table row: */}
                      <td className="border px-3 py-2 text-center text-red-500">
                        <button
                          onClick={() => navigate(`/edit-member/${member._id}`)} // Pass the member ID
                          className="text-blue-600 hover:underline"
                        >
                          <FaEdit className="text-yellow-500 text-xl cursor-pointer hover:text-yellow-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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

export default ViewUserdetails;
