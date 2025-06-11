import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/interceptors";

function PlotTransferhistory() {
  const [transferData, setTransferData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/plot/plot-Transferhistory", {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: rowsPerPage
        }
      });
      console.log(res,'responses are coming ')
      setTransferData(res);
    } catch (error) {
      console.error("Error fetching transfer history:", error)
    }
  };

  fetchData();
  
}, [searchTerm, currentPage]);

  const filteredData = transferData.filter((item) => {
  return (
    item.fromMemberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fromMemberEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.toMemberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.toMemberEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentPageData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 px-4 py-6">
      <div className="w-full max-w-8xl bg-white rounded-lg shadow p-6">
        <div className="mt-4 overflow-x-auto">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, email or Seniority ID"
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-center">S.No</th>
                <th className="border px-3 py-2 text-center">Member From</th>
                <th className="border px-3 py-2 text-center">Member To</th>
                <th className="border px-3 py-2 text-center">Project Name</th>
                <th className="border px-3 py-2 text-center">Seniority ID</th>
                <th className="border px-3 py-2 text-center">Transfer Date</th>
                <th className="border px-3 py-2 text-center">Reason</th>
                <th className="border px-3 py-2 text-center">Date</th>
              </tr>
            </thead>
           <tbody>
                {currentPageData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No transfer data found.
                    </td>
                  </tr>
                ) : (
                  currentPageData.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-3 py-2 text-center">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.fromMemberName || "N/A"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.toMemberName || "N/A"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.projectName || "N/A"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.SeniorityID || "N/A"}

                        {/* Seniority ID field not available in response now */}
                       
                      </td>
                      <td className="border px-3 py-2 text-center">
                       {new Date().toLocaleDateString()}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {/* Reason not available in backend yet */}
                        {item.transferReason || "N/A"}

                      </td>
                      <td className="border px-3 py-2 text-center">
                        {new Date().toLocaleDateString()} {/* fallback if createdAt not available */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="flex justify-center mt-6 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-medium mt-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50" >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlotTransferhistory;
