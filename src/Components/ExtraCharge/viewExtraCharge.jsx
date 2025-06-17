import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaEye } from "react-icons/fa";

const ViewExtraCharge = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("extra charges", data);

  const fetchData = async (pageNum = 1, searchQuery = "") => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const res = await axios.get(
        `http://localhost:4000/receipt/collect-all-extrachargehistory`,
        // `https://adminpanel.defencehousingsociety.com/receipt/collect-all-extrachargehistory`,
        {
          params: {
            page: pageNum,
            limit: 10,
            search: searchQuery,
          },
        }
      );

      // Enforce a minimum delay of 500ms
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => {
        setData(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(res.data.page);
        setLoading(false);
      }, remaining);
    } catch (err) {
      console.error("Error fetching data", err);
      setTimeout(() => {
        setData([]); // reset data on error
        setLoading(false);
      }, 500); // show spinner for at least 500ms on error too
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(1, search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    if (!search) {
      fetchData(page);
    }
  }, [page]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

  const handleViewReceipt = (receiptId, paymentId) => {
    const url = `http://localhost:4000/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    // const url = `https://adminpanel.defencehousingsociety.com/receipt/get-receipt-details/${receiptId}?paymentId=${paymentId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      {/* <div className="p-4"> */}
      <div className="p-4 bg-white rounded shadow-md w-full max-w-7xl">
        <h1 className="text-xl font-bold mb-4 text-center">
          View Extra Charges
        </h1>

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
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-6">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
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
                      {item.paymentMode?.toLowerCase() === "netbanking"
                        ? item.transactionId || "-"
                        : item.paymentMode?.toLowerCase() === "cheque"
                        ? item.chequeNumber || "-"
                        : item.paymentMode?.toLowerCase() === "dd"
                        ? item.ddNumber || "-"
                        : "-"}
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
                        <FaEye className="text-blue-600 cursor-pointer inline-block" />
                      </button>
                    </td>
                    <td className="border p-2 text-center">
                      <FaEdit
                        className="text-blue-600 cursor-pointer inline-block"
                        onClick={() =>
                          navigate(`/edit-extra-charge/${item.paymentId}`)
                        }
                      />
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
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExtraCharge;
