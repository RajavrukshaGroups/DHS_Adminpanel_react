import { ArrowLeft, Calendar, X } from "lucide-react";
import axiosInstance from "../../api/interceptors";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PlotCancellationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [selectedId, setSelectedId] = useState("");
  const [membershipNo, setMembershipNo] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [cancelLetter, setCancelLetter] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cancelData, setCancelData] = useState({
    reason: "",
    cancellationDate: "",
    remarks: "",
  });

  const handleFetchMember = async () => {
    if (!membershipNo) {
      toast.error("Please enter a Membership No.");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/plot/getMemberByMembershipNo/${membershipNo}`,
      );
      setMemberData(response);
    } catch (error) {
      console.error("Error fetching member:", error);
      toast.error("Member not found or error occurred.");
      setMemberData(null);
    }
  };

  // const handleDocumentUpload = (e) => {
  //   const file = e.target.files[0];
  //   setCancelLetter(file);
  // };
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCancelLetter(file);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!memberData || !cancelData.reason || !cancelData.cancellationDate) {
      toast.error("Please fill all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("cancelLetter", cancelLetter); // ✅ file
    formData.append("reason", cancelData.reason);
    formData.append("cancellationDate", cancelData.cancellationDate);
    formData.append("remarks", cancelData.remarks);

    formData.append(
      "member",
      JSON.stringify({
        membershipNo: membershipNo,
        name: memberData.name,
        email: memberData.email,
        projectName: memberData.propertyDetails?.projectName || "",
        propertySize:
          memberData.propertyDetails?.length &&
          memberData.propertyDetails?.breadth
            ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
            : "",
      }),
    );
    try {
      const res = await axiosInstance.post("/plot/plot-cancel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Plot cancellation successful.");
      setTimeout(() => {
        navigate("/PlotCancelledList");
      }, 1000);
      console.log(res);
    } catch (err) {
      toast.error("Cancellation failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8 space-y-10">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <button className="flex items-center text-lg font-medium">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          </div>
          <h2 className="text-2xl font-normal text-gray-800 mb-8">
            Plot Cancellation Form
          </h2>
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
              <ClipLoader color="#36d7b7" size={60} />
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="membershipNo"
                className="block text-sm font-medium text-gray-700"
              >
                {/* Seniority ID */}
                Membership Number
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="membershipNo"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={membershipNo}
                  onChange={(e) => setMembershipNo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFetchMember();
                  }}
                  placeholder="Enter Membership Number"
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                value={memberData?.name || ""}
                readOnly
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={memberData?.email || ""}
                readOnly
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="project"
                className="block text-sm font-medium text-gray-700"
              >
                Project
              </label>
              <input
                id="project"
                value={memberData?.propertyDetails?.projectName || ""}
                readOnly
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="propertySize"
                className="block text-sm font-medium text-gray-700"
              >
                Property Size
              </label>
              <input
                id="propertySize"
                value={
                  memberData?.propertyDetails?.length &&
                  memberData?.propertyDetails?.breadth
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
            Cancellation Details
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="cancellationDate"
                className="block text-sm font-medium text-gray-700"
              >
                Cancellation Date
              </label>
              <div className="relative">
                <input
                  id="cancellationDate"
                  type="date"
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={cancelData.cancellationDate}
                  onChange={(e) =>
                    setCancelData({
                      ...cancelData,
                      cancellationDate: e.target.value,
                    })
                  }
                />
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for Cancellation
              </label>
              <textarea
                id="reason"
                placeholder="Enter reason"
                className="w-full h-24 border p-2"
                value={cancelData.reason}
                onChange={(e) =>
                  setCancelData({ ...cancelData, reason: e.target.value })
                }
              />
            </div>

            <div className="space-y-2  md:col-span-2">
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                placeholder="Enter any remarks"
                className="w-full h-24 border p-2"
                value={cancelData.remarks}
                onChange={(e) =>
                  setCancelData({ ...cancelData, remarks: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Upload Cancellation Letter
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                className="w-full"
              />

              {cancelLetter && (
                <div className="mt-3 border rounded-lg p-3 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setCancelLetter(null);
                      setPreviewUrl("");
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>

                  <p className="text-sm font-medium break-all">
                    {cancelLetter.name}
                  </p>

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Cancellation Letter Preview"
                      className="mt-3 max-h-64 border rounded"
                    />
                  ) : (
                    cancelLetter &&
                    cancelLetter.type === "application/pdf" && (
                      <div className="mt-2">
                        <a
                          href={URL.createObjectURL(cancelLetter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline font-medium"
                        >
                          View PDF
                        </a>
                      </div>
                    )
                  )}
                </div>
              )}
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
