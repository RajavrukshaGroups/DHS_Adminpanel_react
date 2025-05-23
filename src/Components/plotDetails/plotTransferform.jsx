import { ArrowLeft, Calendar } from "lucide-react"
import axiosInstance from "../../api/interceptors";
import { useState,useEffect } from "react";
import { FiSearch } from "react-icons/fi";


const   PlotTransferForm=() =>{
  const [seniorityIds, setSeniorityIds] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [memberData, setMemberData] = useState(null);
  
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
            onChange={(e) => setSelectedId(e.target.value)} // allow typing
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
              {/* <input id="name" defaultValue="M D Sameer Patel" className="w-full border p-2" /> */}
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
              <textarea type="text" readOnly id="project" value={memberData.propertyDetails.projectName} className="block border font-medium text-gray-800 p-2"/>
              {/* <select
                id="project"
                className="w-full rounded-md border border-gray-300 p-2"
                defaultValue="Defence Habitat - Tapasihalli"
              > */}
           
              {/* </select> */}
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
              <input id="memberName" placeholder="Enter Member Name" className="w-full border p-2" />
            </div>

            <div className="space-y-2">
              <label htmlFor="transferDate" className="block font-medium text-gray-800">
                Transfer Date
              </label>
              <div className="relative">
                <input id="transferDate" placeholder="dd-mm-yyyy" className="w-full border p-2" />
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="mobileNumber" className="block font-medium text-gray-800">
                Mobile Number
              </label>
              <input id="mobileNumber" placeholder="Enter mobile number" className="w-full border p-2" />
            </div>

            <div className="space-y-2">
              <label htmlFor="toEmail" className="block font-medium text-gray-800">
                Email
              </label>
              <input id="toEmail" type="email" placeholder="Enter Email ID" className="w-full border p-2" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="block font-medium text-gray-800">
                Residence/Contact Address
              </label>
              <textarea
                id="address"
                placeholder="Enter residence/contact address"
                className="h-24 w-full resize-none border p-2"
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label htmlFor="reason" className="block font-medium text-gray-800">
                Reason
              </label>
              <textarea id="reason" placeholder="Enter the reason" className="h-24 w-full resize-none border p-2" />
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlotTransferForm