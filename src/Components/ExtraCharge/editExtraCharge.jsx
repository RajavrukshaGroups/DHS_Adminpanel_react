import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditExtraCharge = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();
  const [formData, setFormData] = useState({
    recieptNo: "",
    date: "",
    paymentMode: "",
    paymentType: "",
    chequeNumber: "",
    bankName: "",
    branchName: "",
    transactionId: "",
    ddNumber: "",
    otherCharges: "",
    amount: "",
    name: "",
    SeniorityID: "",
    projectName: "",
    propertySize: "",
  });
  const [existingReceiptIds, setExistingReceiptIds] = useState([]);
  const [receiptError, setReceiptError] = useState("");
  const [originalReceiptNo, setOriginalReceiptNo] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          // `http://localhost:3000/receipt/get-extra-charge-by-paymentid/${paymentId}`
          `http://localhost:4000/receipt/get-extra-charge-by-paymentid/${paymentId}`
        );
        const data = res.data;
        setOriginalReceiptNo(data.data.payment.receiptNo || "");
        setFormData({
          recieptNo: data.data.payment.receiptNo || "",
          date: data.data.payment.date?.slice(0, 10) || "",
          paymentMode: data.data.payment.paymentMode || "",
          paymentType: data.data.payment.paymentType || "Extra Charge",
          chequeNumber: data.data.payment.chequeNumber || "",
          bankName: data.data.payment.bankName || "",
          branchName: data.data.payment.branchName || "",
          transactionId: data.data.payment.transactionId || "",
          ddNumber: data.data.payment.ddNumber || "",
          otherCharges: data.data.payment.otherCharges || "",
          amount: data.data.payment.amount?.toString() || "",
          name: data.data.member.name || "",
          SeniorityID: data.data.member?.SeniorityID || "",
          projectName: data.data.member?.propertyDetails?.projectName || "",
          propertySize:
            `${data.data.member?.propertyDetails?.length} X ${data.data.member?.propertyDetails?.breadth}` ||
            "",
        });
      } catch (error) {
        console.error("Failed to fetch extra charge:", error);
        toast.error("Failed to fetch extra charge details.");
      }
    }
    fetchData();
  }, [paymentId]);

  useEffect(() => {
    const fetchReceiptIds = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:3000/receipt/get-all-receipt-ids"
          "http://localhost:4000/receipt/get-all-receipt-ids"
        );
        console.log("response receipts", response);
        setExistingReceiptIds(response.data.receiptIds);
      } catch (error) {
        console.error("failed to fetch receipt ids", error);
        toast.error("failed to load receipt ids");
      }
    };
    fetchReceiptIds();
  }, []);

  // const handleInputChange = (field) => (e) => {
  //   const value = e.target.value;

  //   if (field === "recieptNo") {
  //     if (existingReceiptIds.map(String).includes(value.trim())) {
  //       setReceiptError("Receipt number already exists!");
  //     } else {
  //       setReceiptError("");
  //     }
  //   }
  //   setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  // };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "recieptNo") {
      if (
        value.trim() !== originalReceiptNo &&
        existingReceiptIds.map(String).includes(value.trim())
      ) {
        setReceiptError("Receipt number already exists!");
      } else {
        setReceiptError("");
      }
    }

    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (receiptError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await axios.put(
        // `http://localhost:3000/receipt/update-extra-charge-receipt/${paymentId}`,
        `http://localhost:4000/receipt/update-extra-charge-receipt/${paymentId}`,
        formData
      );
      toast.success("receipt updated successfully");
      console.log("updated:", response.data);
      setTimeout(() => {
        navigate("/viewextracharges"); // or wherever you want
      }, 1500);
    } catch (err) {
      console.error("error updating receipt:", err);
      toast.error("failed to update receipt");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Edit Extra Charge
        </h1>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {/* Receipt No & Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Receipt No
              </label>
              <input
                type="text"
                value={formData.recieptNo}
                onChange={handleInputChange("recieptNo")}
                className={`w-full border rounded px-3 py-2 ${
                  receiptError ? "border-red-500" : ""
                }`}
                required
              />
              {receiptError && (
                <p className="text-red-500 text-sm">{receiptError}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleInputChange("date")}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Name & Seniority ID */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Seniority ID
              </label>
              <input
                type="text"
                value={formData.SeniorityID}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>

          {/* Project Name & Property Size */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Property Size
              </label>
              <input
                type="text"
                value={formData.propertySize}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>

          {/* Payment Mode & Type */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Payment Mode
              </label>
              <select
                value={formData.paymentMode}
                onChange={handleInputChange("paymentMode")}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="dd">DD</option>
                <option value="netbanking">Netbanking/UPI</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Payment Type
              </label>
              <input
                type="text"
                value={formData.paymentType}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>

          {/* Conditional Inputs Based on Payment Mode */}
          {(formData.paymentMode === "cheque" ||
            formData.paymentMode === "dd" ||
            formData.paymentMode === "netbanking") && (
            <>
              {formData.paymentMode === "cheque" && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Cheque Number
                    </label>
                    <input
                      type="text"
                      value={formData.chequeNumber}
                      onChange={handleInputChange("chequeNumber")}
                      className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
              {formData.paymentMode === "dd" && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      DD Number
                    </label>
                    <input
                      type="text"
                      value={formData.ddNumber}
                      onChange={handleInputChange("ddNumber")}
                      className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
              {formData.paymentMode === "netbanking" && (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={formData.transactionId}
                      onChange={handleInputChange("transactionId")}
                      className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}

              {/* Bank and Branch for all these payment modes */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={handleInputChange("bankName")}
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={handleInputChange("branchName")}
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </>
          )}

          {/* Other Charges */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Other Charges
            </label>
            <textarea
              value={formData.otherCharges}
              onChange={handleInputChange("otherCharges")}
              className="border border-gray-300 rounded-md p-2 w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter details for other charges..."
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              value={formData.amount}
              onChange={handleInputChange("amount")}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-2 mt-6 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditExtraCharge;
