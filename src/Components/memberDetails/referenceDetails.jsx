import React from "react";

const ReferenceDetails = ({ formData, handleChange,formErrors  }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Reference Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="refencName"
            placeholder="Reference Name"
            value={formData.refencName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.refencName && <p className="text-red-600 text-sm">{formErrors.refencName}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Rank / Designation</label>
          <input
            type="text"
            name="rankDesignation"
            placeholder="Rank / Designation"
            value={formData.rankDesignation}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.rankDesignation && <p className="text-red-600 text-sm">{formErrors.rankDesignation}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Service / ID No</label>
          <input
            type="text"
            name="ServiceId"
            placeholder="Service / ID No"
            value={formData.ServiceId}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.ServiceId && <p className="text-red-600 text-sm">{formErrors.ServiceId}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Relationship</label>
          <input
            type="text"
            name="relationship"
            placeholder="Relationship"
            value={formData.relationship}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.relationship && <p className="text-red-600 text-sm">{formErrors.relationship}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetails;
