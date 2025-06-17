import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/interceptors";

function SeniorityDetails({ handleChange, formData, formErrors }) {
  console.log("Rendering SeniorityDetails with formData:", formData);

  const [duplicateFields, setDuplicateFields] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [hasInteracted, setHasInteracted] = useState(false);

  const [originalValues, setOriginalValues] = useState({
    seniorityId: "",
    membershipNo: "",
    cunfirmationLetterNo: "",
    shareCertificateNo: ""
  });

  // Map frontend field names to backend response keys
  const fieldKeyMap = {
    seniorityId: "SeniorityID",
    membershipNo: "MembershipNo",
    cunfirmationLetterNo: "ConfirmationLetterNo",
    shareCertificateNo: "ShareCertificateNumber",
  };

    useEffect(() => {
    if (formData?.memberId) { // Check if editing an existing member
      setOriginalValues({
        seniorityId: formData.seniorityId || "",
        membershipNo: formData.membershipNo || "",
        cunfirmationLetterNo: formData.cunfirmationLetterNo || "",
        shareCertificateNo: formData.shareCertificateNo || ""
      });
    }
  }, [formData?.memberId]);

  // Track when fields are touched or changed
  const handleFieldInteraction = (field) => {
    if (!hasInteracted) setHasInteracted(true);
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

useEffect(() => {
  if (!hasInteracted) return;

  const fieldsToCheck = {};
  const fieldsToSkip = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (value && touchedFields[key]) {
      // Case-sensitive comparison with original values
      if (originalValues[key] === value) {
        fieldsToSkip[key] = true;
        setDuplicateFields(prev => ({ ...prev, [fieldKeyMap[key]]: false }));
      } else {
        fieldsToCheck[fieldKeyMap[key]] = value; // Send raw value (case-sensitive)
      }
    }
  });

  if (Object.keys(fieldsToCheck).length > 0) {
    axiosInstance
      .get("/member/check-duplicates", {
        params: {
          ...fieldsToCheck,
          caseSensitive: true // Explicitly tell backend to enforce case-sensitivity
        }
      })
      .then((res) => {
        setDuplicateFields(res.fields || {});
      })
      .catch((err) => console.error("Error checking duplicates:", err));
  }
}, [formData, touchedFields, hasInteracted, originalValues]);

  const isDuplicate = (field) => {
    // Not a duplicate if value matches original (when editing)
    if (formData[field] && originalValues[field] === formData[field]) {
      return false;
    }
    return (
      formData[field] &&
      touchedFields[field] &&
      duplicateFields[fieldKeyMap[field]]
    );
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
            value={formData?.seniorityId || ""}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction("seniorityId");
            }}
            onBlur={() => handleFieldInteraction("seniorityId")}
            className={`w-full border px-4 py-2 rounded-md ${
              isDuplicate("seniorityId") ? "border-red-500" : ""
            }`}
          />
          {isDuplicate("seniorityId") && (
            <p className="text-red-600 text-sm">
              This Seniority ID is already used.
            </p>
          )}
        </div>

        {/* Membership No */}
        <div>
          <label className="block font-medium mb-1">Membership No</label>
          <input
            type="number"
            name="membershipNo"
            placeholder="Membership No"
            value={formData?.membershipNo || ""}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction("membershipNo");
            }}
            onBlur={() => handleFieldInteraction("membershipNo")}
            className={`w-full border px-4 py-2 rounded-md ${
              isDuplicate("membershipNo") ? "border-red-500" : ""
            }`}
          />
          {isDuplicate("membershipNo") && (
            <p className="text-red-600 text-sm">
              This Membership No is already used.
            </p>
          )}
        </div>

        {/* Confirmation Letter No */}
        <div>
          <label className="block font-medium mb-1">
            Confirmation Letter No
          </label>
          <input
            type="number"
            name="cunfirmationLetterNo"
            placeholder="Confirmation Letter No"
            value={formData?.cunfirmationLetterNo || ""}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction("cunfirmationLetterNo");
            }}
            onBlur={() => handleFieldInteraction("cunfirmationLetterNo")}
            className={`w-full border px-4 py-2 rounded-md ${
              isDuplicate("cunfirmationLetterNo") ? "border-red-500" : ""
            }`}
          />
          {isDuplicate("cunfirmationLetterNo") && (
            <p className="text-red-600 text-sm">
              This Confirmation Letter No is already used.
            </p>
          )}
        </div>

        {/* Share Certificate Number */}
        <div>
          <label className="block font-medium mb-1">
            Share Certificate Number
          </label>
          <input
            type="number"
            name="shareCertificateNo"
            placeholder="Share Certificate Number"
            value={formData?.shareCertificateNo || ""}
            onChange={(e) => {
              handleChange(e);
              handleFieldInteraction("shareCertificateNo");
            }}
            onBlur={() => handleFieldInteraction("shareCertificateNo")}
            className={`w-full border px-4 py-2 rounded-md ${
              isDuplicate("shareCertificateNo") ? "border-red-500" : ""
            }`}
          />
          {isDuplicate("shareCertificateNo") && (
            <p className="text-red-600 text-sm">
              This Share Certificate Number is already used.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeniorityDetails;
