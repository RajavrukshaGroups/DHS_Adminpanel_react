import { ArrowLeft, Calendar } from "lucide-react";
import axiosInstance from "../../api/interceptors";
import { useState,useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

const   PlotTransferForm= () => {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [memberPhoto, setMemberPhoto] = useState(null);
const [memberSign, setMemberSign] = useState(null);
  const [toMember, setToMember] = useState({
      name: "",
      email: "",
      mobile: "",
      address: "",
      reason: "",
      transferDate: "",
    });

const handleFileChange = (e) => {
  const { name, files } = e.target;
  if (name === "memberPhoto") {
    setMemberPhoto(files[0]);
  } else if (name === "memberSign") {
    setMemberSign(files[0]);
  }
};

const handleSubmit = async () => {
    setLoading(true);
  if (!memberData || !toMember.name || !toMember.mobileNumber) {
    alert("Please fill all required fields.");
    return;
  }
  const formData = new FormData();
  formData.append(
    "fromMember",
    JSON.stringify({
      seniorityId: selectedId,
      name: memberData.name,
      email: memberData.email,
      projectName: memberData.propertyDetails?.projectName || "",
      propertySize:
        memberData.propertyDetails?.length && memberData.propertyDetails?.breadth
          ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
          : "",
    })
  );

formData.append(
  "toMember",
  JSON.stringify({
    name: toMember.name,
    email: toMember.email,
    mobile: toMember.mobileNumber,
    address: toMember.address,
  })
);

  formData.append("reason", toMember.reason);
  formData.append("transferDate", toMember.transferDate);
  if (memberPhoto) formData.append("memberPhoto", memberPhoto);
  if (memberSign) formData.append("memberSign", memberSign);
  try {
      // Log formData entries
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": ", pair[1]);
  }
    const res = await axiosInstance.post("/plot/create-transfer", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Plot transferred successfully.");
    console.log(res);
  } catch (err) {
    alert("Transfer failed.");
    console.error(err);
  } finally {
    setLoading(false); 
  }
};

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

  return (
    <div style={{backgroundColor:'oklch(0.92 0.04 252.1)'}} className="min-h-screen  p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* From Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <button className="flex items-center text-lg font-medium">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          </div>
          <h2 className="mb-6 text-2xl font-bold">Plot Transfer From</h2>
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
                <ClipLoader color="#36d7b7" size={60} />
              </div>
            )}

          <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="seniorityId" className="block font-medium text-gray-800">
                Seniority ID
            </label>
            <div className="flex items-center space-x-2">
            <input
            id="seniorityId"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") handleFetchMember();
            }}
            placeholder="Enter Seniority ID"
            />
            <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center justify-center text-sm"
            onClick={handleFetchMember}
            title="Fetch Member"
            >
            <FiSearch className="w-6 h-6" />
            </button>
            </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium text-gray-800">
                Name
              </label>
            <input
                id="name"
                value={memberData?.name || ""}
                readOnly
                className="w-full border p-2"
                />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium text-gray-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={memberData?.email || ""}
                readOnly
                className="w-full border p-2"
                />
            </div>

            <div className="space-y-2">
              <label htmlFor="project" className="block font-medium text-gray-800">
                Project
              </label>
              <textarea type="text" readOnly id="project" value={memberData?.propertyDetails.projectName} className="block border font-medium text-gray-800 p-2"/>
         
            </div>

            <div className="space-y-2">
              <label htmlFor="propertySize" className="block font-medium text-gray-800">
                Property Size
              </label>
             <input
                id="propertySize"
                value={
                    memberData?.propertyDetails?.length && memberData?.propertyDetails?.breadth
                    ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
                    : ""
                }
                readOnly
                className="w-full border p-2"
                />
            </div>
          </div>
        </div>
        {/* To Section */}
         <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Plot Transfer To</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="memberName" className="block font-medium text-gray-800">
              Member Name
            </label>
            <input
              id="memberName"
              placeholder="Enter Member Name"
              className="w-full border p-2"
              value={toMember.name}
              onChange={(e) => setToMember({ ...toMember, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="transferDate" className="block font-medium text-gray-800">
              Transfer Date
            </label>
            <div className="relative">
              <input
                id="transferDate"
                type="date"
                className="w-full border p-2"
                value={toMember.transferDate}
                onChange={(e) => setToMember({ ...toMember, transferDate: e.target.value })}
              />
              <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="mobileNumber" className="block font-medium text-gray-800">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              placeholder="Enter mobile number"
              className="w-full border p-2"
              value={toMember.mobileNumber}
              onChange={(e) => setToMember({ ...toMember, mobileNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="toEmail" className="block font-medium text-gray-800">
              Email
            </label>
            <input
              id="toEmail"
              type="email"
              placeholder="Enter Email ID"
              className="w-full border p-2"
              value={toMember.email}
              onChange={(e) => setToMember({ ...toMember, email: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="block font-medium text-gray-800">
              Residence/Contact Address
            </label>
            <textarea
              id="address"
              placeholder="Enter residence/contact address"
              className="h-24 w-full resize-none border p-2"
              value={toMember.address}
              onChange={(e) => setToMember({ ...toMember, address: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-3">
            <label htmlFor="reason" className="block font-medium text-gray-800">
              Reason
            </label>
            <textarea
              id="reason"
              placeholder="Enter the reason"
              className="h-24 w-full resize-none border p-2"
              value={toMember.reason}
              onChange={(e) => setToMember({ ...toMember, reason: e.target.value })}
            />
          </div>

        </div>

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


        <div className="mt-6">
         <button
          className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default PlotTransferForm