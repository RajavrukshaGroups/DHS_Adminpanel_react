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
            placeholder="Salutation"
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
            placeholder="Name"
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
            placeholder="Mobile"
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
            placeholder="Alternative Mobile"
            value={formData.altMobile}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email id</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            placeholder="Date of Birth"
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
            placeholder="Father/Spouse Name"
            value={formData.fatherSpouse}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Correspondence Address</label>
          <textarea
            name="correspondenceAddress"
            placeholder="Correspondence Address"
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
            placeholder="Permanent Address"
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
            placeholder="Working Address"
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
            placeholder="Member Photo"
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
            placeholder="Member Sign"
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
