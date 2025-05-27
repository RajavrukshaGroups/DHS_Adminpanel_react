import React, { useState } from 'react';

const PlotCancellationForm = () => {
  const [formData, setFormData] = useState({
    seniorityId: '',
    name: '',
    email: '',
    mobileNumber: '',
    projectLoad: '',
    propertySize: '',
    cancellationDate: '',
    reason: '',
    transactionId: '',
    cancellationLetter: null,
  });


const handleFetchMember = async () => {
  if (!selectedId) {
    alert("Please enter a Seniority ID.");
    return;
  }

  try {
    const response = await axiosInstance.get(`/plot/getMemberBySeniorityID/${selectedId}`);
    console.log(response,'new responseeeeeeeeeeeeee')
    setMemberData(response);
  } catch (error) {
    console.error("Error fetching member:", error);
    alert("Member not found or error occurred.");
    setMemberData(null);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData(prev => ({
      ...prev,
      cancellationLetter: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div style={{}} className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-normal text-gray-800 mb-8">Plot Cancellation Form</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="seniorityId" className="block text-sm font-medium text-gray-700">
                Seniority ID
              </label>
              <input
                id="seniorityId"
                name="seniorityId"
                type="text"
                placeholder="Enter Seniority ID"
                value={formData.seniorityId}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email ID"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="projectLoad" className="block text-sm font-medium text-gray-700">
                Project Load
              </label>
              <input
                id="projectLoad"
                name="projectLoad"
                type="text"
                placeholder=""
                value={formData.projectLoad}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700">
                Property Size
              </label>
              <input
                id="propertySize"
                name="propertySize"
                type="text"
                placeholder="Enter the plot Size"
                value={formData.propertySize}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cancellationDate" className="block text-sm font-medium text-gray-700">
                Date of Cancellation Confirmed
              </label>
              <input
                id="cancellationDate"
                name="cancellationDate"
                type="date"
                value={formData.cancellationDate}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason For Cancellation
              </label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Enter the Reason For Cancellation"
                value={formData.reason}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                Cheque Number /Transaction ID /DD Number
              </label>
              <input
                id="transactionId"
                name="transactionId"
                type="text"
                placeholder="Enter Transaction ID"
                value={formData.transactionId}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cancellationLetter" className="block text-sm font-medium text-gray-700">
                Upload Cancellation Letter
              </label>
              <input
                id="cancellationLetter"
                name="cancellationLetter"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlotCancellationForm;