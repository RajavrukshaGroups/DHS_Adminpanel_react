import React from 'react';

function PaymentDetails({ formData, handleChange, formErrors }) {
  console.log("formData in PaymentDetails:", formData);
  
  const paymentMode = formData?.paymentMode;
  console.log(paymentMode,'paymentModeeeeeeeeee');
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Type */}
        <div>
          <label className="block font-medium mb-1">Payment Type:</label>
          <input
            type="text"
            name="paymentType"
            placeholder="Payment Type"
            value={formData?.paymentType || ''}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.paymentType && <p className="text-red-500 text-sm">{formErrors.paymentType}</p>}
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block font-medium mb-1">Payment Mode:</label>
          <select
            name="paymentMode"
            value={formData?.paymentMode}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Select Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="netbanking">Netbanking/UPI</option>
            <option value="DD">DD</option>
          </select>
          {formErrors.paymentMode && <p className="text-red-500 text-sm">{formErrors.paymentMode}</p>}
        </div>

        {/* Common Inputs for cheque, netbanking, DD */}
        {(paymentMode === 'cheque' || paymentMode === 'netbanking' || paymentMode === 'DD') && (
          <>
            <div>
              <label className="block font-medium mb-1">Bank Name:</label>
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData?.bankName || ''}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
              {formErrors.bankName && <p className="text-red-500 text-sm">{formErrors.bankName}</p>}
            </div>
            <div>
              <label className="block font-medium mb-1">Branch Name:</label>
              <input
                type="text"
                name="branchName"
                placeholder="Branch Name"
                value={formData?.branchName || ''}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
              {formErrors.branchName && <p className="text-red-500 text-sm">{formErrors.branchName}</p>}
            </div>
          </>
        )}

        {/* Amount for all modes */}
        {(paymentMode === 'cash' || paymentMode === 'cheque' || paymentMode === 'netbanking' || paymentMode === 'DD') && (
          <div>
            <label className="block font-medium mb-1">Amount:</label>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData?.amount || ''}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.amount && <p className="text-red-500 text-sm">{formErrors.amount}</p>}
          </div>
        )}

        {/* Specific Fields */}
        {paymentMode === 'cheque' && (
          <div>
            <label className="block font-medium mb-1">Cheque Number:</label>
            <input
              type="text"
              name="chequeNumber"
              placeholder="Cheque Number"
              value={formData?.chequeNumber || ''}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.chequeNumber && <p className="text-red-500 text-sm">{formErrors.chequeNumber}</p>}
          </div>
        )}

        {paymentMode === 'netbanking' && (
          <div>
            <label className="block font-medium mb-1">Transaction ID:</label>
            <input
              type="text"
              name="transactionId"
              placeholder="Transaction ID"
              value={formData?.transactionId || ''}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.transactionId && <p className="text-red-500 text-sm">{formErrors.transactionId}</p>}
          </div>
        )}

        {paymentMode === 'DD' && (
          <div>
            <label className="block font-medium mb-1">DD Number:</label>
            <input
              type="text"
              name="ddNumber"
              placeholder="DD Number"
              value={formData?.ddNumber || ''}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.ddNumber && <p className="text-red-500 text-sm">{formErrors.ddNumber}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentDetails;
