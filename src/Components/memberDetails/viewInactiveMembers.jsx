import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors"; // Use your axios setup

function ViewInactiveMembers() {
  const [memberDetails, setMemberDetails] = useState([]);

  useEffect(() => {
    const fetchInactiveMembers = async () => {
      try {
        const response = await axiosInstance.get("/member/inactive-members");
        console.log(response, "api calling");

        setMemberDetails(response);
      } catch (error) {
        console.error("Failed to fetch inactive members:", error);
      }
    };

    fetchInactiveMembers();
  }, []);

  return (
    <div className="flex justify-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Inactive Members
        </h1>

        <div className="mt-4">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">Member Name</th>
                <th className="border px-3 py-2 text-center">Mobile No</th>
                <th className="border px-3 py-2 text-center">Email</th>
                <th className="border px-3 py-2 text-center">Address</th>
              </tr>
            </thead>
            <tbody>
              {memberDetails.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No inactive member data found.
                  </td>
                </tr>
              ) : (
                memberDetails.map((member, index) => (
                  <tr key={member._id}>
                    <td className="border px-3 py-2 text-center">
                      {index + 1}
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
                      {member.permanentAddress}
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

export default ViewInactiveMembers;
