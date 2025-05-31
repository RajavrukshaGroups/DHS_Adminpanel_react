import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewLandDetails = () => {
  const [listProjects, setListProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const res = await axios.get(
        //   "http://localhost:3000/project/all-projects"
        // );
        const res = await axios.get(
          "http://localhost:4000/project/all-projects"
        );
        setListProjects(res.data.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = (e) => {
    const project = listProjects.find((p) => p.shortCode === e.target.value);
    setSelectedProject(project);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          View Land Details
        </h1>

        <div className="mb-6">
          <label htmlFor="projectSelect" className="block mb-2 font-medium">
            Select Project
          </label>
          <select
            id="projectSelect"
            onChange={handleProjectChange}
            className="border px-3 py-2 rounded-md w-full capitalize"
          >
            <option value="">-- Select a Project --</option>
            {listProjects.map((project, index) => (
              <option
                key={index}
                value={project.shortCode}
                className="capitalize"
              >
                {project.projectName
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-3">Available Land Details</h2>
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-center">S.No</th>
                  <th className="border px-3 py-2 text-center">Plot Size</th>
                  <th className="border px-3 py-2 text-center">
                    Price PerSqFt
                  </th>
                  <th className="border px-3 py-2 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedProject.dimensions.map((dim, index) => (
                  <tr key={dim._id || index}>
                    <td className="border px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {dim.length} x {dim.breadth}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      ₹{dim.pricePerSqft.toLocaleString("en-IN")}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      ₹{dim.propertyCost.toLocaleString("en-IN")}/-
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLandDetails;
