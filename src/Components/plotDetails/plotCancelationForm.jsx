import { ArrowLeft, Calendar } from "lucide-react";
import axiosInstance from "../../api/interceptors";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

const PlotCancellationForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [cancelLetter, setCancelLetter] = useState(null);
  const [cancelData, setCancelData] = useState({
    reason: "",
    cancellationDate: "",
    remarks: ""
  });



  const handleFetchMember = async () => {
    if (!selectedId) {
      alert("Please enter a Seniority ID.");
      return;
    }
    try {
      const response = await axiosInstance.get(`/plot/getMemberBySeniorityID/${selectedId}`);
      setMemberData(response);
    } catch (error) {
      console.error("Error fetching member:", error);
      alert("Member not found or error occurred.");
      setMemberData(null);
    }
  };

  const handleDocumentUpload = (e) => {
  const file = e.target.files[0];
  setCancelLetter(file);
};

  const handleSubmit = async () => {
  setLoading(true);
  if (!memberData || !cancelData.reason || !cancelData.cancellationDate) {
    alert("Please fill all required fields.");
    return;
  }

  const formData = new FormData();
  formData.append("cancelLetter", cancelLetter); // ✅ file
  formData.append("reason", cancelData.reason);
  formData.append("cancellationDate", cancelData.cancellationDate);
  formData.append("remarks", cancelData.remarks);

  formData.append("member", JSON.stringify({
    seniorityId: selectedId,
    name: memberData.name,
    email: memberData.email,
    projectName: memberData.propertyDetails?.projectName || "",
    propertySize:
      memberData.propertyDetails?.length && memberData.propertyDetails?.breadth
        ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
        : ""
  }));

  try {

    const res = await axiosInstance.post("/plot/plot-cancel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Plot cancellation successful.");
    console.log(res);
  } catch (err) {
    alert("Cancellation failed.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* <div className="mx-auto max-w-5xl space-y-6"> */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 space-y-10">

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <button className="flex items-center text-lg font-medium">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          </div>
          <h2 className="text-2xl font-normal text-gray-800 mb-8">
          Plot Cancellation Form</h2>
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
              <ClipLoader color="#36d7b7" size={60} />
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="seniorityId" className="block text-sm font-medium text-gray-700">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  onClick={handleFetchMember}
                  title="Fetch Member"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input id="name" value={memberData?.name || ""} readOnly className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" value={memberData?.email || ""} readOnly className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
 />
            </div>

            <div className="space-y-2">
              <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project</label>
              <input
                id="project"
                value={memberData?.propertyDetails?.projectName || ""}
                readOnly
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              />
            </div>

            <div className="space-y-2">
              <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700">Property Size</label>
              <input
                id="propertySize"
                value={
                  memberData?.propertyDetails?.length && memberData?.propertyDetails?.breadth
                    ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
                    : ""
                }
                readOnly
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-normal text-gray-800 mb-8">
Cancellation Details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="cancellationDate" className="block text-sm font-medium text-gray-700">
                Cancellation Date
              </label>
              <div className="relative">
                <input
                  id="cancellationDate"
                  type="date"
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                  value={cancelData.cancellationDate}
                  onChange={(e) => setCancelData({ ...cancelData, cancellationDate: e.target.value })}
                />
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Cancellation</label>
              <textarea
                id="reason"
                placeholder="Enter reason"
                className="w-full h-24 border p-2"
                value={cancelData.reason}
                onChange={(e) => setCancelData({ ...cancelData, reason: e.target.value })}
              />
            </div>

            <div className="space-y-2  md:col-span-2">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                id="remarks"
                placeholder="Enter any remarks"
                className="w-full h-24 border p-2"
                value={cancelData.remarks}
                onChange={(e) => setCancelData({ ...cancelData, remarks: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Cancellation Letter</label>
              <input type="file" name="memberPhoto" accept="document/*" onChange={handleDocumentUpload} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
          >
            Cancel Plot
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlotCancellationForm;
