import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ProppertyDetails({ formData, handleChange, refreshKey,formErrors }) {
  const [projectOptions, setProjectOptions] = useState([]);
  const [dimensions, setDimensions] = useState([]);

  // Fetch projects on mount or when refreshKey changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:3000/project/all-projects");
        setProjectOptions(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project options");
      }
    };

    fetchProjects();
  }, [refreshKey]);

  // Update dimensions when projectName changes
  useEffect(() => {
    const selected = projectOptions.find((p) => p.projectName === formData.projectName);
    if (selected?.dimensions?.length) {
      setDimensions(selected.dimensions);
    } else {
      setDimensions([]);
    }
  }, [formData.projectName, projectOptions]);

  useEffect(() => {
    if (formData.PropertySize && formData.perSqftPropertyPrice) {
      const cost = parseFloat(formData.PropertySize) * parseFloat(formData.perSqftPropertyPrice);
      const formatted = isNaN(cost)
        ? ""
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(cost);
      handleChange({ target: { name: "selectedPropertyCost", value: formatted } });
    } else {
      handleChange({ target: { name: "selectedPropertyCost", value: "" } });
    }
  }, [formData.PropertySize, formData.perSqftPropertyPrice]);

useEffect(() => {
    if (formData.selectedPropertyCost && formData.percentage) {
      const numericCost = parseFloat(formData.selectedPropertyCost.replace(/,/g, ""));
      const percentageCost = (numericCost * parseFloat(formData.percentage)) / 100;
  
      const formattedPercentage = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(percentageCost);
  
      handleChange({ target: { name: "percentageCost", value: formattedPercentage } });
    } else {
      handleChange({ target: { name: "percentageCost", value: "" } });
    }
  }, [formData.selectedPropertyCost, formData.percentage]);
  

  // Handle project selection
  const handleProjectSelect = (e) => {
    const projectName = e.target.value;
    handleChange({ target: { name: "projectName", value: projectName } });

    // Reset dependent fields
    handleChange({ target: { name: "PropertySize", value: "" } });
    handleChange({ target: { name: "perSqftPropertyPrice", value: "" } });
    handleChange({ target: { name: "selectedPropertyCost", value: "" } });
  };

  // const handleDimensionSelect = (e) => {
  //   const dimId = e.target.value;
  //   const selectedDim = dimensions.find((dim) => dim._id === dimId);
  //   if (selectedDim) {
  //     const size = selectedDim.length * selectedDim.breadth;
  //     handleChange({ target: { name: "PropertySize", value: size } });
  //     handleChange({
  //       target: {
  //         name: "perSqftPropertyPrice",
  //         value: selectedDim.pricePerSqft?.toString() || "",
  //       },
  //     });
  //   }
  // };

  const handleDimensionSelect = (e) => {
    const dimId = e.target.value;
    const selectedDim = dimensions.find((dim) => dim._id === dimId);
    if (selectedDim) {
      const size = selectedDim.length * selectedDim.breadth;
  
      handleChange({ target: { name: "PropertySize", value: size } });
      handleChange({ target: { name: "perSqftPropertyPrice", value: selectedDim.pricePerSqft?.toString() || "" } });
  
      // ADD THESE:
      handleChange({ target: { name: "plotLength", value: selectedDim.length.toString() } });
      handleChange({ target: { name: "plotBreadth", value: selectedDim.breadth.toString() } });
    }
  };

  return (
    
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Project</label>
          <select
            name="projectName"
            value={formData.projectName}
            onChange={handleProjectSelect}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Select project</option>
            {projectOptions.map((proj) => (
              <option key={proj._id} value={proj.projectName}>
                {proj.projectName}
              </option>
            ))}
          </select>
          {formErrors.projectName && <p className="text-red-600 text-sm">{formErrors.projectName}</p>}  
        </div>

        <div>
          <label className="block font-medium mb-1">Dimension</label>
          <select
            onChange={handleDimensionSelect}
            className="w-full border px-4 py-2 rounded-md"
            disabled={!dimensions.length}
          >
            <option value="">Choose dimension</option>
            {dimensions.map((dim) => (
              <option key={dim._id} value={dim._id}>
                {dim.length} x {dim.breadth}
              </option>
            ))}
          </select>
          {formErrors.PropertySize && <p className="text-red-600 text-sm">{formErrors.PropertySize}</p>}
        </div>
                <input
          type="hidden"
          name="plotLength"
          value={formData.plotLength}
        />

        <input
          type="hidden"
          name="plotBreadth"
          value={formData.plotBreadth}
        />
        <div>
          <label className="block font-medium mb-1">Per Sqft Property Price</label>
          <input
            type="number"
            min={0}
            name="perSqftPropertyPrice"
            placeholder="Per Sqft Property Price"
            value={formData.perSqftPropertyPrice}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.perSqftPropertyPrice && <p className="text-red-600 text-sm">{formErrors.perSqftPropertyPrice}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Selected Property Cost</label>
          <input
            type="text"
            name="selectedPropertyCost"
            placeholder="Selected Property Cost"
            value={formData.selectedPropertyCost}
            readOnly
            className="w-full border px-4 py-2 rounded-md bg-gray-100"
          />
          {formErrors.selectedPropertyCost && <p className="text-red-600 text-sm">{formErrors.selectedPropertyCost}</p>}
        </div>

        <div>
  <label className="block font-medium mb-1">Percentage</label>
  <div className="flex gap-4 items-center">
    {[25, 30].map((percent) => (
      <label key={percent} className="flex items-center gap-1">
        <input
          type="radio"
          name="percentage"
          value={percent}
          checked={parseInt(formData.percentage) === percent}
          onChange={(e) =>
            handleChange({ target: { name: "percentage", value: e.target.value } })
          }
        />
        {percent}%
      </label>
    ))}
  </div>
  {formErrors.percentage && <p className="text-red-600 text-sm">{formErrors.percentage}</p>}
</div>

<div>
  <label className="block font-medium mb-1">Selected Percentage Cost</label>
  <input
    type="text"
    name="percentageCost"
    value={formData.percentageCost}
    readOnly
    className="w-full border px-4 py-2 rounded-md bg-gray-100"
  />
  {formErrors.percentageCost && <p className="text-red-600 text-sm">{formErrors.percentageCost}</p>}
</div>

      </div>
    </div>
  );
}

export default ProppertyDetails;



