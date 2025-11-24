import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import "./addNew.css";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/interceptors";

const AddNewProject = ({ onProjectAdded, projectList = [] }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    shortCode: "",
    status: "",
    location: "",
    description: "",
    dimensions: [],
  });

  const [projects, setProjects] = useState([]);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  console.log("selected id", selectedProjectId);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const res = await axios.get(
        //   "http://localhost:4000/project/all-projects"
        // );
        const data = await axiosInstance.get("/project/all-projects");
        // setProjects(res.data.data);
        setProjects(data.data);
      } catch (err) {
        toast.error("failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  const toggleEditDropdown = () => {
    setShowEditDropdown(!showEditDropdown);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form submitted", formData);

    try {
      const formattedData = {
        ...formData,
        dimensions: formData.dimensions.map((dim) => ({
          length: parseFloat(dim.length),
          breadth: parseFloat(dim.breadth),
        })),
      };

      if (isEditMode && selectedProjectId) {
        console.log("edit mode", isEditMode);
        console.log("selectedprojectid", selectedProjectId);
        // Edit existing project
        // await axios.patch(
        //   `http://localhost:4000/project/edit-project/${selectedProjectId}`,
        //   formattedData
        // );
        await axiosInstance.patch(
          `/project/edit-project/${selectedProjectId}`,
          formattedData
        );
        toast.success("Project updated successfully!");
      } else {
        // Add new project
        // await axios.post(
        //   "http://localhost:4000/project/add-project",
        //   formattedData
        // );
        await axiosInstance.post("/project/add-project", formattedData);
        toast.success("Project added successfully!");
      }

      // Reset form and states
      setFormData({
        projectName: "",
        shortCode: "",
        status: "",
        location: "",
        description: "",
        dimensions: [],
      });
      setSelectedProjectId(null);
      setIsEditMode(false);
      if (onProjectAdded) onProjectAdded();
    } catch (error) {
      if (error.response && error.response.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred while submitting the form.");
      }
      console.error("Submission error:", error);
    }
  };

  const handleAddDimension = () => {
    setFormData((prev) => ({
      ...prev,
      dimensions: [...prev.dimensions, { length: "", breadth: "" }],
    }));
  };

  const handleDimensionChange = (index, e) => {
    const { name, value } = e.target;

    // Allow only positive numbers and decimals (excluding 0 and empty string)
    if (!/^\d*\.?\d*$/.test(value)) return;

    const numericValue = parseFloat(value);
    if (value === "" || numericValue > 0) {
      const updatedDimensions = [...formData.dimensions];
      updatedDimensions[index][name] = value;

      setFormData((prev) => ({
        ...prev,
        dimensions: updatedDimensions,
      }));
    }
  };

  const handleRemoveDimension = (index) => {
    const updatedDimensions = formData.dimensions.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      dimensions: updatedDimensions,
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mt-3 mb-3">
          <button
            type="button"
            onClick={toggleEditDropdown}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Edit Project Details
          </button>
        </div>

        {showEditDropdown && (
          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Select Project to Edit:
            </label>
            <select
              className="w-full px-4 py-2 border rounded-md"
              onChange={(e) => {
                const selected = projects.find(
                  (p) => p.projectName === e.target.value
                );
                if (selected) {
                  setFormData({
                    projectName: selected.projectName,
                    shortCode: selected.shortCode,
                    status: selected.status,
                    location: selected.location || "",
                    description: selected.description || "",
                    dimensions: selected.dimensions.map((d) => ({
                      length: d.length,
                      breadth: d.breadth,
                    })),
                  });
                  console.log("selected project", selected);
                  setSelectedProjectId(selected._id); // set the selected project ID
                  setIsEditMode(true); // enable edit mode
                  setShowEditDropdown(false); // hide dropdown after selection
                }
              }}
            >
              <option value="">-- Select a Project --</option>
              {projects.map((project) => (
                <option key={project.shortCode} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>
        )}

        <form
          className="bg-white p-6 sm:p-8 rounded-xl shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {isEditMode ? "Edit Project Details" : "Add New Project Details"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Project Name */}
            <div>
              <label className="block mb-2 font-medium">Project Name:</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Short Code */}
            <div>
              <label className="block mb-2 font-medium">Short Code:</label>
              <input
                type="text"
                name="shortCode"
                value={formData.shortCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Project Location */}
            <div>
              <label className="block mb-2 font-medium">
                Project Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2} // Adjust number of visible lines
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Project Location:
              </label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2} // Adjust number of visible lines
                required
              ></textarea>
            </div>
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Status:</label>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="current"
                  checked={formData.status === "current"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span className="text-gray-800 font-medium">
                  Current Project
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={formData.status === "completed"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span className="text-gray-800 font-medium">
                  Completed Project
                </span>
              </label>
            </div>
          </div>

          {/* Add Dimension Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAddDimension}
              className={`w-full sm:w-auto px-4 py-2 rounded-md transition text-white ${
                formData.dimensions.length === 0 ||
                (formData.dimensions[formData.dimensions.length - 1].length &&
                  formData.dimensions[formData.dimensions.length - 1].breadth)
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={
                formData.dimensions.length > 0 &&
                (!formData.dimensions[formData.dimensions.length - 1].length ||
                  !formData.dimensions[formData.dimensions.length - 1].breadth)
              }
            >
              + Add Plot Dimension
            </button>
          </div>

          {/* Dimensions List */}
          {formData.dimensions.map((dim, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4 border p-4 rounded-md relative"
            >
              <div>
                <label className="block mb-2 font-medium">Length:</label>
                <input
                  type="number"
                  name="length"
                  value={dim.length}
                  onChange={(e) => handleDimensionChange(index, e)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Breadth:</label>
                <input
                  type="number"
                  name="breadth"
                  value={dim.breadth}
                  onChange={(e) => handleDimensionChange(index, e)}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveDimension(index)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="md:col-span-2">
            {/* <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button> */}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditMode ? "Update Project" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProject;
