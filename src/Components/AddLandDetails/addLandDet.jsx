import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../../api/interceptors";

const AddLandDetails = ({ refreshKey }) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [dimensions, setDimensions] = useState([]);
  const [dimensionId, setDimensionId] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [propertyCost, setPropertyCost] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const res = await axios.get(
        //   "http://localhost:4000/project/all-projects"
        //   // "https://adminpanel.defencehousingsociety.com/project/all-projects"
        // );
        // setProjectOptions(res.data.data || []);
        const data = await axiosInstance.get(
          "/project/all-projects"
          // "https://adminpanel.defencehousingsociety.com/project/all-projects"
        );
        setProjectOptions(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project options");
      }
    };

    fetchProjects();
  }, [refreshKey]);

  const handleProjectChange = (value) => {
    setProjectName(value);
    setDimensionId("");
    setPropertySize("");
    setPricePerSqft("");
    setPropertyCost("");

    const selected = projectOptions.find((p) => p.projectName === value);
    console.log("selected option", selected);

    // Set dimensions if available
    if (selected?.dimensions?.length) {
      setDimensions(selected.dimensions);
    } else {
      setDimensions([]);
    }

    // Set location if available
    if (selected?.location) {
      setLocation(selected.location);
    } else {
      setLocation("");
    }

    if (selected?.description) {
      setDescription(selected.description);
    } else {
      setDescription("");
    }
  };

  const handleDimensionChange = (id) => {
    setDimensionId(id);

    const selectedDim = dimensions.find((dim) => dim._id === id);
    if (selectedDim) {
      const size = selectedDim.length * selectedDim.breadth;
      setPropertySize(size);

      if (selectedDim.pricePerSqft) {
        setPricePerSqft(selectedDim.pricePerSqft.toString());
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
      const cost = parseFloat(propertySize) * parseFloat(pricePerSqft);
      const formatted = isNaN(cost)
        ? ""
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(cost);
      setPropertyCost(formatted);
    } else {
      setPropertyCost("");
    }
  }, [propertySize, pricePerSqft]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !dimensionId || !pricePerSqft) {
      toast.error("Please fill all the fields!");
      return;
    }

    try {
      // const res = await axios.patch(
      //   "http://localhost:4000/project/update-land-details",
      //   // "https://adminpanel.defencehousingsociety.com/project/update-land-details",
      //   {
      //     projectName,
      //     dimensionId,
      //     pricePerSqft: parseFloat(pricePerSqft),
      //     propertyCost: parseFloat(propertyCost.replace(/,/g, "")),
      //     location,
      //     description,
      //   }
      // );
      const data = await axiosInstance.patch(
        "/project/update-land-details",
        // "https://adminpanel.defencehousingsociety.com/project/update-land-details",
        {
          projectName,
          dimensionId,
          pricePerSqft: parseFloat(pricePerSqft),
          propertyCost: parseFloat(propertyCost.replace(/,/g, "")),
          location,
          description,
        }
      );

      toast.success(data.message || "Land details updated!");

      const refreshed = await axios.get(
        // "http://localhost:4000/project/all-projects"
        "https://adminpanel.defencehousingsociety.com/project/all-projects"
      );
      setProjectOptions(refreshed.data.data || []);
      // const refreshed = await axiosInstance.get(
      //   "/project/all-projects"
      //   // "https://adminpanel.defencehousingsociety.com/project/all-projects"
      // );
      // setProjectOptions(refreshed.data.data || []);

      // Reset fields
      setProjectName("");
      setDimensions([]);
      setDimensionId("");
      setPropertySize("");
      setPricePerSqft("");
      setPropertyCost("");
      setLocation("");
      setDescription("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update land details");
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 -mt-10">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full"
        onSubmit={handleSubmit}
      >
        {/* <h2 className="text-2xl font-semibold mb-6"> */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Add Land Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Dropdown */}
          <div>
            <label className="block mb-2 font-medium">Project</label>
            <select
              className="w-full p-3 border rounded"
              value={projectName}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="">Choose a project</option>
              {projectOptions.map((proj) => (
                <option key={proj._id} value={proj.projectName}>
                  {proj.projectName.replace(/(^|\s)\S/g, (l) =>
                    l.toUpperCase()
                  )}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension Dropdown */}
          <div>
            <label className="block mb-2 font-medium">Dimension</label>
            <select
              className="w-full p-3 border rounded"
              value={dimensionId}
              onChange={(e) => handleDimensionChange(e.target.value)}
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
            <label className="block mb-2 font-medium">Per Sqft Price</label>
            <input
              type="number"
              className="w-full p-3 border rounded"
              placeholder="Enter price per sqft"
              value={pricePerSqft}
              onChange={(e) => setPricePerSqft(e.target.value)}
            />
          </div>

          {/* Cost Output */}
          <div>
            <label className="block mb-2 font-medium">Calculated Cost</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-100"
              value={propertyCost}
              disabled
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Project Location</label>
            <textarea
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Project Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            ></textarea>
          </div>

          {/* Submit Button Aligned with Grid */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLandDetails;
