import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import "./addNew.css";
import "react-toastify/dist/ReactToastify.css";

const AddNewProject = ({ onProjectAdded }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    shortCode: "",
    status: "",
    dimensions: [],
  });

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

      const response = await axios.post(
        "http://localhost:3000/project/add-project",
        formattedData
      );
      toast.success("Project added successfully!");

      setFormData({
        projectName: "",
        shortCode: "",
        status: "",
        dimensions: [],
      });

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
    <div className="w-full max-w-4xl p-4">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6">Add New Project Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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

        <div className="mb-6">
          <label className="block mb-2 font-medium">Status:</label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="current"
                checked={formData.status === "current"}
                onChange={handleChange}
                className="mr-2"
              />
              Current Project
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="completed"
                checked={formData.status === "completed"}
                onChange={handleChange}
                className="mr-2"
              />
              Completed Project
            </label>
          </div>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={handleAddDimension}
            className={`px-4 py-2 rounded-md transition text-white ${
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

        {formData.dimensions.map((dim, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 border p-4 rounded-md relative"
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNewProject;
