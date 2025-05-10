import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/interceptors';

function SeniorityDetails({ handleChange, formData, formErrors }) {
  const [duplicateFields, setDuplicateFields] = useState({});

  // Map frontend field names to backend response keys
  const fieldKeyMap = {
    SeniorityID: 'SeniorityID',
    membershipNo: 'MembershipNo',
    cunfirmationLetterNo: 'ConfirmationLetterNo',
    shareCertificateNo: 'ShareCertificateNumber'
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      const { SeniorityID, membershipNo, cunfirmationLetterNo, shareCertificateNo } = formData;

      if (SeniorityID || membershipNo || cunfirmationLetterNo || shareCertificateNo) {
        console.log('Checking for duplicates...');

        axiosInstance
          .get('/member/check-duplicates', {
            params: {
              SeniorityID,
              MembershipNo: membershipNo,
              ConfirmationLetterNo: cunfirmationLetterNo,
              ShareCertificateNumber: shareCertificateNo
            }
          })
          .then((res) => {
            console.log("Duplicate fields response:", res);
            setDuplicateFields(res.fields || {});
          })
          .catch((err) => console.error('Error checking duplicates:', err));
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [formData]);

  const isDuplicate = (field) => duplicateFields[fieldKeyMap[field]];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Seniority ID */}
        <div>
          <label className="block font-medium mb-1">Seniority ID</label>
          <input
            type="text"
            name="SeniorityID"
            placeholder="Seniority ID"
            value={formData.SeniorityID}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded-md ${isDuplicate("SeniorityID") ? 'border-red-500' : ''}`}
          />
          {isDuplicate("SeniorityID") && (
            <p className="text-red-600 text-sm">This Seniority ID is already used.</p>
          )}
        </div>

        {/* Membership No */}
        <div>
          <label className="block font-medium mb-1">Membership No</label>
          <input
            type="number"
            name="membershipNo"
            placeholder="Membership No"
            value={formData.membershipNo}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded-md ${isDuplicate("membershipNo") ? 'border-red-500' : ''}`}
          />
          {isDuplicate("membershipNo") && (
            <p className="text-red-600 text-sm">This Membership No is already used.</p>
          )}
        </div>

        {/* Confirmation Letter No */}
        <div>
          <label className="block font-medium mb-1">Confirmation Letter No</label>
          <input
            type="number"
            name="cunfirmationLetterNo"
            placeholder="Confirmation Letter No"
            value={formData.cunfirmationLetterNo}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded-md ${isDuplicate("cunfirmationLetterNo") ? 'border-red-500' : ''}`}
          />
          {isDuplicate("cunfirmationLetterNo") && (
            <p className="text-red-600 text-sm">This Confirmation Letter No is already used.</p>
          )}
        </div>

        {/* Share Certificate Number */}
        <div>
          <label className="block font-medium mb-1">Share Certificate Number</label>
          <input
            type="number"
            name="shareCertificateNo"
            placeholder="Share Certificate Number"
            value={formData.shareCertificateNo}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded-md ${isDuplicate("shareCertificateNo") ? 'border-red-500' : ''}`}
          />
          {isDuplicate("shareCertificateNo") && (
            <p className="text-red-600 text-sm">This Share Certificate Number is already used.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeniorityDetails;

