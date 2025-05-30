import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails';
import ReferenceDetails from './ReferenceDetails';
import NomineePerticular from './nomineePerticular';
import SeniorityDetails from './seniorityDetails';
import MemberShipDetails from './memberShipDetails';
import PaymentDetails from './paymentDetails';
import ProppertyDetails from './proppertyDetails.jsx';
import axiosInstance from '../../api/interceptors';
import { FaSpinner } from 'react-icons/fa';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate,useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { useEffect } from 'react';
import { FaRegEye } from 'react-icons/fa';
// import axiosInstance from '../../api/interceptors';

const MemberFormWrapper = () => {
  
  const { id } = useParams(); // id comes from route like /edit-member/:id
  const [formErrors, setFormErrors] = useState({});
  console.log(id,"iddddddddddddddddddddd")
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
    projectName: '',
    PropertySize: '',
    perSqftPropertyPrice: '',
    selectedPropertyCost: '',
    percentage: '',
    percentageCost: '',
    plotLength: '',
    plotBreadth: '',
     // Nominee Particulars
  nomineeName: '',
  nomineeAge: '',
  nomineeRelationship: '',
  nomineeAddress: '',
   // Add these for SeniorityDetails
   seniorityId: '',
   membershipNo: '',
   cunfirmationLetterNo: '',  // Consider correcting spelling if possible
   shareCertificateNo: '',

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
  });
  
  const navigate = useNavigate();
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberSign, setMemberSign] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing member data for editing

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/member/get-member/${id}`)
        .then((res) => {
          const fetched = res;
  
          setFormData((prev) => ({
            ...prev,
            salutation: fetched.saluation || '', // typo in backend: "saluation"
            name: fetched.name || '',
            mobile: fetched.mobileNumber || '',
            altMobile: fetched.AlternativeNumber || '',
            email: fetched.email || '',
            dob: fetched.dateofbirth || '',
            fatherSpouse: fetched.fatherName || '',
            correspondenceAddress: fetched.contactAddress || '',
            permanentAddress: fetched.permanentAddress || '',
            workingAddress: fetched.workingAddress || '',
  
            // ✅ Reference Details mapping
            refencName: fetched.refname || '', // <-- FIXED
            rankDesignation: fetched.rankDesignation || '',
            ServiceId: fetched.serviceId || '',
            relationship: fetched.relationship || '',
  
            // ✅ Property Details mapping
            projectName: fetched.propertyDetails?.projectName || '',
            PropertySize: fetched.propertyDetails?.propertySize || '',
            perSqftPropertyPrice: fetched.propertyDetails?.pricePerSqft || '',
            // selectedPropertyCost: fetched.propertyDetails?.propertyCost || '',
            percentage: fetched.propertyDetails?.percentage || '',
            percentageCost: fetched.propertyDetails?.percentageCost || '',
            plotLength: fetched.propertyDetails?.length || '',
            plotBreadth: fetched.propertyDetails?.breadth || '',
  
            // ✅ Nominee Details
            nomineeName: fetched.nomineeName || '',
            nomineeAge: fetched.nomineeAge || '',
            nomineeRelationship: fetched.nomineeRelation || '',
            nomineeAddress: fetched.nomineeAddress || '',
  
            // ✅ Membership Details
            seniorityId: fetched.SeniorityID || '',
            membershipNo: fetched.MembershipNo || '',
            cunfirmationLetterNo: fetched.ConfirmationLetterNo || '',
            shareCertificateNo: fetched.ShareCertificateNumber || '',
  
            // ✅ Receipt Details — if you're integrating receipt separately, skip this
            date: fetched.date || '',
          }));
        })
        .catch((err) => {
          console.error("Failed to fetch member", err);
        });
    }
  }, [id]);
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
    else if (!/^[6-9]\d{9}$/.test(data.mobile)) errors.mobile = "Invalid mobile number";
    if (data.altMobile && !/^[6-9]\d{9}$/.test(data.altMobile)) {
      errors.altMobile = "Invalid alternative mobile number";
    }
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Invalid email";
    if (!data.dob.trim()) errors.dob = "Date of Birth is required";
    if (!data.fatherSpouse.trim()) errors.fatherSpouse = "Father/Spouse Name is required";
    if (!data.correspondenceAddress.trim()) errors.correspondenceAddress = "Correspondence Address is required";
    if (!data.permanentAddress.trim()) errors.permanentAddress = "Permanent Address is required";
    if (!data.workingAddress.trim()) errors.workingAddress = "Working Address is required";
  
    if (!data.refencName.trim()) errors.refencName = "Reference Name is required";
    if (!data.rankDesignation.trim()) errors.rankDesignation = "Rank / Designation is required";
    if (!data.ServiceId.trim()) errors.ServiceId = "Service / ID No is required";
    if (!data.relationship.trim()) errors.relationship = "Relationship is required";

    if (!data.projectName.trim()) errors.projectName = "Project name is required";
    if (!data.PropertySize) errors.PropertySize = "Property size is required";
    if (!data.perSqftPropertyPrice) errors.perSqftPropertyPrice = "Price per sqft is required";
    if (!data.selectedPropertyCost) errors.selectedPropertyCost = "Total property cost is required";
    if (!data.percentage) errors.percentage = "Please select a percentage";
    if (!data.percentageCost) errors.percentageCost = "Percentage cost is required";
    if (!data.nomineeName.trim()) errors.nomineeName = "Nominee Name is required";
    if (!data.nomineeAge || isNaN(data.nomineeAge)) errors.nomineeAge = "Valid age is required";
    if (!data.nomineeRelationship.trim()) errors.nomineeRelationship = "Relationship is required";
    if (!data.nomineeAddress.trim()) errors.nomineeAddress = "Address is required";
    if (!data.seniorityId.trim()) errors.seniorityId = "Seniority ID is required";
    if (!data.membershipNo.trim()) errors.membershipNo = "Membership No is required";
    if (!data.cunfirmationLetterNo.trim()) errors.cunfirmationLetterNo = "Confirmation Letter No is required";
    if (!data.shareCertificateNo.trim()) errors.shareCertificateNo = "Share Certificate No is required";

    // Membership Details
if (!data.recieptNo.trim()) errors.recieptNo = "Receipt No is required";
if (!data.date.trim()) errors.date = "Date is required";
if (!data.numberOfShares || isNaN(data.numberOfShares) || Number(data.noofShares) <= 0) {
  errors.numberOfShares = "Valid number of shares is required";
}
if (!data.shareFee || isNaN(data.shareFee) || Number(data.shareFee) <= 0) {
  errors.shareFee = "Valid Share Fee is required";
}
if (!data.memberShipFee || isNaN(data.memberShipFee) || Number(data.memberShipFee) <= 0) {
  errors.memberShipFee = "Valid Membership Fee is required";
}
if (!data.applicationFee || isNaN(data.applicationFee) || Number(data.applicationFee) <= 0) {
  errors.applicationFee = "Valid Application Fee is required";
}
if (!data.adminissionFee || isNaN(data.adminissionFee) || Number(data.adminissionFee) <= 0) {
  errors.adminissionFee = "Valid Admission Fee is required";
}
if (!data.miscellaneousExpenses || isNaN(data.miscellaneousExpenses) || Number(data.miscellaneousExpenses) < 0) {
  errors.miscellaneousExpenses = "Valid Miscellaneous Expenses are required";
}
// Payment Details

if (!formData.paymentType.trim()) {
  errors.paymentType = "Payment type is required";
}

if (!formData.paymentMode.trim()) {
  errors.paymentMode = "Payment mode is required";
}

if (
  ["cheque", "online", "card"].includes(formData.paymentMode.toLowerCase())
) {
  if (!formData.bankName.trim()) {
    errors.bankName = "Bank name is required for this payment mode";
  }

  if (!formData.branchName.trim()) {
    errors.branchName = "Branch name is required for this payment mode";
  }
}

if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
  errors.amount = "Valid amount is required";
}

if (!memberPhoto) {
  errors.memberPhoto = "Member photo is required";
}

if (!memberSign) {
  errors.memberSign = "Member signature is required";
}

    return errors;
  };
  

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    // Prevent negative numbers for numeric inputs
    if (type === "number" || ["noofShares", "shareFee", "memberShipFee", "applicationFee", "adminissionFee", "miscellaneousExpenses", "amount", "nomineeAge", "perSqftPropertyPrice", "PropertySize", "selectedPropertyCost", "percentage", "percentageCost"].includes(name)) {
      if (Number(value) < 0) return; // Ignore update if value is negative
    }
  
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
    if (memberPhoto) data.append('memberPhoto', memberPhoto);
    if (memberSign) data.append('memberSign', memberSign);
    try {
      if (id) {
        // Edit member

        // await axiosInstance.put(`/member/update-member/${id}`, data, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });

        await axiosInstance.put(`/member/update-member/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        toast.success('Member updated successfully!');
      } else {
        // Add member
        await axiosInstance.post('/member/add-member', data, {
          headers: { "Content-Type": "multipart/form-data" },

        });
        toast.success('Member added successfully!');
      }
      navigate('/viewmemberdetails');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Form Data:", formData);
  //   setLoading(true); // Start loading
  //     // Validate PersonalDetails section
  // const personalErrors = validatePersonalDetails(formData);

  // if (Object.keys(personalErrors).length > 0) {
  //   setFormErrors(personalErrors);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  //   setLoading(false); // Stop loading on validation error

  //   return;
  // }

  // setFormErrors({}); // clear errors if passed

  //   const data = new FormData();
  //   // Append text fields
  //   for (const key in formData) {
  //     data.append(key, formData[key]);
  //   }

  //   // Append files
  //   if (memberPhoto) data.append('memberPhoto', memberPhoto);
  //   if (memberSign) data.append('memberSign', memberSign);

  //   try {
  //     const res = await axiosInstance.post('http://localhost:3000/member/add-member', data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     toast.success("Member added successfully!");

  //     navigate("/viewmemberdetails")

  //     console.log('Success:', res.data);
  //     // Show toast or redirect
    
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //   }
  //   finally {
  //     setLoading(false); // Always stop loading at the end
  //   }
  // };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'oklch(0.92 0.04 252.1)' }}>
      <div className="p-6 max-w-5xl w-full mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Form Sections */}
          <ReferenceDetails formData={formData} handleChange={handleChange} formErrors={formErrors}/>
          <ProppertyDetails formData={formData} handleChange={handleChange} formErrors={formErrors}/>
          <PersonalDetails formData={formData} handleChange={handleChange}   formErrors={formErrors}/>
          <NomineePerticular formData={formData} handleChange={handleChange} formErrors={formErrors} />
          <SeniorityDetails formData={formData} handleChange={handleChange}  formErrors={formErrors}/>
          <MemberShipDetails formData={formData} handleChange={handleChange}  formErrors={formErrors}/>
          <PaymentDetails formData={formData} handleChange={handleChange}  formErrors={formErrors}/>

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
              {formErrors.memberPhoto && <p className="text-red-500 text-sm">{formErrors.memberPhoto}</p>}
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
              {formErrors.memberSign && <p className="text-red-500 text-sm">{formErrors.memberSign}</p>}
            </div>

            <div className="flex justify-start mt-6">
              <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </span>
              ) : id ? (
                'Update Member'
              ) : (
                'Add Member'
              )}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormWrapper;