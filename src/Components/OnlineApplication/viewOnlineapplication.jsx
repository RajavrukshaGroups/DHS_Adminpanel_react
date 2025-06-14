import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const OnlineApplicationsTable = () => {
  const [memberDetails, setMemberDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOnlineApplications = async () => {
    try {
      const response = await axios.post(
        "https://adminpanel.defencehousingsociety.com/defenceWebsiteRoutes/get-online-applications",
        {
          search: searchTerm,
          page: currentPage,
          limit: 10,
        }
      );
      setMemberDetails(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchOnlineApplications();
  }, [searchTerm, currentPage]);

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
                <th className="border px-3 py-2 text-center">Name</th>
                <th className="border px-3 py-2 text-center">Date</th>
                <th className="border px-3 py-2 text-center">Email</th>
                <th className="border px-3 py-2 text-center">Phone Number</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {memberDetails.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No application data found.
                  </td>
                </tr>
              ) : (
                memberDetails.map((member, index) => (
                  <tr key={member._id}>
                    <td className="border px-3 py-2 text-center">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.name}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {new Date(member.date).toLocaleDateString()}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.email}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {member.mobileNumber}
                    </td>
                    <Link to={`/from-application/${member._id}`}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        View
                      </button>
                    </Link>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {memberDetails.length > 0 && (
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
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineApplicationsTable;
