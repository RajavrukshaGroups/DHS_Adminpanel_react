import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails';
import ReferenceDetails from './ReferenceDetails';
import NomineePerticular from './nomineePerticular';
import SeniorityDetails from './seniorityDetails';
import MemberShipDetails from './memberShipDetails';
import PaymentDetails from './paymentDetails';
import ProppertyDetails from './proppertyDetails.jsx';
import axiosInstance from '../../api/interceptors';

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
  });

  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberSign, setMemberSign] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'memberPhoto') setMemberPhoto(files[0]);
    if (name === 'memberSign') setMemberSign(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append text fields
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // Append files
    if (memberPhoto) data.append('memberPhoto', memberPhoto);
    if (memberSign) data.append('memberSign', memberSign);

    try {
      const res = await axiosInstance.post('http://localhost:3000/member/add-member', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Success:', res.data);
      // Show toast or redirect
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'oklch(0.92 0.04 252.1)' }}>
      <div className="p-6 max-w-5xl w-full mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Form Sections */}
          <ReferenceDetails formData={formData} handleChange={handleChange} />
          <ProppertyDetails formData={formData} handleChange={handleChange} />
          <PersonalDetails formData={formData} handleChange={handleChange}  />
          <NomineePerticular formData={formData} handleChange={handleChange} />
          <SeniorityDetails formData={formData} handleChange={handleChange} />
          <MemberShipDetails formData={formData} handleChange={handleChange} />
          <PaymentDetails formData={formData} handleChange={handleChange} />

          {/* Image Uploads */}
          <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Member Photo
              </label>
              <input
                type="file"
                name="memberPhoto"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Member Signature
              </label>
              <input
                type="file"
                name="memberSign"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Submit
              </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default MemberFormWrapper;
