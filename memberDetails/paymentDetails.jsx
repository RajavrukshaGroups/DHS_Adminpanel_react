import React from 'react'

function PaymentDetails({ formData, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Payment Type:</label>
          <input
            type="text"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Payment Mode:</label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Select Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="online">Online</option>
            <option value="card">Card</option>
          </select>
        </div>
        {/* <div>
          <label className="block font-medium mb-1">Payment Mode:</label>
          <input
            type="text"
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div> */}
        <div>
          <label className="block font-medium mb-1">Bank Name:</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
          Branch Name:</label>
          <input
            type="text"
            name="brnachName"
            value={formData.branchName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
          Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}

export default PaymentDetails

