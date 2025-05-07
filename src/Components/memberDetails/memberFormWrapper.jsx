import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails';
import ReferenceDetails from './ReferenceDetails';
import NomineePerticular from './nomineePerticular';
import SeniorityDetails from './seniorityDetails';
import MemberShipDetails from './memberShipDetails';
import PaymentDetails from './paymentDetails';
import axiosInstance from "../../api/interceptors.js";
import axios from 'axios';
import ProppertyDetails from './proppertyDetails.jsx';

// import other components similarly

const MemberFormWrapper = () => {
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    mobile: '',
    altMobile: '',
    email: '',
    dob: '',
    fatherSpouse: '',
    correspondenceAddress: '',
    permanentAddress: '',
    workingAddress: '',
    refencName: '',
    rankDesignation: '',
    ServiceId: '',
    relationship: '',
    // include fields for other components as well
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
  console.log('Form Data:', formData);

  try {
    const res = await axiosInstance.post("http://localhost:3000/member/add-member", formData);
    console.log('Response:', res.data);
    // Add success handling logic here, e.g., showing a success message
  } catch (error) {
    console.error('Error submitting form:', error);
    // Add error handling logic here, e.g., showing an error message
  }
};
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "oklch(0.92 0.04 252.1)" }}>
    <div className="p-6 max-w-5xl w-full mx-auto">
      <form onSubmit={handleSubmit}>
        <ReferenceDetails formData={formData} handleChange={handleChange} />
        <PersonalDetails formData={formData} handleChange={handleChange} />
        <NomineePerticular formData={formData} handleChange={handleChange} />
        <SeniorityDetails formData={formData} handleChange={handleChange} />
        <MemberShipDetails formData={formData} handleChange={handleChange} />
        <PaymentDetails formData={formData} handleChange={handleChange} />
        <ProppertyDetails formData={formData} handleChange={handleChange} />
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default MemberFormWrapper;
