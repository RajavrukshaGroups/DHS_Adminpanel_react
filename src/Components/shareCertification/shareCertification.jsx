import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
const ShareCertificate = () => {
  const [receipts, setReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReceipts = async (page = 1, search = "") => {
    try {
      const res = await axios.get(
        // `http://localhost:3000/receipt/get-receipt-details`,
        // `http://localhost:4000/receipt/collect-share-certificates`,
        `https://adminpanel.defencehousingsociety.com/receipt/collect-share-certificates`,
        {
          params: {
            page,
            limit: 10,
            search,
          },
        },
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

  const handleShareCertificate = (receiptId) => {
    // const url = `http://localhost:4000/receipt/get-share-certificate/${receiptId}`;
    const url = `https://adminpanel.defencehousingsociety.com/receipt/get-share-certificate/${receiptId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 px-4 py-6">
      {/* <h1 className="text-2xl font-bold mb-4">View Share Certificates</h1> */}
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          View Share Certificates
        </h1>
        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="enter name or email"
            className="border px-4 py-2 w-full md:w-96 rounded"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <table className="w-full text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-center">S.No</th>
              <th className="p-2 border text-center">Member Name</th>
              <th className="p-2 border text-center">Member Email</th>
              <th className="p-2 border text-center">Member Mobile</th>
              <th className="p-2 border text-center">Share Amount</th>
              <th className="p-2 border text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length > 0 ? (
              (() => {
                let serialCounter = (currentPage - 1) * 10;

                const filteredReceipts = receipts.filter((receipt) =>
                  receipt.payments?.some(
                    (payment) => payment.shareFee && payment.shareFee > 0,
                  ),
                );

                return filteredReceipts.flatMap((receipt) =>
                  receipt.payments
                    .filter(
                      (payment) => payment.shareFee && payment.shareFee > 0,
                    )
                    .map((payment) => {
                      // console.log("payment1234", payment);
                      serialCounter += 1;
                      return (
                        <tr key={payment._id} className="text-center">
                          <td className="px-4 py-2 border">{serialCounter}</td>
                          <td className="px-4 py-2 border">
                            {receipt.member?.name}
                            {/* Seniority ID: {receipt.member?.SeniorityID} */}
                          </td>
                          <td className="px-4 py-2 border">
                            {receipt.member?.email}
                            {/* Seniority ID: {receipt.member?.SeniorityID} */}
                          </td>
                          <td className="px-4 py-2 border">
                            {receipt.member?.mobileNumber}
                            {/* Seniority ID: {receipt.member?.SeniorityID} */}
                          </td>
                          <td className="px-4 py-2 border">
                            {payment?.shareFee}
                            {/* Seniority ID: {receipt.member?.SeniorityID} */}
                          </td>
                          <td className="px-4 py-2 border">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                handleShareCertificate(receipt._id);
                              }}
                            >
                              👁️
                            </button>
                          </td>
                        </tr>
                      );
                    }),
                );
              })()
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
  );
};

export default ShareCertificate;
