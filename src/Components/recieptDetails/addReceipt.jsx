import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddReceipt = () => {
  const { id } = useParams();
  console.log("add receipt id", id);
  const navigate = useNavigate();
  const [membersData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingReceiptIds, setExistingReceiptIds] = useState([]);
  const [receiptError, setReceiptError] = useState("");
  const [formData, setFormData] = useState({
    recieptNo: "",
    date: "",
    paymentType: "",
    paymentMode: "",
    bankName: "",
    branchName: "",
    amount: "",
    installment: "",
    chequeNumber: "",
    transactionId: "",
    ddNumber: "",
    correspondenceAddress: "",
  });
  console.log("members data", membersData);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(
          // `http://localhost:4000/member/get-member/${id}`,
          `https://adminpanel.defencehousingsociety.com/member/get-member/${id}`,
        );
        setTimeout(() => {
          setMemberData(response.data.member);
          setFormData((prev) => ({
            ...prev,
            correspondenceAddress: response.data.member.contactAddress || "",
          }));
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("failed to fetch member", error);
        toast.error("failed to fetch member details");
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  useEffect(() => {
    const fetchReceiptIds = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:4000/receipt/get-all-receipt-ids",
          "https://adminpanel.defencehousingsociety.com/receipt/get-all-receipt-ids",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "recieptNo") {
      if (existingReceiptIds.includes(value.trim())) {
        setReceiptError("Receipt number already exists!");
      } else {
        setReceiptError("");
      }
    }

    if (name === "paymentMode" && !formData.paymentType) {
      toast.error("Please select a payment type first.");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (receiptError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await axios.post(
        // `http://localhost:4000/member/add-receipt/${id}`,
        `https://adminpanel.defencehousingsociety.com/member/add-receipt/${id}`,
        formData,
      );

      if (response.status === 200) {
        toast.success("Receipt added successfully");
        setFormData({
          recieptNo: "",
          date: "",
          paymentType: "",
          paymentMode: "",
          bankName: "",
          branchName: "",
          amount: "",
          installment: "",
          chequeNumber: "",
          transactionId: "",
          ddNumber: "",
          correspondenceAddress: "",
        });
        navigate(`/view-history/${id}`);
      } else {
        toast.error("Something went wrong while adding receipt");
      }
    } catch (err) {
      console.error("Add receipt error:", err);
      toast.error("Failed to add receipt");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!membersData) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No member data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-4xl w-full p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-6 capitalize text-center">
          {membersData.propertyDetails?.projectName}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Receipt NO :</label>
            <input
              type="text"
              name="recieptNo"
              value={formData.recieptNo}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${
                receiptError ? "border-red-500" : ""
              }`}
              required
            />
            {receiptError && (
              <p className="text-red-500 text-sm mt-1">{receiptError}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Date :</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={membersData?.name}
              readOnly
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1">Correspondence Address :</label>
            <textarea
              name="correspondenceAddress"
              value={formData?.correspondenceAddress}
              onChange={handleChange}
              // readOnly
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          {/* Payment Type & Mode */}
          <div>
            <label className="block mb-1">Payment Type:</label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Choose Payment Type</option>
              <option value="siteadvance">Site Advance</option>
              {/* <option value="siteDownPayment">Site Down Payment</option> */}
              <option value="sitedownpayment">Site Down Payment</option>
              <option value="installments">Installments</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Payment Mode:</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Choose payment mode</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="netbanking/upi">Netbanking/UPI</option>
              <option value="dd">DD</option>
            </select>
          </div>

          {/* Amount (Cash or other) */}
          {formData.paymentMode === "Cash" && (
            <div>
              <label className="block mb-1">Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          )}

          {formData.paymentMode && formData.paymentMode !== "Cash" && (
            <>
              <div>
                <label className="block mb-1">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">Branch Name:</label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1">Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              {formData.paymentMode === "Cheque" && (
                <div>
                  <label className="block mb-1">Cheque Number:</label>
                  <input
                    type="text"
                    name="chequeNumber"
                    value={formData.chequeNumber}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}

              {formData.paymentMode === "netbanking/upi" && (
                <div>
                  <label className="block mb-1">Transaction ID / UTR No:</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}

              {formData.paymentMode === "dd" && (
                <div>
                  <label className="block mb-1">DD Number:</label>
                  <input
                    type="text"
                    name="ddNumber"
                    value={formData.ddNumber}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
            </>
          )}

          {/* Installment */}
          {formData.paymentType === "installments" && (
            <div>
              <label className="block mb-1">Installment:</label>
              <select
                name="installment"
                value={formData.installment}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Choose Installment</option>
                <option
                  value="firstInstallment"
                  // disabled={usedInstallments.includes("firstInstallment")}
                >
                  First Installment{" "}
                  {/* {usedInstallments.includes("firstInstallment") &&
                    "(Already Added)"} */}
                </option>
                <option
                  value="secondInstallment"
                  // disabled={usedInstallments.includes("secondInstallment")}
                >
                  Second Installment{" "}
                  {/* {usedInstallments.includes("secondInstallment") &&
                    "(Already Added)"} */}
                </option>
                <option
                  value="thirdInstallment"
                  // disabled={usedInstallments.includes("thirdInstallment")}
                >
                  Third Installment{" "}
                  {/* {usedInstallments.includes("thirdInstallment") &&
                    "(Already Added)"} */}
                </option>
              </select>
            </div>
          )}

          <div className="col-span-2 text-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Submit Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReceipt;
