import React from 'react'

function MemberShipDetails({ formData, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Membership Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Receipt No</label>
          <input
            type="text"
            name="recieptNo"
            placeholder="Receipt No"
            value={formData.recieptNo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">No of Shares</label>
          <input
            type="number" 
            name="numberOfShares"
            placeholder="No of Shares"
            value={formData.noofShares}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>    
          <label className="block font-medium mb-1">Share Fee
          </label>
          <input
            type="number"
            name="shareFee"
            placeholder="Share Fee"
            value={formData.shareFee}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Membership Fee</label>
          <input
            type="number"
            name="memberShipFee"
            placeholder="Membership Fee"
            value={formData.memberShipFee}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Application Fee</label>
          <input
            type="number"
            name="applicationFee"
            placeholder="Application Fee"
            value={formData.applicationFee}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Admission Fee</label>
          <input
            type="number"
            name="adminissionFee"
            placeholder="Admission Fee"
            value={formData.adminissionFee}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Miscellaneous Expenses</label>
          <input
            type="number"
            name="miscellaneousExpenses"
            placeholder="Miscellaneous Expenses"
            value={formData.miscellaneousExpenses}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}

export default MemberShipDetails

