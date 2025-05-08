import React from 'react'
import { useEffect, useState } from "react";
import axiosInstance from '../../api/interceptors';
function ViewMemberdetails() {
    const [memberDetails, setMemberDetails] = useState([]);

    console.log("Member Details:", memberDetails);

        useEffect(() => {
            const fetchData = async () => {
                try {
                const response = await axiosInstance.get("http://localhost:3000/member/view-member-details");
                setMemberDetails(response.data || []);
                } catch (error) {
                console.error("Error fetching member details:", error);
                }
            };
            fetchData();
            }
        , []);

  return (
    <div className="flex  items-center justify-center min-h-screen bg-blue-50 px-4">
    <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-semibold mb-4 text-center">
        View Member Details
      </h1>

      {/* <div className="mb-6">
        <label htmlFor="projectSelect" className="block mb-2 font-medium">
          Select Project
        </label>
      
      </div> */}

        <div className="mt-4">
          {/* <h2 className="text-lg font-bold mb-3">Available Land Details</h2> */}
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">Member Name</th>
                <th className="border px-3 py-2 text-center">
                Mobile No
                </th>
                <th className="border px-3 py-2 text-center">Seniority ID</th>
                <th className="border px-3 py-2 text-center">Password</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Send email
                </th>
              </tr>
            </thead>
            <tbody>
  {memberDetails.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center py-4 text-gray-500">
        No member data found.
      </td>
    </tr>
  ) : (
    memberDetails.map((member, index) => (
      <tr key={member._id}>
        <td className="border px-3 py-2 text-center">{index + 1}</td>
        <td className="border px-3 py-2 text-center">{member.refname}</td>
        <td className="border px-3 py-2 text-center">{member.mobileNumber}</td>
        <td className="border px-3 py-2 text-center">{member.SeniorityID}</td>
        <td className="border px-3 py-2 text-center">{member.serviceId}</td>
        <td className="border px-3 py-2 text-center">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            Active
          </span>
        </td>
        <td className="border px-3 py-2 text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">
            Send Email
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
  )
}

export default ViewMemberdetails
