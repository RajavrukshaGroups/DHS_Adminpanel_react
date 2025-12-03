import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ProppertyDetails({ formData, handleChange, refreshKey, formErrors }) {
  console.log("formdata-propertyDetails", formData);
  const [projectOptions, setProjectOptions] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimId, setSelectedDimId] = useState(""); // new state

  // Fetch projects on mount or when refreshKey changes
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "https://adminpanel.defencehousingsociety.com/project/all-projects"
        );
        // const res = await axios.get(
        //   "http://localhost:4000/project/all-projects"
        // );
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
    const selected = projectOptions.find(
      (p) => p.projectName === formData?.projectName
    );
    if (selected?.dimensions?.length) {
      setDimensions(selected.dimensions);
    } else {
      setDimensions([]);
    }
    // reset selected dimension id when project changed
    setSelectedDimId("");
  }, [formData?.projectName, projectOptions]);

  // Try to pre-select a matching dimension when dimensions or formData change
  useEffect(() => {
    if (!dimensions || dimensions.length === 0) {
      setSelectedDimId("");
      return;
    }

    // 1) if formData contains an explicit dimension id (rare), prefer that
    // (if you store it somewhere like formData.dimensionId)
    if (formData?.dimensionId) {
      const found = dimensions.find((d) => d._id === formData.dimensionId);
      if (found) {
        setSelectedDimId(found._id);
        return;
      }
    }

    // 2) match by plotLength & plotBreadth if available (most reliable)
    if (
      formData?.plotLength !== undefined &&
      formData?.plotBreadth !== undefined &&
      formData.plotLength !== "" &&
      formData.plotBreadth !== ""
    ) {
      const match = dimensions.find(
        (d) =>
          Number(d.length) === Number(formData.plotLength) &&
          Number(d.breadth) === Number(formData.plotBreadth)
      );
      if (match) {
        setSelectedDimId(match._id);
        return;
      }
    }

    // 3) match by PropertySize (length*breadth)
    if (formData?.PropertySize) {
      const matchBySize = dimensions.find((d) => {
        const size = Number(d.length) * Number(d.breadth);
        return Number(size) === Number(formData.PropertySize);
      });
      if (matchBySize) {
        setSelectedDimId(matchBySize._id);
        // also ensure plotLength/plotBreadth reflect matched dimension
        handleChange({
          target: { name: "plotLength", value: String(matchBySize.length) },
        });
        handleChange({
          target: { name: "plotBreadth", value: String(matchBySize.breadth) },
        });
        handleChange({
          target: {
            name: "perSqftPropertyPrice",
            value: matchBySize.pricePerSqft?.toString() || "",
          },
        });
        return;
      }
    }

    // else leave it empty
    setSelectedDimId("");
  }, [
    dimensions,
    formData?.plotLength,
    formData?.plotBreadth,
    formData?.PropertySize,
  ]);

  useEffect(() => {
    if (formData?.PropertySize && formData?.perSqftPropertyPrice) {
      const cost =
        parseFloat(formData.PropertySize) *
        parseFloat(formData.perSqftPropertyPrice);
      const formatted = isNaN(cost)
        ? ""
        : new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(cost);
      handleChange({
        target: { name: "selectedPropertyCost", value: formatted },
      });
    } else {
      handleChange({ target: { name: "selectedPropertyCost", value: "" } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.PropertySize, formData?.perSqftPropertyPrice]);

  useEffect(() => {
    if (formData?.selectedPropertyCost && formData?.percentage) {
      const numericCost = parseFloat(
        formData.selectedPropertyCost?.toString().replace(/,/g, "")
      );
      const percentageCost =
        (numericCost * parseFloat(formData.percentage)) / 100;

      const formattedPercentage = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(percentageCost);

      handleChange({
        target: { name: "percentageCost", value: formattedPercentage },
      });
    } else {
      handleChange({ target: { name: "percentageCost", value: "" } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.selectedPropertyCost, formData?.percentage]);

  // Handle project selection
  const handleProjectSelect = (e) => {
    const projectName = e.target.value;
    handleChange({ target: { name: "projectName", value: projectName } });

    // Reset dependent fields
    handleChange({ target: { name: "PropertySize", value: "" } });
    handleChange({ target: { name: "perSqftPropertyPrice", value: "" } });
    handleChange({ target: { name: "selectedPropertyCost", value: "" } });

    // reset selected dim id
    setSelectedDimId("");
  };

  const handleDimensionSelect = (e) => {
    const dimId = e.target.value;
    setSelectedDimId(dimId);

    const selectedDim = dimensions.find((dim) => dim._id === dimId);
    if (selectedDim) {
      const size = Number(selectedDim.length) * Number(selectedDim.breadth);

      handleChange({ target: { name: "PropertySize", value: size } });
      handleChange({
        target: {
          name: "perSqftPropertyPrice",
          value: selectedDim.pricePerSqft?.toString() || "",
        },
      });

      handleChange({
        target: { name: "plotLength", value: selectedDim.length.toString() },
      });
      handleChange({
        target: { name: "plotBreadth", value: selectedDim.breadth.toString() },
      });
    } else {
      // user selected blank option => clear derivative fields
      handleChange({ target: { name: "PropertySize", value: "" } });
      handleChange({ target: { name: "perSqftPropertyPrice", value: "" } });
      handleChange({ target: { name: "plotLength", value: "" } });
      handleChange({ target: { name: "plotBreadth", value: "" } });
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
            value={formData?.projectName || ""}
            onChange={handleProjectSelect}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Select project</option>
            {projectOptions.map((proj, index) => (
              <option
                key={proj._id || `${proj.projectName}-${index}`}
                value={proj.projectName}
              >
                {proj.projectName}
              </option>
            ))}
          </select>
          {formErrors.projectName && (
            <p className="text-red-600 text-sm">{formErrors.projectName}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Dimension</label>
          <select
            value={selectedDimId || ""}
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
          {formErrors.PropertySize && (
            <p className="text-red-600 text-sm">{formErrors.PropertySize}</p>
          )}
        </div>

        <input
          type="hidden"
          name="plotLength"
          value={formData?.plotLength || ""}
        />
        <input
          type="hidden"
          name="plotBreadth"
          value={formData?.plotBreadth || ""}
        />

        <div>
          <label className="block font-medium mb-1">
            Per Sqft Property Price
          </label>
          <input
            type="number"
            min={0}
            name="perSqftPropertyPrice"
            placeholder="Per Sqft Property Price"
            value={formData?.perSqftPropertyPrice || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.perSqftPropertyPrice && (
            <p className="text-red-600 text-sm">
              {formErrors.perSqftPropertyPrice}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Selected Property Cost
          </label>
          <input
            type="text"
            name="selectedPropertyCost"
            placeholder="Selected Property Cost"
            value={formData?.selectedPropertyCost || ""}
            readOnly
            className="w-full border px-4 py-2 rounded-md bg-gray-100"
          />
          {formErrors.selectedPropertyCost && (
            <p className="text-red-600 text-sm">
              {formErrors.selectedPropertyCost}
            </p>
          )}
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
                  checked={parseInt(formData?.percentage) === percent}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "percentage", value: e.target.value },
                    })
                  }
                />
                {percent}%
              </label>
            ))}
          </div>
          {formErrors.percentage && (
            <p className="text-red-600 text-sm">{formErrors.percentage}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Selected Percentage Cost
          </label>
          <input
            type="text"
            name="percentageCost"
            value={formData?.percentageCost || ""}
            readOnly
            className="w-full border px-4 py-2 rounded-md bg-gray-100"
          />
          {formErrors.percentageCost && (
            <p className="text-red-600 text-sm">{formErrors.percentageCost}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProppertyDetails;
