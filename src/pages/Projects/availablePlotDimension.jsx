import React, { useState, useEffect } from "react";
import axios from "axios";

const AvailablePlotDimension = () => {
  const [listProjects, setListProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const res = await axios.get(
        //   "http://localhost:4000/project/all-projects"
        // );
        const res = await axios.get(
          "https://adminpanel.defencehousingsociety.com/project/all-projects"
        );
        setListProjects(res.data.data);
      } catch (error) {
        console.error("Error fetching projects", error);
        toast.error("Failed to load project options");
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = (e) => {
    const projectName = e.target.value;
    const project = listProjects.find((p) => p.projectName === projectName);
    setSelectedProject(project);
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Available Plot Dimensions</h1>

      <select
        className="mb-6 p-2 rounded border capitalize"
        onChange={handleProjectChange}
        defaultValue=""
      >
        <option value="" disabled>
          Select a Project
        </option>
        {listProjects.map((project, index) => (
          <option
            key={index}
            value={project.projectName}
            className="capitalize"
          >
            {project.projectName
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </option>
        ))}
      </select>

      {selectedProject && (
        <div className="bg-white rounded shadow p-4 w-full max-w-3xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border p-2">S.No</th>
                <th className="border p-2">Length</th>
                <th className="border p-2">Breadth</th>
              </tr>
            </thead>
            <tbody>
              {selectedProject.dimensions.map((dim, index) => (
                <tr key={dim._id || index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{dim.length}</td>
                  <td className="border p-2">{dim.breadth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailablePlotDimension;
