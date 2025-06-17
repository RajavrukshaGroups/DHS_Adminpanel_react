import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ViewProjects = () => {
  const [listProjects, setListProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:4000/project/all-projects");
      // const res = await axios.get("https://adminpanel.defencehousingsociety.com/project/all-projects");
      setListProjects(res.data.data);
    } catch (error) {
      console.error("error fetching projects", error);
      toast.error("Failed to load project options");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchProjects();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a project name to search.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:4000/project/search-projectname",
        // "https://adminpanel.defencehousingsociety.com/project/search-projectname",
        {
          params: { searchQuery },
        }
      );
      setListProjects(res.data.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error);
        toast.error(error.response.data.message);
        setListProjects([]); // Clear table if no results
      } else {
        console.error("Error searching for projects", error);
        toast.error("Failed to search projects");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-4xl bg-white rounded-lg shadow-md p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search by project name"
            className="border px-4 py-2 rounded w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <h2 className="text-center text-xl font-semibold mb-4">
          Available Land Details
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Project Name</th>
                <th className="border px-4 py-2">Short Code</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {listProjects.map((project, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2 capitalize">
                    {project.projectName}
                  </td>
                  <td className="border px-4 py-2 uppercase">
                    {project.shortCode}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {project.status === "current"
                      ? "Current project"
                      : "Completed project"}
                  </td>
                </tr>
              ))}
              {listProjects.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProjects;
