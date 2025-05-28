import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaEye } from "react-icons/fa";

const ViewExtraCharge = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchData = async (pageNum = 1, searchQuery = "") => {
    try {
      const res = await axios.get(
        `http://localhost:3000/receipt/collect-all-extrachargehistory`,
        {
          params: {
            page: pageNum,
            limit: 10,
            search: searchQuery,
          },
        }
      );
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        // if user is searching, reset to page 1
        setPage(1);
        fetchData(1, search);
      } else {
        fetchData(page, search);
      }
    }, 500); // debounce time

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

  const handleViewReceipt = (receiptId, paymentId) => {
    const url = `http://localhost:3000/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">View Extra Charges</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, project or seniority ID"
          className="border px-3 py-2 rounded w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Project Details</th>
              <th className="border p-2">Member Name</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Total Ex.Amount</th>
              <th className="border p-2">Payment Mode</th>
              <th className="border p-2">Reference ID</th>
              <th className="border p-2">Paid Date</th>
              <th className="border p-2">View</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.paymentId}>
                  <td className="border p-2 text-center">
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td className="border p-2 whitespace-pre-line text-center">
                    Seniority ID: {item.SeniorityID || ""} <br />
                    Project Name: {item.projectName || ""} <br />
                    Property Size: {item.plotDimension || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {item.memberName || ""}
                  </td>
                  <td className="border p-2 capitalize text-center">
                    {item.otherCharges || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {item.amount.toLocaleString("en-IN")}/-
                  </td>
                  <td className="border p-2 capitalize text-center">
                    {item.paymentMode || ""}
                  </td>
                  <td className="border p-2 text-center">
                    {item.transactionId ||
                      item.chequeNumber ||
                      item.ddNumber ||
                      "-"}
                  </td>
                  <td className="border p-2 text-center">
                    {formatDate(item.date)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() =>
                        handleViewReceipt(item.receiptId, item.paymentId)
                      }
                    >
                      <FaEye className="text-blue-600 cursor-pointer inline-block text-center" />
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <FaEdit className="text-blue-600 cursor-pointer inline-block text-center" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="border p-4 text-center text-gray-500"
                >
                  No matches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => {
            if (page > 1) {
              const newPage = page - 1;
              setPage(newPage);
            }
          }}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => {
            if (page < totalPages) {
              const newPage = page + 1;
              setPage(newPage);
            }
          }}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewExtraCharge;
