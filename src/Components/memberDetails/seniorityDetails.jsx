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


// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/interceptors';

// function SeniorityDetails({ handleChange, formData, formErrors }) {
//   const [duplicateFields, setDuplicateFields] = useState({});

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       const { SeniorityID, membershipNo, cunfirmationLetterNo, shareCertificateNo } = formData;
      
//       if (SeniorityID || membershipNo || cunfirmationLetterNo || shareCertificateNo) {
//         console.log('Checking for duplicates...');
        
//           axiosInstance.get('/member/check-duplicates', {
//           params: {
//             SeniorityID: formData.SeniorityID,
//             MembershipNo: formData.membershipNo,
//             ConfirmationLetterNo: formData.cunfirmationLetterNo,
//             ShareCertificateNumber: formData.shareCertificateNo
//           }
//         }).then(res => {
//           setDuplicateFields(res.data.fields || {});
//         }).catch(err => console.error('Error checking duplicates:', err));
//       }
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [formData]);

//   const isDuplicate = (field) => duplicateFields[field];

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-6">
//       <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
//         {/* Seniority ID */}
//         <div>
//           <label className="block font-medium mb-1">Seniority ID</label>
//           <input
//             type="text"
//             name="SeniorityID"
//             value={formData.SeniorityID}
//             onChange={handleChange}
//             className={`w-full border px-4 py-2 rounded-md ${isDuplicate("SeniorityID") ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate("SeniorityID") && (
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
//             value={formData.membershipNo}
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
//             value={formData.cunfirmationLetterNo}
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
//             value={formData.shareCertificateNo}
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


// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/interceptors';

// function SeniorityDetails({ handleChange, formData, formErrors }) {
//   const [seniorityID, setSeniorityID] = useState('');
//   const [isDuplicate, setIsDuplicate] = useState(false);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (seniorityID.trim()) {
//         axiosInstance
//           .get(`/member/check-seniority/${seniorityID}`)
//           .then((res) => setIsDuplicate(res.data.exists))
//           .catch((err) => console.error('Error checking seniority ID:', err));
//       }
//     }, 500);
//     return () => clearTimeout(delayDebounceFn);
//   }, [seniorityID]);


//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-6">
//       <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Seniority ID */}
//         <div>
//           <label className="block font-medium mb-1">Seniority ID</label>
//           <input
//             type="text"
//             id="seniorityID"
//             value={seniorityID}
//             onChange={(e) => setSeniorityID(e.target.value)}
//             className={`form-control ${isDuplicate ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate && (
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
//             value={formData.membershipNo}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-md"
//           />
//           {formErrors.membershipNo && <p className="text-red-600 text-sm">{formErrors.membershipNo}</p>}
//         </div>

//         {/* Confirmation Letter No */}
//         <div>
//           <label className="block font-medium mb-1">Confirmation Letter No</label>
//           <input
//             type="number"
//             name="cunfirmationLetterNo"
//             placeholder="Confirmation Letter No"
//             value={formData.cunfirmationLetterNo}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-md"
//           />
//           {formErrors.cunfirmationLetterNo && (
//             <p className="text-red-600 text-sm">{formErrors.cunfirmationLetterNo}</p>
//           )}
//         </div>

//         {/* Share Certificate Number */}
//         <div>
//           <label className="block font-medium mb-1">Share Certificate Number</label>
//           <input
//             type="number"
//             name="shareCertificateNo"
//             placeholder="Share Certificate Number"
//             value={formData.shareCertificateNo}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-md"
//           />
//           {formErrors.shareCertificateNo && (
//             <p className="text-red-600 text-sm">{formErrors.shareCertificateNo}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SeniorityDetails;


// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/interceptors'; 

// function SeniorityDetails({ formData, handleChange, formErrors, setFormData }) {
//   const [seniorityID, setSeniorityID] = useState('');
//   const [isDuplicate, setIsDuplicate] = useState(false);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (seniorityID.trim()) {
//         axiosInstance
//           .get(`/member/check-seniority/${seniorityID}`)
//           .then((res) => {
//             console.log("res.data.exists:", res.data.exists);
//             setIsDuplicate(res.data.exists);
//           })
//           .catch((err) => console.error('Error checking seniority ID:', err));
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [seniorityID]);


//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-6">
//       <h2 className="text-xl font-bold mb-4">Membership & Seniority Details</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* <div>
//           <label className="block font-medium mb-1">Seniority ID</label>
    
//           <input
//             type="text"
//             id="seniorityID"
//             value={seniorityID}
//             onChange={(e) => {
//               setSeniorityID(e.target.value);
//               setFormData({ ...formData, SeniorityID: e.target.value });
//             }}
//             className={`form-control ${isDuplicate ? 'border-red-500' : ''}`}
//           />
//           {isDuplicate && (
//             <p className="text-red-600 text-sm">This Seniority ID is already used.</p>
//           )}

//         </div> */}
// {/* 
//         <div>
//         <label className="block font-medium mb-1">Membership No</label>
//         <input
//         type="number"
//         name="membershipNo"
//         placeholder="Membership No"
//         value={formData.membershipNo}
//         onChange={handleChange}
//         className="w-full border px-4 py-2 rounded-md"
//         />
//         {formErrors.membershipNo && <p className="text-red-600 text-sm">{formErrors.membershipNo}</p>}
//         </div> */}
//         <div>
//                   <label className="block font-medium mb-1">Seniority ID</label>
//                   <input
//                     type="text"
//                     name="SeniorityID"
//                     value={seniorityID}
//                     onChange={(e) => {
//                       setSeniorityID(e.target.value);
//                       setFormData((prev) => ({ ...prev, SeniorityID: e.target.value }));
//                     }}
//                     className={`w-full border px-4 py-2 rounded-md ${
//                       isDuplicate ? 'border-red-500' : ''
//                     }`}
//                   />
//                   {isDuplicate && (
//                     <p className="text-red-600 text-sm">This Seniority ID is already used.</p>
//                   )}
//                 </div>

//       <div>
//           <label className="block font-medium mb-1">Membership No</label>
//           <input
//             type="number"
//             name="membershipNo"
//             placeholder="Membership No"
//             value={formData.membershipNo}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-md"
//           />
//           {formErrors.membershipNo && <p className="text-red-600 text-sm">{formErrors.membershipNo}</p>}
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Confirmation Letter No</label>
//           <input
//             type="number"
//             name="cunfirmationLetterNo"
//             placeholder="Confirmation Letter No"
//             value={formData.cunfirmationLetterNo}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-md"
//           />
//           {formErrors.cunfirmationLetterNo && <p className="text-red-600 text-sm">{formErrors.cunfirmationLetterNo}</p>}
//         </div>
//         <div>
//           <label className="block font-medium mb-1">Share Certificate Number</label>
//           <input
//             type="number"
//             name="shareCertificateNo"
//             placeholder="Share Certificate Number"
//             value={formData.shareCertificateNo}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-md"
//           />
//           {formErrors.shareCertificateNo && <p className="text-red-600 text-sm">{formErrors.shareCertificateNo}</p>}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SeniorityDetails

