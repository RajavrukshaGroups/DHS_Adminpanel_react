import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/interceptors";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

function ViewUserdetails() {
  const [memberDetails, setMemberDetails] = useState([]);
  console.log("Member Details:", memberDetails);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3000/member/view-member-details"
        );
        console.log(response, "api calling");
        setMemberDetails(response.data || []);
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex justify-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        {/* <h1 className="text-xl font-semibold mb-4 text-center">
          View Member Details
        </h1> */}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">Member details & Seniority ID</th>
                <th className="border px-3 py-2 text-center">Project</th>
                <th className="border px-3 py-2 text-center">Project Size </th>
                <th className="border px-3 py-2 text-center">Project Price (₹)</th>
                <th className="border px-3 py-2 text-center">Paid Amount (₹)</th>
                <th className="border px-3 py-2 text-center">Pending Amount (₹)</th>
                <th className="border px-3 py-2 text-center">Status</th>
                <th className="border px-3 py-2 text-center">Additional Details</th>
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
                      <td className="border px-3 py-2 text-center">{index + 1}</td>
                      <td className="border px-3 py-2 text-center">
                        {member.name} <br />
                        <span className="text-xs text-gray-500">
                          {member.SeniorityID}
                        </span>
                      </td>
                      <td className="border px-3 py-2 text-center">{projectName}</td>
                      <td className="border px-3 py-2 text-center">{`${member.propertyDetails.length} X ${member.propertyDetails.breadth} `}</td>
                      <td className="border px-3 py-2 text-center">{propertyCost}</td>
                      <td className="border px-3 py-2 text-center">{Amount}</td>
                      <td className="border px-3 py-2 text-center text-red-500">{pending}</td>
                      <td className="border px-3 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            member.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="border px-3 py-2 text-center text-red-500">
                      <Link to={`/addconfirmationLetter/${member._id}`} title="Add Confirmation Letter">
                            <IoIosAddCircleOutline className="text-2xl flex m-auto text-blue-500" />
                          </Link>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewUserdetails;
