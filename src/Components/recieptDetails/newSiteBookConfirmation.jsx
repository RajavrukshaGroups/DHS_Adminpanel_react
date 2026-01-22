import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors";
import SiteBookingConfirmation from "../memberDetails/siteBookingConfirmation";
import { FaEye, FaFileAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ViewSitebookingConfirmation() {
  const [memberDetails, setMemberDetails] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust the limit

  const navigate = useNavigate();

  const fetchAffidavits = async (page = 1) => {
    try {
      const res = await axiosInstance.get("/member/all", {
        params: { page, limit: itemsPerPage },
      });
      console.log("response site", res);
      setMemberDetails(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchAffidavits(currentPage);
  }, [currentPage]);

  const handleViewConfirmation = async (memberId) => {
    try {
      const res = await axiosInstance.get(
        `/receipt/view-confirmation/${memberId}`,
      );
      const confirmationUrl = `https://adminpanel.defencehousingsociety.com/receipt/view-confirmation/${memberId}`;
      // const confirmationUrl = `http://localhost:4000/receipt/view-confirmation/${memberId}`;
      window.open(confirmationUrl, "_blank");
      setSelectedMember(res.data);
    } catch (error) {
      console.error("Error fetching confirmation letter", error);
    }
  };

  if (selectedMember) {
    return (
      <SiteBookingConfirmation
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
      />
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          View Site Booking
        </h1>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">Member Details</th>
                <th className="border px-3 py-2 text-center">
                  Project Address
                </th>
                <th className="border px-3 py-2 text-center">Membership No.</th>
                <th className="border px-3 py-2 text-center">
                  Confirmation No.
                </th>
                <th className="border px-3 py-2 text-center">
                  Site Down Payment
                </th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberDetails.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                memberDetails.map((member, index) => (
                  <tr key={member._id}>
                    <td className="border px-3 py-2 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <p>{`${member.userId?.saluation} ${member.userId?.name}`}</p>
                      <p>{member.userId?.mobileNumber}</p>
                      <p>{member.userId?.email}</p>
                      <p>{member.userId?.contactAddress}</p>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.projectAddress}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.userId?.MembershipNo || "N/A"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.userId?.ConfirmationLetterNo || "N/A"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.siteDownPayments?.length > 0
                        ? member.siteDownPayments[0].amount
                        : "N/A"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center">
                        <a
                          href={member.affidavitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black underline"
                        >
                          <FaEye className="text-black  text-xl cursor-pointer hover:text-black" />
                        </a>
                        <button
                          onClick={() =>
                            handleViewConfirmation(member.userId._id)
                          } // ✅ correct usage if userId is an object
                          className="text-black underline"
                        >
                          <FaFileAlt className="text-black text-xl cursor-pointer hover:text-blue-700" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/edit-confirmationletter/${member.userId._id}`,
                            )
                          } // Pass the member ID
                          className="text-blue-600  hover:underline"
                        >
                          <FaEdit className="text-black text-xl cursor-pointer hover:text-black" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <p className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSitebookingConfirmation;
