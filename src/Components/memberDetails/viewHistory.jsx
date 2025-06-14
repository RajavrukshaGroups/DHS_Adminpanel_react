import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const ViewReceiptHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [membersData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState([]);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const tableRef = useRef(null); // Add this ref
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  console.log("receipts data", receiptData);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(
          // `http://localhost:3000/member/get-member/${id}`
          `https://adminpanel.defencehousingsociety.com/member/get-member/${id}`
        );
        // console.log("Member data:", response.data.member);
        setTimeout(() => {
          setMemberData(response.data.member);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch member", error);
        toast.error("Failed to fetch member details");
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const fetchReceipts = async () => {
    setReceiptLoading(true);
    try {
      const res = await axios.get(
        // `http://localhost:3000/receipt/receipts/member/${id}`
        `https://adminpanel.defencehousingsociety.com/receipt/receipts/member/${id}`
      );
      setTimeout(() => {
        setReceiptData(res.data);
        setReceiptLoading(false);
      }, 500); // Delay for smoother loading experience
    } catch (err) {
      toast.error("Failed to fetch receipt history");
      setReceiptLoading(false);
    }
  };

  console.log("receipts data", receiptData);

  useEffect(() => {
    if (!receiptLoading && receiptData.length > 0 && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [receiptLoading, receiptData]);

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

  const handleViewReceipt = (receiptId, paymentId) => {
    // const url = `http://localhost:3000/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    const url = `https://adminpanel.defencehousingsociety.com/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    window.open(url, "_blank");
  };

  const confirmDelete = async () => {
    try {
      const { receiptId, paymentType, installmentNumber } = selectedReceipt;
      await axios.delete(
        // `http://localhost:3000/member/delete-member-receipt-payment/${membersData._id}`,
        `https://adminpanel.defencehousingsociety.com/member/delete-member-receipt-payment/${membersData._id}`,
        {
          data: { paymentType, installmentNumber },
        }
      );
      toast.success("receipt deleted successfully");
      setShowDeleteModal(false);
      setSelectedReceipt(null);
      fetchReceipts();
    } catch (error) {
      toast.error("failed to delete receipt");
      console.error(error);
    }
  };

  const handleEditReceipt = (receiptId, paymentId) => {
    const url = `/edit-receipt/${receiptId}?paymentId=${paymentId}`;
    navigate(url);
  };

  const handleDeleteClick = (receiptId, paymentType, installmentNumber) => {
    setSelectedReceipt({ receiptId, paymentType, installmentNumber });
    setShowDeleteModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Member Info Card */}
      <div className="bg-white rounded-md shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Payment History for {membersData.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Name:</label>
            <input
              type="text"
              value={membersData.name}
              readOnly
              className="mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Phone:</label>
            <input
              type="text"
              value={membersData.mobileNumber}
              readOnly
              className="mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              value={membersData.email}
              readOnly
              className="mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Project Name:</label>
            <input
              type="text"
              value={membersData.propertyDetails?.projectName || "-"}
              readOnly
              className="mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Seniority ID:</label>
            <input
              type="text"
              value={membersData.SeniorityID || "-"}
              readOnly
              className="mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Plot Size:</label>
            <input
              type="text"
              value={
                membersData.propertyDetails
                  ? `${membersData.propertyDetails.length} X ${membersData.propertyDetails.breadth}`
                  : "-"
              }
              readOnly
              className="mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {receiptLoading ? (
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        ) : (
          <>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              onClick={fetchReceipts}
            >
              Get Receipts History
            </button>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              onClick={() => {
                // Redirect or open add receipt page/modal
                window.location.href = `/add-receipt/${id}`;
              }}
            >
              Add Receipt
            </button>
          </>
        )}
      </div>

      {/* Receipt Table Section */}
      {receiptData.length > 0 && (
        <div ref={tableRef} className="bg-white mt-8 p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Receipt History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm font-medium text-gray-700">
                  <th className="px-3 py-2 border text-center">S.No</th>
                  <th className="px-3 py-2 border text-center">Payment Type</th>
                  <th className="px-3 py-2 border text-center">Payment Mode</th>
                  <th className="px-3 py-2 border text-center">Bank</th>
                  <th className="px-3 py-2 border text-center">
                    Ref / Cheque / DD No
                  </th>
                  <th className="px-3 py-2 border text-center">Amount</th>
                  <th className="px-3 py-2 border text-center">Date</th>
                  <th className="px-3 py-2 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.map((receipt, i) =>
                  receipt.payments.map((payment, j) => (
                    <tr key={`${receipt._id}-${j}`} className="text-sm">
                      <td className="px-3 py-2 border text-center">{j + 1}</td>
                      <td className="px-3 py-2 border capitalize text-center">
                        {payment.paymentType === "installments"
                          ? payment.installmentNumber
                          : payment.paymentType}
                      </td>
                      <td className="px-3 py-2 border capitalize text-center">
                        {payment.paymentMode}
                      </td>
                      <td className="px-3 py-2 border text-center">
                        {payment.bankName || "-"}
                      </td>
                      <td className="px-3 py-2 border text-center">
                        {payment.paymentMode?.toLowerCase() === "netbanking"
                          ? payment.transactionId
                          : payment.paymentMode?.toLowerCase() === "cheque"
                          ? payment.chequeNumber
                          : payment.paymentMode?.toLowerCase() === "dd"
                          ? payment.ddNumber
                          : "-"}
                      </td>

                      <td className="px-3 py-2 border text-center">
                        {/* ₹{payment.amount.toLocaleString("en-IN")}/- */}₹
                        {payment.paymentType === "Membership Fee"
                          ? Number(
                              payment?.admissionFee +
                                payment?.applicationFee +
                                payment?.membershipFee +
                                payment?.miscellaneousExpenses +
                                payment?.shareFee
                            ).toLocaleString("en-IN")
                          : Number(payment.amount).toLocaleString("en-IN")}
                        /-
                      </td>
                      <td className="px-3 py-2 border text-center">
                        {new Date(payment.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-3 py-2 border text-blue-600 text-lg text-center">
                        <div className="flex justify-center items-center gap-3 h-full">
                          <button
                            title="View"
                            onClick={() => {
                              handleViewReceipt(receipt._id, payment._id);
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => {
                              handleEditReceipt(receipt._id, payment._id);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            title="Delete"
                            onClick={() =>
                              handleDeleteClick(
                                receipt._id,
                                payment.paymentType,
                                payment.installmentNumber
                              )
                            }
                          >
                            <FaTrashAlt className="text-red-500 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this receipt?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReceiptHistory;
