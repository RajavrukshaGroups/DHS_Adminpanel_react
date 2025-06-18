import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";

const ExtraChargeFormDetails = () => {
  const [seniorityId, setSeniorityId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [seniorityIdOptions, setSeniorityIdOptions] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [existingReceiptIds, setExistingReceiptIds] = useState([]);
  const [receiptError, setReceiptError] = useState("");
  console.log("members data", memberData);

  const [formData, setFormData] = useState({
    recieptNo: "",
    date: "",
    paymentMode: "",
    paymentType: "Extra Charge",
    chequeNumber: "",
    bankName: "",
    branchName: "",
    transactionId: "",
    ddNumber: "",
    otherCharges: "",
    amount: "",
  });

  useEffect(() => {
    const fetchSeniorityIds = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:4000/member/collect-seniorityIds"
          "https://adminpanel.defencehousingsociety.com/member/collect-seniorityIds"
        );
        if (response.data.success) {
          const options = response.data.SeniorityIds.map((id) => ({
            value: id,
            label: id,
          }));
          setSeniorityIdOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch Seniority IDs:", error);
      }
    };
    fetchSeniorityIds();
  }, []);

  useEffect(() => {
    const fetchReceiptIds = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:4000/receipt/get-all-receipt-ids"
          "https://adminpanel.defencehousingsociety.com/receipt/get-all-receipt-ids"
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

  const handleSubmitSeniority = async () => {
    if (!seniorityId?.value) return;

    try {
      const response = await axios.get(
        // `http://localhost:4000/member/member-info-seniority-id?SeniorityID=${seniorityId.value}`
        `https://adminpanel.defencehousingsociety.com/member/member-info-seniority-id?SeniorityID=${seniorityId.value}`
      );

      if (response.data.success) {
        setMemberData(response.data.member);
        setShowForm(true);
      } else {
        setShowForm(false);
        setMemberData(null);
        // alert("No member found with the selected Seniority ID.");
        toast.error("No member found with the selected Seniority ID.");
      }
    } catch (error) {
      console.error("Error fetching member info:", error);
      toast.error("Server error while fetching member info.");
      // alert("Server error while fetching member info.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSeniorityId(null);
    setMemberData(null);
    setFormData({
      recieptNo: "",
      date: "",
      paymentType: "Extra Charge",
      paymentMode: "",
      chequeNumber: "",
      bankName: "",
      branchName: "",
      transactionId: "",
      ddNumber: "",
      otherCharges: "",
      amount: "",
    });
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    console.log("receipt value", value);
    console.log("field name", field);

    if (field === "recieptNo") {
      if (existingReceiptIds.map(String).includes(value.trim())) {
        setReceiptError("Receipt number already exists!");
      } else {
        setReceiptError("");
      }
    }

    setFormData({ ...formData, [field]: value });
  };

  const handleFormSubmit = async () => {
    const { recieptNo, date, paymentMode, paymentType, otherCharges, amount } =
      formData;

    if (receiptError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (
      !recieptNo ||
      !date ||
      !paymentMode ||
      !paymentType ||
      !otherCharges ||
      !amount
    ) {
      toast.error("Please fill in all required fields.");
      // alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      seniorityId: seniorityId?.value,
      memberId: memberData?._id,
      name: memberData?.name,
      mobileNumber: memberData?.mobileNumber,
      email: memberData?.email,
      address: memberData?.permanentAddress,
      ...formData,
    };

    try {
      const response = await axios.post(
        // `http://localhost:4000/member/add-receipt/${memberData._id}`,
        `https://adminpanel.defencehousingsociety.com/member/add-receipt/${memberData._id}`,
        payload
      );
      if (response.status === 200) {
        // alert("Extra Charge submitted successfully!");
        toast.success("Extra charge receipt added successfully");
        handleCancel();
      } else {
        // alert("Failed to submit extra charge.");
        toast.error("failed to submit extra charge receipt");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error submitting extra charge.");
    }
  };

  const paymentMode = formData.paymentMode;

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-4xl mx-auto mt-10">
        {/* Seniority ID Search Section */}
        <div className="p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Enter or Select Seniority ID
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-grow">
                <Select
                  options={seniorityIdOptions}
                  value={seniorityId}
                  onChange={setSeniorityId}
                  placeholder="Search or select Seniority ID"
                  isClearable
                  className="text-sm"
                  noOptionsMessage={() => "No match found"}
                />
              </div>
              <button
                onClick={handleSubmitSeniority}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enter
              </button>
              {showForm && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {showForm && memberData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Name" value={memberData.name} readOnly />
                <InputField
                  label="Mobile Number"
                  value={memberData.mobileNumber}
                  readOnly
                />
                <InputField
                  label="Email ID"
                  value={memberData.email}
                  readOnly
                />
              </div>
              <InputField
                label="Residence/Contact Address"
                value={memberData.contactAddress}
                readOnly
              />
            </div>
          )}
        </div>

        {/* Extra Charges Form */}
        {showForm && (
          <div className="mt-10 p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Extra Charge Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  label="Receipt No"
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

              <InputField
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleInputChange("date")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Payment Type"
                value={formData.paymentType}
                readOnly
              />
              <div className="mb-4">
                <label className="block font-semibold mb-1">Payment Mode</label>
                <select
                  className="w-full border px-4 py-2 rounded"
                  value={formData.paymentMode}
                  onChange={handleInputChange("paymentMode")}
                >
                  <option value="">Select</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="netbanking">Netbanking / UPI</option>
                  <option value="dd">DD</option>
                </select>
              </div>
            </div>

            {/* Conditional Fields */}
            {paymentMode === "cheque" && (
              <>
                <InputField
                  label="Cheque Number"
                  value={formData.chequeNumber}
                  onChange={handleInputChange("chequeNumber")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={handleInputChange("bankName")}
                  />
                  <InputField
                    label="Branch Name"
                    value={formData.branchName}
                    onChange={handleInputChange("branchName")}
                  />
                </div>
              </>
            )}

            {paymentMode === "netbanking" && (
              <>
                <InputField
                  label="Transaction ID"
                  value={formData.transactionId}
                  onChange={handleInputChange("transactionId")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={handleInputChange("bankName")}
                  />
                  <InputField
                    label="Branch Name"
                    value={formData.branchName}
                    onChange={handleInputChange("branchName")}
                  />
                </div>
              </>
            )}

            {paymentMode === "dd" && (
              <>
                <InputField
                  label="DD Number"
                  value={formData.ddNumber}
                  onChange={handleInputChange("ddNumber")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={handleInputChange("bankName")}
                  />
                  <InputField
                    label="Branch Name"
                    value={formData.branchName}
                    onChange={handleInputChange("branchName")}
                  />
                </div>
              </>
            )}

            <InputField
              label="Amount"
              value={formData.amount}
              onChange={handleInputChange("amount")}
            />

            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Reason for Extra Charge
              </label>
              <textarea
                value={formData.otherCharges}
                onChange={handleInputChange("otherCharges")}
                className="w-full border px-4 py-2 rounded resize-none"
                rows={4}
                placeholder="Enter reason here..."
              />
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleFormSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit Extra Charge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
}) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full border px-4 py-2 rounded ${
        readOnly ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

export default ExtraChargeFormDetails;
