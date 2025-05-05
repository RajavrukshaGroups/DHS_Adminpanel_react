import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddLandDetails = ({refreshKey}) => {
  const [project, setProject] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimensionId, setSelectedDimensionId] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [propertyCost, setPropertyCost] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3000/project/all-projects");
      setProjectOptions(res.data.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load project options");
    }
  };

  // Fetch project names
  useEffect(() => {
    fetchProjects();
  }, [refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!project || !selectedDimensionId || !propertySize || !pricePerSqft) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:3000/project/update-land-details",
        {
          projectName: project,
          dimensionId: selectedDimensionId,
          pricePerSqft: parseFloat(pricePerSqft),
          propertyCost: parseFloat(propertyCost.replace(/,/g, "")), // Remove commas before sending
        }
      );
      toast.success(res.data.message);

      setProject("");
      setSelectedDimensionId("");
      setPropertySize("");
      setPricePerSqft("");
      setPropertyCost("");
      setDimensions([]);

      fetchProjects();
    } catch (err) {
      console.error("Error saving land details:", err);
      toast.error("Failed to save land details!");
    }
  };

  const handleCostCalculation = (size, price) => {
    const cost = parseFloat(size) * parseFloat(price);
    return isNaN(cost)
      ? ""
      : new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(cost);
  };

  const handleProjectChange = (value) => {
    setProject(value);
    setSelectedDimensionId("");
    setPropertySize("");
    setPropertyCost("");
    setPricePerSqft("");

    const selected = projectOptions.find((p) => p.projectName === value);

    if (selected?.dimensions?.length) {
      setDimensions(selected.dimensions);
    } else {
      setDimensions([]);
    }
  };

  const handleDimensionChange = (dimensionId) => {
    setSelectedDimensionId(dimensionId);
    const dim = dimensions.find((d) => d._id === dimensionId);
    if (dim) {
      const size = dim.length * dim.breadth;
      setPropertySize(size);

      // Use pricePerSqft from dimension if available
      if (dim.pricePerSqft) {
        setPricePerSqft(dim.pricePerSqft.toString());
      } else {
        setPricePerSqft("");
      }
    } else {
      setPropertySize("");
      setPricePerSqft("");
    }
  };

  useEffect(() => {
    if (propertySize && pricePerSqft) {
      const cost = handleCostCalculation(propertySize, pricePerSqft);
      setPropertyCost(cost);
    } else {
      setPropertyCost("");
    }
  }, [propertySize, pricePerSqft]);

  return (
    <div className="w-full max-w-4xl p-4">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-6">Add Land Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Dropdown */}
          <div>
            <label className="block mb-2 font-medium">Project</label>
            <select
              value={project}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full p-3 border rounded"
            >
              <option value="">Choose an option</option>
              {projectOptions.map((proj, i) => (
                <option key={i} value={proj.projectName}>
                  {proj.projectName.replace(/(^|\s)\S/g, (l) =>
                    l.toUpperCase()
                  )}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension Dropdown */}
          <div>
            <label className="block mb-2 font-medium">Property Size</label>
            <select
              value={selectedDimensionId}
              onChange={(e) => handleDimensionChange(e.target.value)}
              className="w-full p-3 border rounded"
              disabled={!dimensions.length}
            >
              <option value="">Choose a dimension</option>
              {dimensions.map((dim) => (
                <option key={dim._id} value={dim._id}>
                  {dim.length} x {dim.breadth}
                </option>
              ))}
            </select>
          </div>

          {/* Price Input */}
          <div>
            <label className="block mb-2 font-medium">
              Per Sqft Property Price
            </label>
            <input
              type="number"
              value={pricePerSqft}
              onChange={(e) => setPricePerSqft(e.target.value)}
              className="w-full p-3 border rounded"
              placeholder="Enter per sqft property price"
            />
          </div>

          {/* Cost Output */}
          <div>
            <label className="block mb-2 font-medium">
              Selected Property Cost
            </label>
            <input
              type="text"
              value={propertyCost}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddLandDetails;
