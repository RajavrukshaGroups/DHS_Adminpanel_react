import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

const ViewReceiptDetails = () => {
  const [receipts, setReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async (page = 1, search = "") => {
    try {
      const res = await axios.get(
        // `http://localhost:4000/receipt/get-receipt-details`,
        `https://adminpanel.defencehousingsociety.com/receipt/get-receipt-details`,
        {
          params: {
            page,
            limit: 10,
            search,
          },
        }
      );
      if (res.data?.data) {
        setReceipts(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("error fetching receipts:", err);
    }
  };

  useEffect(() => {
    fetchReceipts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const debouncedSearch = debounce((value) => {
    setCurrentPage(1);
    setSearchTerm(value);
  }, 500);

  const handleViewReceipt = (receiptId, paymentId) => {
    const url = `https://adminpanel.defencehousingsociety.com/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    // const url = `http://localhost:4000/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    window.open(url, "_blank");
  };

  const confirmDelete = async () => {
    try {
      const { paymentType, installmentNumber, memberId } = selectedReceipt;
      await axios.delete(
        `https://adminpanel.defencehousingsociety.com/member/delete-member-receipt-payment/${memberId}`,
        // `http://localhost:4000/member/delete-member-receipt-payment/${memberId}`,
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

  const handleDeleteClick = (
    receiptId,
    paymentType,
    installmentNumber,
    memberId
  ) => {
    setSelectedReceipt({ receiptId, paymentType, installmentNumber, memberId });
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6 flex items-center justify-center">
      <div className="p-4 bg-white rounded shadow-md w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          View Receipt Details
        </h1>
        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="enter receipt no, name, seniority ID, or project"
            className="border px-4 py-2 w-full md:w-96 rounded"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-center">S.No</th>
                <th className="p-2 border text-center">Created Date</th>
                <th className="p-2 border text-center">Receipt Number</th>
                <th className="p-2 border text-center">Member Details</th>
                <th className="p-2 border text-center">Project Name</th>
                <th className="p-2 border text-center">Total Amount</th>
                <th className="p-2 border text-center">Payment Type</th>
                <th className="p-2 border text-center">Payment Mode</th>
                <th className="p-2 border text-center">Status</th>
                <th className="p-2 border text-center">Action</th>
                <th className="p-2 border text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length > 0 ? (
                receipts.map((receipt, index) => {
                  const payment = receipt.payment;
                  const serialNumber = (currentPage - 1) * 10 + index + 1;

                  return (
                    <tr key={payment._id} className="text-center">
                      <td className="px-4 py-2 border">{serialNumber}</td>
                      <td className="px-4 py-2 border">
                        {new Date(payment.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 border">{payment.receiptNo}</td>
                      <td className="px-4 py-2 border">
                        {receipt.member?.name}
                        <br />
                        Seniority ID: {receipt.member?.SeniorityID}
                      </td>
                      <td className="px-4 py-2 border capitalize">
                        {receipt.member?.propertyDetails?.projectName}
                      </td>
                      <td className="px-4 py-2 border">
                        ₹
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
                      <td className="px-4 py-2 border capitalize">
                        {payment.paymentType}
                      </td>
                      <td className="px-4 py-2 border capitalize">
                        {payment.paymentMode}
                      </td>
                      <td
                        className={`px-4 py-2 border font-semibold ${
                          receipt.member?.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {receipt.member?.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() =>
                            handleViewReceipt(receipt._id, payment._id)
                          }
                        >
                          👁️
                        </button>
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() =>
                            handleDeleteClick(
                              receipt._id,
                              payment.paymentType,
                              payment.installmentNumber,
                              receipt.member._id
                            )
                          }
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No receipts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>

          <div className="flex gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReceiptDetails;
