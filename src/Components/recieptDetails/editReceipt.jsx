import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receiptsData, setReceiptsData] = useState(null);
  const [membersData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingReceiptIds, setExistingReceiptIds] = useState([]);
  const [receiptError, setReceiptError] = useState("");

  const [formData, setFormData] = useState({
    receiptNo: "",
    date: "",
    paymentType: "",
    paymentMode: "",
    bankName: "",
    branchName: "",
    amount: "",
    installmentNumber: "",
    chequeNumber: "",
    transactionId: "",
    ddNumber: "",
    admissionFee: "",
    applicationFee: "",
    membershipFee: "",
    miscellaneousExpenses: "",
    shareFee: "",
    numberOfShares: "",
  });

  console.log("formdata", formData);

  useEffect(() => {
    const fetchReceiptIds = async () => {
      try {
        const response = await axios.get(
          "https://adminpanel.defencehousingsociety.com/receipt/get-all-receipt-ids",
          // "http://localhost:4000/receipt/get-all-receipt-ids",
        );
        setExistingReceiptIds(response.data.receiptIds);
      } catch (error) {
        console.error("failed to fetch receipt ids", error);
        toast.error("failed to load receipt ids");
      }
    };
    fetchReceiptIds();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(
          `https://adminpanel.defencehousingsociety.com/receipt/edit-receipt/payment-history/${id}${window.location.search}`,
          // `http://localhost:4000/receipt/edit-receipt/payment-history/${id}${window.location.search}`,
        );

        setTimeout(() => {
          const { payment, member } = response.data;
          console.log("payment address", payment);

          // Set payment data
          setReceiptsData(payment);

          // Set member data
          setMemberData(member);

          // Initialize form fields
          setFormData({
            receiptNo: payment.receiptNo || "",
            date: payment.date ? payment.date.substring(0, 10) : "",
            paymentType: payment.paymentType || "",
            paymentMode: payment.paymentMode || "",
            bankName: payment.bankName || "",
            branchName: payment.branchName || "",
            amount: payment.amount || "",
            installmentNumber: payment.installmentNumber || "",
            chequeNumber: payment.chequeNumber || "",
            transactionId: payment.transactionId || "",
            ddNumber: payment.ddNumber || "",
            numberOfShares: payment.numberOfShares || "",
            shareFee: payment.shareFee || "",
            membershipFee: payment.membershipFee || "",
            applicationFee: payment.applicationFee || "",
            admissionFee: payment.admissionFee || "",
            miscellaneousExpenses: payment.miscellaneousExpenses || "",
            correspondenceAddress: payment.correspondenceAddress || "",
          });

          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("failed to fetch member", error);
        toast.error("failed to fetch member details");
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [id]);

  useEffect(() => {
    if (formData.paymentType === "Membership Fee") {
      const {
        shareFee,
        membershipFee,
        applicationFee,
        admissionFee,
        miscellaneousExpenses,
      } = formData;
      const total =
        (parseFloat(shareFee) || 0) +
        (parseFloat(membershipFee) || 0) +
        (parseFloat(applicationFee) || 0) +
        (parseFloat(admissionFee) || 0) +
        (parseFloat(miscellaneousExpenses) || 0);

      setFormData((prev) => ({
        ...prev,
        amount: total,
      }));
    }
  }, [
    formData.shareFee,
    formData.membershipFee,
    formData.applicationFee,
    formData.admissionFee,
    formData.miscellaneousExpenses,
    formData.paymentType,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (name === "receiptNo") {
    //   if (
    //     value.trim() !== receiptsData.receiptNo &&
    //     existingReceiptIds.includes(value.trim())
    //   ) {
    //     setReceiptError("Receipt number already exists");
    //   } else {
    //     setReceiptError("");
    //   }
    // }

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
      const response = await axios.put(
        // `http://localhost:4000/member/edit-receipt/${membersData._id}?paymentId=${receiptsData._id}`,
        `https://adminpanel.defencehousingsociety.com/member/edit-receipt/${membersData._id}?paymentId=${receiptsData._id}`,
        formData,
      );

      if (response.status === 200) {
        toast.success("Receipt added successfully");
        setFormData({
          receiptNo: "",
          date: "",
          paymentMode: "",
          paymentType: "",
          bankName: "",
          branchName: "",
          amount: "",
          installmentNumber: "",
          chequeNumber: "",
          transactionId: "",
          ddNumber: "",
          admissionFee: "",
          applicationFee: "",
          membershipFee: "",
          miscellaneousExpenses: "",
          shareFee: "",
          numberOfShares: "",
          correspondenceAddress: "",
        });
        navigate(`/view-history/${membersData._id}`);
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

  if (!receiptsData) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No member data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center gap-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-10 w-full"
      >
        {/* Customer Details */}
        <div className="max-w-4xl w-full p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-semibold mb-6 capitalize text-center">
            Customer Details
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Receipt NO :</label>
              <input
                type="text"
                name="receiptNo"
                value={formData.receiptNo}
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
              />
            </div>
            <div>
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={membersData?.name || ""}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1">Address:</label>
              <textarea
                type="text"
                name="correspondenceAddress"
                onChange={handleChange}
                value={
                  formData.correspondenceAddress || membersData.contactAddress
                }
                // readOnly
                className="w-full border rounded px-3 py-2"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="max-w-4xl w-full p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-semibold mb-6 capitalize text-center">
            Payment Details
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              {/* <input
                type="text"
                name="paymentType"
                value={formData.paymentType}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              /> */}
              <label className="block mb-1">Payment Type :</label>
              {formData.paymentType === "Membership Fee" ? (
                <input
                  type="text"
                  name="paymentType"
                  value={formData.paymentType}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              ) : (
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
              )}
            </div>
            <div>
              <label className="block mb-1">Payment Mode :</label>
              <select
                type="text"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Payment Mode</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="netbanking/upi">NetBanking/UPI</option>
                <option value="dd">DD</option>
              </select>
            </div>

            {formData.paymentMode !== "cash" && (
              <>
                <div>
                  <label className="block mb-1">Bank Name :</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Branch Name :</label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Conditional payment fields */}
                {formData.paymentMode === "cheque" && (
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
                    <label className="block mb-1">Transaction ID:</label>
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

            {formData.paymentType === "Membership Fee" && (
              <>
                <div>
                  <label className="block mb-1">No. of Shares:</label>
                  <input
                    type="number"
                    name="numberOfShares"
                    value={formData.numberOfShares}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Share Fee:</label>
                  <input
                    type="number"
                    name="shareFee"
                    value={formData.shareFee}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Membership Fee:</label>
                  <input
                    type="number"
                    name="membershipFee"
                    value={formData.membershipFee}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Application Fee:</label>
                  <input
                    type="number"
                    name="applicationFee"
                    value={formData.applicationFee}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Admission Fee:</label>
                  <input
                    type="number"
                    name="admissionFee"
                    value={formData.admissionFee}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Miscellaneous Expenses:</label>
                  <input
                    type="number"
                    name="miscellaneousExpenses"
                    value={formData.miscellaneousExpenses}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </>
            )}

            {formData.paymentType === "installments" && (
              <div>
                <label className="block mb-1">Installment:</label>
                <select
                  name="installmentNumber"
                  value={formData.installmentNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Installment</option>
                  <option value="firstInstallment">First installment</option>
                  <option value="secondInstallment">Second installment</option>
                  <option value="thirdInstallment">Third installment</option>
                </select>
              </div>
            )}
            <div>
              <label className="block mb-1">Amount :</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                readOnly={formData.paymentType === "Membership Fee"}
                className={`w-full border rounded px-3 py-2 ${
                  formData.paymentType === "Membership Fee" ? "bg-gray-100" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditReceipt;
