import React from "react";

const PersonalDetails = ({ formData, handleChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Salutation</label>
          <input
            type="text"
            name="salutation"
            value={formData.salutation}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Alternative Mobile</label>
          <input
            type="text"
            name="altMobile"
            value={formData.altMobile}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Father/Spouse Name</label>
          <input
            type="text"
            name="fatherSpouse"
            value={formData.fatherSpouse}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Correspondence Address</label>
          <textarea
            name="correspondenceAddress"
            value={formData.correspondenceAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Permanent Address</label>
          <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Working Address</label>
          <textarea
            name="workingAddress"
            value={formData.workingAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Member Photo</label>
          <input
            type="file"
            name="memberPhoto"
            value={formData.memberPhoto}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Member Sign</label>
          <input
          type="file"
            name="memberSign"
            value={formData.memberSign}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
