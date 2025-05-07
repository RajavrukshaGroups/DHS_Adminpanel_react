import React from 'react'

function SeniorityDetails({ formData, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Seniority ID</label>
          <input
            type="text"
            name="seniorityId"
            value={formData.seniorityId}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Membership No</label>
          <input
            type="number"
            name="membershipNo"
            value={formData.membershipNo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Confirmation Letter No</label>
          <input
            type="number"
            name="cunfirmationLetterNo"
            value={formData.cunfirmationLetterNo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Share Certificate Number</label>
          <input
            type="number"
            name="shareCertificateNo"
            value={formData.shareCertificateNo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}

export default SeniorityDetails

