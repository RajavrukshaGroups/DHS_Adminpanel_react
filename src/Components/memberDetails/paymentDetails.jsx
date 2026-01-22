import React, { use, useEffect } from "react";
import axiosInstance from "../../api/interceptors";
function PaymentDetails({ formData, handleChange, formErrors }) {
  console.log("formdata payments", formData);
  const paymentMode = formData?.paymentMode;
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        let response;
        if (formData?.memberId) {
          response = await axiosInstance.get(
            `https://adminpanel.defencehousingsociety.com/member/get-member-receipt/${formData.memberId}`,
            // `http://localhost:4000/member/get-member-receipt/${formData.memberId}`,
          );
        } else if (formData?.onlineApplicationId) {
          response = await axiosInstance.get(
            `https://adminpanel.defencehousingsociety.com/member/get-member-onlineApplication/${formData.onlineApplicationId}`,
            // `http://localhost:4000/member/get-member-onlineApplication/${formData.onlineApplicationId}`,
          );
          console.log(response, "response in paymeent details application");
        }

        if (response) {
          const data = response;

          const fieldsToUpdate = [
            "paymentType",
            "paymentMode",
            "bankName",
            "branchName",
            "amount",
            "chequeNumber",
            "transactionId",
            "ddNumber",
            "applicationFee",
            "admissionFee",
            "miscellaneousExpenses",
            "membershipFee",
            "shareFee",
            "numberOfShares",
            "date",
          ];

          fieldsToUpdate.forEach((field) => {
            if (data[field] !== undefined) {
              handleChange({
                target: { name: field, value: data[field] || "" },
              });
            }
          });
        }
      } catch (error) {
        console.error("❌ Error fetching payment details:", error);
      }
    };

    fetchPaymentData();
  }, [formData?.memberId, formData?.onlineApplicationId]);

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
            value={formData?.paymentType || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.paymentType && (
            <p className="text-red-500 text-sm">{formErrors.paymentType}</p>
          )}
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
            <option value="netbanking/upi">Netbanking/UPI</option>
            <option value="dd">DD</option>
          </select>
          {formErrors.paymentMode && (
            <p className="text-red-500 text-sm">{formErrors.paymentMode}</p>
          )}
        </div>

        {/* Common Inputs for cheque, netbanking, DD */}
        {(paymentMode === "cheque" ||
          paymentMode === "netbanking/upi" ||
          paymentMode === "dd") && (
          <>
            <div>
              <label className="block font-medium mb-1">Bank Name:</label>
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData?.bankName || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
              {formErrors.bankName && (
                <p className="text-red-500 text-sm">{formErrors.bankName}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Branch Name:</label>
              <input
                type="text"
                name="branchName"
                placeholder="Branch Name"
                value={formData?.branchName || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
              {formErrors.branchName && (
                <p className="text-red-500 text-sm">{formErrors.branchName}</p>
              )}
            </div>
          </>
        )}

        {/* Amount for all modes */}
        {(paymentMode === "cash" ||
          paymentMode === "cheque" ||
          paymentMode === "netbanking/upi" ||
          paymentMode === "dd") && (
          <div>
            <label className="block font-medium mb-1">Amount:</label>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData?.amount || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.amount && (
              <p className="text-red-500 text-sm">{formErrors.amount}</p>
            )}
          </div>
        )}

        {/* Specific Fields */}
        {paymentMode === "cheque" && (
          <div>
            <label className="block font-medium mb-1">Cheque Number:</label>
            <input
              type="text"
              name="chequeNumber"
              placeholder="Cheque Number"
              value={formData?.chequeNumber || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.chequeNumber && (
              <p className="text-red-500 text-sm">{formErrors.chequeNumber}</p>
            )}
          </div>
        )}

        {paymentMode === "netbanking/upi" && (
          <div>
            <label className="block font-medium mb-1">Transaction ID:</label>
            <input
              type="text"
              name="transactionId"
              placeholder="Transaction ID"
              value={formData?.transactionId || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.transactionId && (
              <p className="text-red-500 text-sm">{formErrors.transactionId}</p>
            )}
          </div>
        )}

        {paymentMode === "dd" && (
          <div>
            <label className="block font-medium mb-1">DD Number:</label>
            <input
              type="text"
              name="ddNumber"
              placeholder="DD Number"
              value={formData?.ddNumber || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
            {formErrors.ddNumber && (
              <p className="text-red-500 text-sm">{formErrors.ddNumber}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentDetails;
