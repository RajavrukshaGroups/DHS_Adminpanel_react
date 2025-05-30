import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/interceptors';
import toast from 'react-hot-toast';
import { FaEye } from "react-icons/fa";

const CancelledMembersTable = () => {

  const [cancelledMembers, setCancelledMembers] = useState([]);

    console.log(cancelledMembers,'cancelled members')

const handleDelete = async (memberId) => {
  try {
    console.log(memberId, 'member id');
    const response = await axiosInstance.post('/plot/delete-plote-cancelation', {
      memberId: memberId, // Send this to backend
    }).then((res)=>{
      if(res){
        toast.success(res.message)
      }
    }).catch((err)=>{
      toast.error('failed to delete or some other network erros ocuured')
      console.error("failed to delete or some other network erros ocuured")
    })
    // ✅ Remove deleted member from the list in the frontend
    setCancelledMembers(prevMembers =>
      prevMembers.filter(member => member._id !== memberId)
    );
    // Optionally refresh your data or UI
  } catch (error) {
    console.error('Error deleting plot cancellation:', error);
  }
};

  useEffect(() => {
    axiosInstance.get('/plot/plot-cancelled-list')
      .then(res => setCancelledMembers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
   <div className="table-responsive p-10">
  <h3 className="text-xl font-semibold mb-4">Cancelled Members</h3>
  <table className="w-full text-left border border-gray-300">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-3 py-2 text-center">S.No</th>
        <th className="border px-3 py-2 text-center">Seniority ID</th>
        <th className="border px-3 py-2 text-center">Name</th>
        <th className="border px-3 py-2 text-center">Email</th>
        <th className="border px-3 py-2 text-center">Mobile</th>
        <th className="border px-3 py-2 text-center">Project</th>
        <th className="border px-3 py-2 text-center">Size</th>
        <th className="border px-3 py-2 text-center">Cancellation Date</th>
        <th className="border px-3 py-2 text-center">Reason</th>
        <th className="border px-3 py-2 text-center">Remarks</th>
        <th className="border px-3 py-2 text-center">Letter</th>
        <th className="border px-3 py-2 text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {cancelledMembers.length === 0 ? (
        <tr>
          <td colSpan="11" className="text-center py-4 text-gray-500">
            No cancelled members found.
          </td>
        </tr>
      ) : (
        cancelledMembers.map((member, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="border px-3 py-2 text-center">{idx + 1}</td>
            <td className="border px-3 py-2 text-center">{member.SeniorityID}</td>
            <td className="border px-3 py-2 text-center">{member.name}</td>
            <td className="border px-3 py-2 text-center">{member.email}</td>
            <td className="border px-3 py-2 text-center">{member.mobileNumber}</td>
            <td className="border px-3 py-2 text-center">{member.propertyDetails?.projectName}</td>
            <td className="border px-3 py-2 text-center">{member.propertyDetails?.propertySize}</td>
            <td className="border px-3 py-2 text-center">
              {new Date(member.cancellationDetails?.cancellationDate).toLocaleDateString()}
            </td>
            <td className="border px-3 py-2 text-center">{member.cancellationDetails?.reason}</td>
            <td className="border px-3 py-2 text-center">{member.cancellationDetails?.remarks}</td>
            <td className="border px-3 py-2 text-center">
              {member.cancellationDetails?.cancellationLetter ? (
                <a
                  href={member.cancellationDetails.cancellationLetter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
              >
            <FaEye className="text-black  text-xl cursor-pointer hover:text-black" />
                </a>
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </td>
           <td
              onClick={() => handleDelete(member._id)}
              className="border px-3 py-2 text-center"
            >
              🗑️
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  );
};

export default CancelledMembersTable;
