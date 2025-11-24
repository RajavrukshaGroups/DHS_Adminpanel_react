import React, { useState, useRef } from "react";
import PersonalDetails from "./personalDetails.jsx";
import ReferenceDetails from "./referenceDetails.jsx";
import NomineePerticular from "./nomineePerticular";
import SeniorityDetails from "./seniorityDetails";
import MemberShipDetails from "./memberShipDetails";
import PaymentDetails from "./paymentDetails";
import ProppertyDetails from "./proppertyDetails.jsx";
import axiosInstance from "../../api/interceptors";
import { FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Spinner from "../common/Spinner.jsx";

const MemberFormWrapper = () => {
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const location = useLocation();
  const isFromApplication = location.pathname.includes("from-application");
  const [formData, setFormData] = useState({
    salutation: "",
    name: "",
    mobile: "",
    altMobile: "",
    email: "",
    dob: "",
    fatherSpouse: "",
    correspondenceAddress: "",
    permanentAddress: "",
    workingAddress: "",
    refencName: "",
    rankDesignation: "",
    ServiceId: "",
    relationship: "",
    projectName: "",
    PropertySize: "",
    perSqftPropertyPrice: "",
    selectedPropertyCost: "",
    percentage: "",
    percentageCost: "",
    plotLength: "",
    plotBreadth: "",
    // Nominee Particulars
    nomineeName: "",
    nomineeAge: "",
    nomineeRelationship: "",
    nomineeAddress: "",
    // Add these for SeniorityDetails
    seniorityId: "",
    membershipNo: "",
    cunfirmationLetterNo: "", // Consider correcting spelling if possible
    shareCertificateNo: "",

    // Membership Details
    recieptNo: "",
    date: "",
    numberOfShares: "2",

    shareFee: "2000",
    memberShipFee: "100",
    applicationFee: "200",
    adminissionFee: "100",
    miscellaneousExpenses: "100",

    // Payment Details
    paymentType: "Membership Fee",
    paymentMode: "",
    bankName: "",
    branchName: "",
    amount: "2500",
    checqueNumber: "",
    transactionId: "",
    ddNumber: "",
    memberId: "",
    onlineApplicationId: "",
  });

  const navigate = useNavigate();
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberSign, setMemberSign] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null); // Add this
  const [existingSign, setExistingSign] = useState(null); // Add this
  const [loading, setLoading] = useState(false);

  const photoInputRef = useRef(null);
  const signInputRef = useRef(null);

  useEffect(() => {
    if (id && isFromApplication) {
      // From online application
      axiosInstance
        .get(`/defenceWebsiteRoutes/get-application/${id}`)
        .then((res) => {
          console.log(res, "fething online application datas");
          const fetched = res;
          setFormData((prev) => ({
            ...prev,
            name: fetched.name || "",
            mobile: fetched.mobileNumber || "",
            altMobile: "", // No alt mobile in application
            email: fetched.email || "",
            dob: fetched.dateofbirth || "",
            fatherSpouse: fetched.fatherName || "",
            correspondenceAddress: fetched.contactAddress || "",
            permanentAddress: fetched.permanentAddress || "",
            workingAddress: fetched.workingAddress || "",
            // Reference
            refencName: fetched.refname || "",
            rankDesignation: fetched.rankDesignation || "",
            ServiceId: fetched.serviceId || "",
            relationship: fetched.relationship || "",
            // Property
            projectName: fetched.propertyDetails?.projectName || "",
            PropertySize: fetched.propertyDetails?.propertySize || "",
            perSqftPropertyPrice: fetched.propertyDetails?.pricePerSqft || "",
            selectedPropertyCost: fetched.propertyDetails?.propertyCost || "",
            percentage: fetched.propertyDetails?.percentage || "",
            percentageCost: fetched.propertyDetails?.percentageCost || "",
            plotLength: fetched.propertyDetails?.length || "",
            plotBreadth: fetched.propertyDetails?.breadth || "",
            // Nominee
            nomineeName: fetched.nomineeName || "",
            nomineeAge: fetched.nomineeAge || "",
            nomineeRelationship: fetched.nomineeRelation || "",
            nomineeAddress: fetched.nomineeAddress || "",
            // Membership fields stay default unless needed
            date: fetched.date || "",
            onlineApplicationId: fetched._id || "",
          }));
        })
        .catch((err) => {
          console.error("Failed to fetch application", err);
        });
    } else if (id && !isFromApplication) {
      // Editing existing member
      axiosInstance
        .get(`/member/get-member/${id}`)
        .then((res) => {
          const fetched = res;
          console.log(fetched, "incoming dataaaassssss");
          setFormData((prev) => ({
            ...prev,
            salutation: fetched.member.saluation || "",
            name: fetched.member.name || "",
            mobile: fetched.member.mobileNumber || "",
            altMobile: fetched.member.AlternativeNumber || "",
            email: fetched.member.email || "",
            dob: fetched.member.dateofbirth || "",
            fatherSpouse: fetched.member.fatherName || "",
            correspondenceAddress: fetched.member.contactAddress || "",
            permanentAddress: fetched.member.permanentAddress || "",
            workingAddress: fetched.member.workingAddress || "",
            // Reference
            refencName: fetched.member.refname || "",
            rankDesignation: fetched.member.rankDesignation || "",
            ServiceId: fetched.member.serviceId || "",
            relationship: fetched.member.relationship || "",

            // Property
            projectName: fetched.member.propertyDetails?.projectName || "",
            PropertySize: fetched.member.propertyDetails?.propertySize || "",
            perSqftPropertyPrice:
              fetched.member.propertyDetails?.pricePerSqft || "",
            percentage: fetched.member.propertyDetails?.percentage || "",
            percentageCost:
              fetched.member.propertyDetails?.percentageCost || "",
            plotLength: fetched.member.propertyDetails?.length || "",
            plotBreadth: fetched.member.propertyDetails?.breadth || "",

            // Nominee
            nomineeName: fetched.member.nomineeName || "",
            nomineeAge: fetched.member.nomineeAge || "",
            nomineeRelationship: fetched.member.nomineeRelation || "",
            nomineeAddress: fetched.member.nomineeAddress || "",

            // Membership Details
            seniorityId: fetched.member.SeniorityID || "",
            membershipNo: fetched.member.MembershipNo || "",
            cunfirmationLetterNo: fetched.member.ConfirmationLetterNo || "",
            shareCertificateNo: fetched.member.ShareCertificateNumber || "",
            // Receipt Details
            date: fetched.member.date || "",
            recieptNo: fetched.result.receiptNo,
            paymentMode: fetched.result.paymentMode,
            reciptInfo: fetched.result,
            memberId: fetched.member._id || "",
          }));
          if (fetched.member.MemberPhoto) {
            setExistingPhoto(fetched.member.MemberPhoto);
          }
          if (fetched.member.MemberSign) {
            setExistingSign(fetched.member.MemberSign);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch member", err);
        });
    }
  }, [id, isFromApplication]);

  useEffect(() => {
    const totalAmount =
      Number(formData.shareFee || 0) +
      Number(formData.memberShipFee || 0) +
      Number(formData.applicationFee || 0) +
      Number(formData.adminissionFee || 0) +
      Number(formData.miscellaneousExpenses || 0);

    setFormData((prevData) => ({
      ...prevData,
      amount: totalAmount.toString(),
    }));
  }, [
    formData.shareFee,
    formData.memberShipFee,
    formData.applicationFee,
    formData.adminissionFee,
    formData.miscellaneousExpenses,
  ]);

  const validatePersonalDetails = (data) => {
    const errors = {};
    if (!data.salutation.trim()) errors.salutation = "Salutation is required";
    if (!data.name.trim()) errors.name = "Name is required";
    if (!data.mobile) errors.mobile = "Mobile is required";
    else if (!/^[6-9]\d{9}$/.test(data.mobile))
      errors.mobile = "Invalid mobile number";
    if (data.altMobile && !/^[6-9]\d{9}$/.test(data.altMobile)) {
      errors.altMobile = "Invalid alternative mobile number";
    }
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Invalid email";
    if (!data.dob.trim()) errors.dob = "Date of Birth is required";
    if (!data.fatherSpouse.trim())
      errors.fatherSpouse = "Father/Spouse Name is required";
    if (!data.correspondenceAddress.trim())
      errors.correspondenceAddress = "Correspondence Address is required";
    if (!data.permanentAddress.trim())
      errors.permanentAddress = "Permanent Address is required";
    // if (!data.workingAddress.trim())
    //   errors.workingAddress = "Working Address is required";

    // if (!data.refencName.trim())
    //   errors.refencName = "Reference Name is required";
    // if (!data.rankDesignation.trim())
    //   errors.rankDesignation = "Rank / Designation is required";
    // if (!data.ServiceId.trim())
    //   errors.ServiceId = "Service / ID No is required";
    // if (!data.relationship.trim())
    //   errors.relationship = "Relationship is required";

    if (!data.projectName.trim())
      errors.projectName = "Project name is required";
    if (!data.PropertySize) errors.PropertySize = "Property size is required";
    if (!data.perSqftPropertyPrice)
      errors.perSqftPropertyPrice = "Price per sqft is required";
    if (!data.selectedPropertyCost)
      errors.selectedPropertyCost = "Total property cost is required";
    if (!data.percentage) errors.percentage = "Please select a percentage";
    if (!data.percentageCost)
      errors.percentageCost = "Percentage cost is required";
    if (!data.nomineeName.trim())
      errors.nomineeName = "Nominee Name is required";
    if (!data.nomineeAge || isNaN(data.nomineeAge))
      errors.nomineeAge = "Valid age is required";
    if (!data.nomineeRelationship.trim())
      errors.nomineeRelationship = "Relationship is required";
    if (!data.nomineeAddress.trim())
      errors.nomineeAddress = "Address is required";
    if (!data.seniorityId.trim())
      errors.seniorityId = "Seniority ID is required";
    if (!data.membershipNo.trim())
      errors.membershipNo = "Membership No is required";
    if (!data.cunfirmationLetterNo.trim())
      errors.cunfirmationLetterNo = "Confirmation Letter No is required";
    if (!data.shareCertificateNo.trim())
      errors.shareCertificateNo = "Share Certificate No is required";

    // Membership Details
    if (!data.recieptNo.trim()) errors.recieptNo = "Receipt No is required";
    if (!data.date.trim()) errors.date = "Date is required";
    if (
      !data.numberOfShares ||
      isNaN(data.numberOfShares) ||
      Number(data.noofShares) <= 0
    ) {
      errors.numberOfShares = "Valid number of shares is required";
    }
    if (!data.shareFee || isNaN(data.shareFee) || Number(data.shareFee) <= 0) {
      errors.shareFee = "Valid Share Fee is required";
    }
    if (
      !data.memberShipFee ||
      isNaN(data.memberShipFee) ||
      Number(data.memberShipFee) <= 0
    ) {
      errors.memberShipFee = "Valid Membership Fee is required";
    }
    if (
      !data.applicationFee ||
      isNaN(data.applicationFee) ||
      Number(data.applicationFee) <= 0
    ) {
      errors.applicationFee = "Valid Application Fee is required";
    }
    if (
      !data.adminissionFee ||
      isNaN(data.adminissionFee) ||
      Number(data.adminissionFee) <= 0
    ) {
      errors.adminissionFee = "Valid Admission Fee is required";
    }
    if (
      !data.miscellaneousExpenses ||
      isNaN(data.miscellaneousExpenses) ||
      Number(data.miscellaneousExpenses) < 0
    ) {
      errors.miscellaneousExpenses =
        "Valid Miscellaneous Expenses are required";
    }
    // Payment Details

    if (!formData?.paymentType.trim()) {
      errors.paymentType = "Payment type is required";
    }

    if (!formData?.paymentMode?.trim()) {
      errors.paymentMode = "Payment mode is required";
    }

    if (
      ["cheque", "online", "card"].includes(
        formData?.paymentMode?.toLowerCase()
      )
    ) {
      if (!formData.bankName.trim()) {
        errors.bankName = "Bank name is required for this payment mode";
      }

      if (!formData.branchName.trim()) {
        errors.branchName = "Branch name is required for this payment mode";
      }
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      errors.amount = "Valid amount is required";
    }
    // if (!memberPhoto && !existingPhoto) {
    //   errors.memberPhoto = "Member photo is required";
    // }
    // if (!memberSign && !existingSign) {
    //   errors.memberSign = "Member signature is required";
    // }

    return errors;
  };

  //   const renderPreview = (file, url) => {
  //   if (file) return URL.createObjectURL(file);
  //   if (url) return url;
  //   return '';
  // };

  const handleChange = (e) => {
    console.log(
      "e.target.name:",
      e.target.name,
      "e.target.value:",
      e.target.value
    );

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === "memberPhoto") {
        setMemberPhoto(files[0]);
        setExistingPhoto(null); // Clear existing photo when new one is selected
      }
      if (name === "memberSign") {
        setMemberSign(files[0]);
        setExistingSign(null); // Clear existing sign when new one is selected
      }
    }
  };
  // Helper function to render preview
  const renderPreview = (file, existingUrl) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    if (existingUrl) {
      return existingUrl;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate form data here and set errors if any
    const personalErrors = validatePersonalDetails(formData);

    if (Object.keys(personalErrors).length > 0) {
      setFormErrors(personalErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(false); // Stop loading on validation error
      return;
    }
    // setFormErrors(validationErrors);
    setFormErrors({}); // clear errors if passed

    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (memberPhoto) data.append("memberPhoto", memberPhoto);
    if (memberSign) data.append("memberSign", memberSign);
    try {
      if (id && !isFromApplication) {
        // ✅ Update Member
        await axiosInstance.put(`/member/update-member/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Member updated successfully!");
      } else {
        // ✅ Add Member (either fresh OR from application with id present)
        await axiosInstance.post("/member/add-member", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Member added successfully!");
      }
      navigate("/viewmemberdetails");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "oklch(0.92 0.04 252.1)" }}
    >
      {/* Show spinner when loading */}
      {loading && <Spinner />}

      <div className="p-6 max-w-5xl w-full mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Form Sections */}
          <ReferenceDetails
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
          <ProppertyDetails
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
          <PersonalDetails
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
          <NomineePerticular
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
          <SeniorityDetails
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
          <MemberShipDetails
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />
          <PaymentDetails
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Member Photo */}
            <div className="w-full bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Photo
                {/* <span className="text-red-500">*</span> */}
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    name="memberPhoto"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                {(memberPhoto || existingPhoto) && (
                  <div className="relative">
                    <img
                      src={renderPreview(memberPhoto, existingPhoto)}
                      alt="Member Photo Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMemberPhoto(null);
                        setExistingPhoto(null);
                        if (photoInputRef.current)
                          photoInputRef.current.value = "";
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {formErrors.memberPhoto && (
                <p className="text-red-500 text-sm mt-2">
                  {formErrors.memberPhoto}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Upload a clear passport-size photo (Max 2MB)
              </p>
            </div>

            {/* Member Signature */}
            <div className="w-full bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Signature
                {/* <span className="text-red-500">*</span> */}
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    name="memberSign"
                    ref={signInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                {(memberSign || existingSign) && (
                  <div className="relative">
                    <img
                      src={renderPreview(memberSign, existingSign)}
                      alt="Member Signature Preview"
                      className="w-20 h-12 object-contain border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMemberSign(null);
                        setExistingSign(null);
                        if (signInputRef.current)
                          signInputRef.current.value = "";
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      aria-label="Remove signature"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {formErrors.memberSign && (
                <p className="text-red-500 text-sm mt-2">
                  {formErrors.memberSign}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Upload your signature (White background preferred)
              </p>
            </div>
          </div>

          <div className="flex justify-start mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </span>
              ) : id ? (
                "Update Member"
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormWrapper;
