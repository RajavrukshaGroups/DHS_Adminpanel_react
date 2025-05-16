import React from "react";
import { useState } from "react";

const PersonalDetails = ({ formData, handleChange, formErrors  }) => {

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Salutation</label>
          <input
            type="text"
            name="salutation"
            placeholder="Salutation"
            value={formData?.salutation}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            
          />
           {formErrors.salutation && (
            <p className="text-red-500 text-sm">{formErrors.salutation}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData?.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.name && ( <p className="text-red-500 text-sm">{formErrors.name}</p> )}
        </div>
        <div>
          <label className="block font-medium mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData?.mobile}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.mobile && ( <p className="text-red-500 text-sm">{formErrors.mobile}</p> )}

        </div>
        <div>
          <label className="block font-medium mb-1">Alternative Mobile</label>
          <input
            type="text"
            name="altMobile"
            placeholder="Alternative Mobile"
            value={formData?.altMobile}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.altMobile && ( <p className="text-red-500 text-sm">{formErrors.altMobile}</p> )}
        </div>
        <div>
          <label className="block font-medium mb-1">Email id</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData?.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.email && ( <p className="text-red-500 text-sm">{formErrors.email}</p> )}
        </div>
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData?.dob}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.dob && ( <p className="text-red-500 text-sm">{formErrors.dob}</p> )}
        </div>
        <div>
          <label className="block font-medium mb-1">Father/Spouse Name</label>
          <input
            type="text"
            name="fatherSpouse"
            placeholder="Father/Spouse Name"
            value={formData?.fatherSpouse}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.fatherSpouse && ( <p className="text-red-500 text-sm">{formErrors.fatherSpouse}</p> )}
        </div>
        <div>
          <label className="block font-medium mb-1">Correspondence Address</label>
          <textarea
            name="correspondenceAddress"
            placeholder="Correspondence Address"
            value={formData?.correspondenceAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
          {formErrors.correspondenceAddress && (
            <p className="text-red-500 text-sm">{formErrors.correspondenceAddress}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Permanent Address</label>
          <textarea
            name="permanentAddress"
            placeholder="Permanent Address"
            value={formData?.permanentAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
          {formErrors.permanentAddress && (
            <p className="text-red-500 text-sm">{formErrors.permanentAddress}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Working Address</label>
          <textarea
            name="workingAddress"
            placeholder="Working Address"
            value={formData?.workingAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            rows="2"
          />
          {formErrors.workingAddress && (
            <p className="text-red-500 text-sm">{formErrors.workingAddress}</p>
          )}
        </div>
        {/* <div>
          <label className="block font-medium mb-1">Member Photo</label>
          <input type="file" accept="image/*" name="memberPhoto" onChange={handleFileChange} />
          {photoPreview && <img src={photoPreview} alt="Preview" width="120" />}
        </div>


       <div>
          <label className="block font-medium mb-1">Member Sign</label>
          <input type="file" accept="image/*" name="memberSign" onChange={handleFileChange} />
          {signPreview && <img src={signPreview} alt="Preview" width="120" />}
        </div> */}


      </div>
    </div>
  );
};

export default PersonalDetails;
