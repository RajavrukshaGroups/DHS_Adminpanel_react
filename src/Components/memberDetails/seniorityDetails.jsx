import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/interceptors';

function SeniorityDetails({ handleChange, formData, formErrors }) {
  const [duplicateFields, setDuplicateFields] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Map frontend field names to backend response keys
  const fieldKeyMap = {
    seniorityId: 'SeniorityID',
    membershipNo: 'MembershipNo',
    cunfirmationLetterNo: 'ConfirmationLetterNo',
    shareCertificateNo: 'ShareCertificateNumber'
  };

  // Track when fields are touched or changed
  const handleFieldInteraction = (field) => {
    if (!hasInteracted) setHasInteracted(true);
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    if (!hasInteracted) return; // Don't check on initial render

    const fieldsToCheck = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value && touchedFields[key]) {
        fieldsToCheck[fieldKeyMap[key]] = value;
      }
    });

    if (Object.keys(fieldsToCheck).length > 0) {
      axiosInstance
        .get('/member/check-duplicates', {
          params: fieldsToCheck
        })
        .then((res) => {
          setDuplicateFields(res.fields || {});
        })
        .catch((err) => console.error('Error checking duplicates:', err));
    }
  }, [formData, touchedFields, hasInteracted]);

  const isDuplicate = (field) => {
    return formData[field] && touchedFields[field] && duplicateFields[fieldKeyMap[field]];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Seniority ID */}
        <div>
          <label className="block font-medium mb-1">Seniority ID</label>
          <input
            type="text"
            name="seniorityId"
            placeholder="Seniority ID"
            value={formData?.seniorityId || ''}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction('seniorityId');
            }}
            onBlur={() => handleFieldInteraction('seniorityId')}
            className={`w-full border px-4 py-2 rounded-md ${isDuplicate("seniorityId") ? 'border-red-500' : ''}`}
          />
          {isDuplicate("seniorityId") && (
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
            value={formData?.membershipNo || ''}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction('membershipNo');
            }}
            onBlur={() => handleFieldInteraction('membershipNo')}
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
            value={formData?.cunfirmationLetterNo || ''}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction('cunfirmationLetterNo');
            }}
            onBlur={() => handleFieldInteraction('cunfirmationLetterNo')}
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
            value={formData?.shareCertificateNo || ''}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction('shareCertificateNo');
            }}
            onBlur={() => handleFieldInteraction('shareCertificateNo')}
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

// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/interceptors';

// function SeniorityDetails({ handleChange, formData, formErrors }) {
//   const [duplicateFields, setDuplicateFields] = useState({});
//   const [touchedFields, setTouchedFields] = useState({});
  
//   // Map frontend field names to backend response keys
//   const fieldKeyMap = {
//     seniorityId: 'SeniorityID',
//     membershipNo: 'MembershipNo',
//     cunfirmationLetterNo: 'ConfirmationLetterNo',
//     shareCertificateNo: 'ShareCertificateNumber'
//   };

//   // Track when fields are touched (focused then blurred)
//   const handleBlur = (field) => {
//     setTouchedFields(prev => ({ ...prev, [field]: true }));
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       // Only check fields that have values and have been touched
//       const fieldsToCheck = {};
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value && touchedFields[key]) {
//           fieldsToCheck[fieldKeyMap[key]] = value;
//         }
//       });

//       if (Object.keys(fieldsToCheck).length > 0) {
//         console.log('Checking for duplicates...', fieldsToCheck);
//         axiosInstance
//           .get('/member/check-duplicates', {
//             params: fieldsToCheck
//           })
//           .then((res) => {
//             console.log("Duplicate fields response:", res);
//             setDuplicateFields(res.fields || {});
//           })
//           .catch((err) => console.error('Error checking duplicates:', err));
//       }
//     }, 200);

//     return () => clearTimeout(delay);
//   }, [formData, touchedFields]);

//   const isDuplicate = (field) => {
//     // Only show duplicate error if field has value and has been touched
//     return formData[field] && touchedFields[field] && duplicateFields[fieldKeyMap[field]];
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-6">
//       <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {/* Seniority ID */}
//         <div>
//           <label className="block font-medium mb-1">Seniority ID</label>
//           <input
//             type="text"
//             name="seniorityId"
//             placeholder="Seniority ID"
//             value={formData?.seniorityId || ''}
//             onChange={handleChange}
//             onBlur={() => handleBlur('seniorityId')}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("seniorityId") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("seniorityId") && (
//             <p className="text-red-600 text-sm">This Seniority ID is already used.</p>
//           )}
//         </div>

//         {/* Membership No */}
//         <div>
//           <label className="block font-medium mb-1">Membership No</label>
//           <input
//             type="number"
//             name="membershipNo"
//             placeholder="Membership No"
//             value={formData?.membershipNo || ''}
//             onChange={handleChange}
//             onBlur={() => handleBlur('membershipNo')}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("membershipNo") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("membershipNo") && (
//             <p className="text-red-600 text-sm">This Membership No is already used.</p>
//           )}
//         </div>

//         {/* Confirmation Letter No */}
//         <div>
//           <label className="block font-medium mb-1">Confirmation Letter No</label>
//           <input
//             type="number"
//             name="cunfirmationLetterNo"
//             placeholder="Confirmation Letter No"
//             value={formData?.cunfirmationLetterNo || ''}
//             onChange={handleChange}
//             onBlur={() => handleBlur('cunfirmationLetterNo')}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("cunfirmationLetterNo") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("cunfirmationLetterNo") && (
//             <p className="text-red-600 text-sm">This Confirmation Letter No is already used.</p>
//           )}
//         </div>

//         {/* Share Certificate Number */}
//         <div>
//           <label className="block font-medium mb-1">Share Certificate Number</label>
//           <input
//             type="number"
//             name="shareCertificateNo"
//             placeholder="Share Certificate Number"
//             value={formData?.shareCertificateNo || ''}
//             onChange={handleChange}
//             onBlur={() => handleBlur('shareCertificateNo')}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("shareCertificateNo") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("shareCertificateNo") && (
//             <p className="text-red-600 text-sm">This Share Certificate Number is already used.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SeniorityDetails;

// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/interceptors';

// function SeniorityDetails({ handleChange, formData, formErrors }) {
//   const [duplicateFields, setDuplicateFields] = useState({});
//   // Map frontend field names to backend response keys
//   const fieldKeyMap = {
//     seniorityId: 'SeniorityID',
//     membershipNo: 'MembershipNo',
//     cunfirmationLetterNo: 'ConfirmationLetterNo',
//     shareCertificateNo: 'ShareCertificateNumber'
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       const { seniorityId, membershipNo, cunfirmationLetterNo, shareCertificateNo } = formData;
//       if (seniorityId || membershipNo || cunfirmationLetterNo || shareCertificateNo) {
        
//         console.log('Checking for duplicates...');
//         axiosInstance
//           .get('/member/check-duplicates', {
//             params: {
//               SeniorityID:seniorityId,
//               MembershipNo: membershipNo,
//               ConfirmationLetterNo: cunfirmationLetterNo,
//               ShareCertificateNumber: shareCertificateNo
//             }
//           })
//           .then((res) => {
//             console.log("Duplicate fields response:", res);
//             setDuplicateFields(res.fields || {});
//           })
//           .catch((err) => console.error('Error checking duplicates:', err));
//       }
//     }, 500);

//     return () => clearTimeout(delay);
//   }, [formData]);

//   const isDuplicate = (field) => duplicateFields[fieldKeyMap[field]];

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-6">
//       <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {/* Seniority ID */}
//         <div>
//           <label className="block font-medium mb-1">Seniority ID</label>
//           <input
//             type="text"
//             name="seniorityId"
//             placeholder="Seniority ID"
//             value={formData?.seniorityId}
//             onChange={handleChange}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("seniorityId") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("seniorityId") && (
//             <p className="text-red-600 text-sm">This Seniority ID is already used.</p>
//           )}
//         </div>

//         {/* Membership No */}
//         <div>
//           <label className="block font-medium mb-1">Membership No</label>
//           <input
//             type="number"
//             name="membershipNo"
//             placeholder="Membership No"
//             value={formData?.membershipNo}
//             onChange={handleChange}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("membershipNo") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("membershipNo") && (
//             <p className="text-red-600 text-sm">This Membership No is already used.</p>
//           )}
//         </div>

//         {/* Confirmation Letter No */}
//         <div>
//           <label className="block font-medium mb-1">Confirmation Letter No</label>
//           <input
//             type="number"
//             name="cunfirmationLetterNo"
//             placeholder="Confirmation Letter No"
//             value={formData?.cunfirmationLetterNo}
//             onChange={handleChange}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("cunfirmationLetterNo") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("cunfirmationLetterNo") && (
//             <p className="text-red-600 text-sm">This Confirmation Letter No is already used.</p>
//           )}
//         </div>

//         {/* Share Certificate Number */}
//         <div>
//           <label className="block font-medium mb-1">Share Certificate Number</label>
//           <input
//             type="number"
//             name="shareCertificateNo"
//             placeholder="Share Certificate Number"
//             value={formData?.shareCertificateNo}
//             onChange={handleChange}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("shareCertificateNo") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("shareCertificateNo") && (
//             <p className="text-red-600 text-sm">This Share Certificate Number is already used.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SeniorityDetails;

