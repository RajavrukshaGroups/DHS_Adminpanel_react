import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomersContact = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchData = async (page = 1, searchQuery = "") => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await axios.get(
        `http://localhost:4000/admin/contactedmembers?page=${page}&limit=10&search=${searchQuery}`
      );
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => {
        setData(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setLoading(false);
        setIsFirstLoad(false); // ✅ Mark first load as complete
      }, remaining);
    } catch (err) {
      console.error("Error fetching data:", err);
      setTimeout(() => {
        setData([]);
        setLoading(false);
        setIsFirstLoad(false); // ✅ Even on error, mark it complete
      }, 500);
    }
  };

  // Debounced fetch on search or page change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(currentPage, search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, currentPage]);

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="p-4 bg-white rounded shadow-md w-full max-w-7xl">
        <h1 className="text-xl font-bold mb-4 text-center">
          Customers Contact Details
        </h1>

        <div className="mb-4 flex justify-center">
          <input
            type="text"
            value={search}
            disabled={loading}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email or phone"
            className="border px-3 py-2 rounded w-1/3"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Message</th>
                <th className="border p-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((contact, index) => (
                  <tr key={contact._id}>
                    <td className="border p-2">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="border p-2">
                      {contact.createdAt ? formatDate(contact.createdAt) : "-"}
                    </td>
                    <td className="border p-2">{contact.name}</td>
                    <td className="border p-2">{contact.phone}</td>
                    <td className="border p-2">{contact.email}</td>
                    <td className="border p-2">
                      {contact.message || contact.subject}
                    </td>
                    <td className="border p-2">
                      {contact.location?.trim() ? contact.location : "-"}
                    </td>
                  </tr>
                ))
              ) : !isFirstLoad ? ( // ✅ Only show message if not first load
                <tr>
                  <td
                    colSpan="6"
                    className="border p-4 text-center text-gray-500"
                  >
                    No matches found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomersContact;
