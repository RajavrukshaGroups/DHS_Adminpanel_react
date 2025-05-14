import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors";
import SiteBookingConfirmation from "../memberDetails/siteBookingConfirmation"; // Import the confirmation component

function ViewSitebookingConfirmation() {
  const [memberDetails, setMemberDetails] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchAffidavits = async () => {
      try {
        const res = await axiosInstance.get("/member/all");
        setMemberDetails(res);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchAffidavits();
  }, []);

  if (selectedMember) {
    return (
      <SiteBookingConfirmation member={selectedMember} onBack={() => setSelectedMember(null)} />
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">View Site Booking</h1>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">Member Details</th>
                <th className="border px-3 py-2 text-center">Project Address</th>
                <th className="border px-3 py-2 text-center">Cheque/DD/UTR No</th>
                <th className="border px-3 py-2 text-center">Duration</th>
                <th className="border px-3 py-2 text-center">Receipt No.</th>
                <th className="border px-3 py-2 text-center">Total Amount</th>
                <th className="border px-3 py-2 text-center">Affidavit</th>
                <th className="border px-3 py-2 text-center">Confirmation</th>
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
                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                    <td className="border px-3 py-2 text-center">
                      <p>{member.userId?.name}</p>
                      <p>{member.userId?.mobileNumber}</p>
                      <p>{member.userId?.email}</p>
                      <p>{member.userId?.contactAddress}</p>
                    </td>
                    <td className="border px-3 py-2 text-center">{member.projectAddress}</td>
                    <td className="border px-3 py-2 text-center">{member.chequeNo}</td>
                    <td className="border px-3 py-2 text-center">{member.duration}</td>
                    <td className="border px-3 py-2 text-center">{member.userId?.ReceiptNo}</td>
                    <td className="border px-3 py-2 text-center">₹{member.userId?.Amount}</td>
                    <td className="border px-3 py-2 text-center">
                      <a href={member.affidavitUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View Affidavit
                      </a>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-blue-600 underline"
                      >
                        View Confirmation
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewSitebookingConfirmation;
