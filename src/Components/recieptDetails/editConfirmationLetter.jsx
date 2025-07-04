import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/interceptors";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

function EditConfirmationLetter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState({});
  const [loading, setLoading] = useState(false);
  const [newFilePreview, setNewFilePreview] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axiosInstance.get(`/member/get-affidavit/${id}`);
        setMemberData(response);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };
    fetchMember();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const mime = file.type;
    if (mime.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setNewFilePreview({ type: "image", url });
    } else if (mime === "application/pdf") {
      const url = URL.createObjectURL(file);
      setNewFilePreview({ type: "pdf", url });
    } else {
      setNewFilePreview({ type: "doc", name: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setLoading(true);

    try {
      await axiosInstance.put(`/member/edit-confirmation/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Confirmation letter updated successfully");
      navigate("/viewsiteBooking");
    } catch (error) {
      console.error("Error updating confirmation letter:", error);
      toast.error("Failed to update confirmation letter.");
    } finally {
      setLoading(false);
    }
  };

  // Extract extension from affidavit URL
  const getExtension = (url) => {
    const match = url?.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : "";
  };

  const renderOldFilePreview = () => {
    if (!memberData?.affidavitUrl) return null;

    const ext = getExtension(memberData.affidavitUrl);

    if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return (
        <img
          src={memberData.affidavitUrl}
          alt="Affidavit Preview"
          className="w-52 h-auto rounded border"
        />
      );
    } else if (ext === "pdf") {
      return (
        <iframe
          src={memberData.affidavitUrl}
          title="PDF Preview"
          width="100%"
          height="400px"
          className="rounded border"
        />
      );
    } else {
      return (
        <a
          href={memberData.affidavitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {`Download ${ext.toUpperCase()} File`}
        </a>
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Edit Confirmation Letter</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium mb-1">Member Name</label>
          <input
            type="text"
            value={memberData?.name || ""}
            readOnly
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={memberData?.propertyDetails?.projectName || ""}
            readOnly
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sqft Rate</label>
          <input
            type="number"
            name="pricePerSqft"
            value={memberData?.propertyDetails?.pricePerSqft || ""}
            // onChange={(e) =>
            //   setMemberData({
            //     ...memberData,
            //     propertyDetails: {
            //       ...memberData.propertyDetails,
            //       pricePerSqft: e.target.value,
            //     },
            //   })
            // }
            readOnly
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Confirmation Letter Issue Date
          </label>
          <input
            type="date"
            name="confirmationLetterIssueDate"
            value={
              memberData?.confirmationLetterIssueDate
                ? new Date(memberData.confirmationLetterIssueDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              setMemberData({
                ...memberData,
                confirmationLetterIssueDate: e.target.value,
              })
            }
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Time duration</label>
          <input
            type="text"
            name="duration"
            value={memberData?.duration || ""}
            onChange={(e) =>
              setMemberData({ ...memberData, duration: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-medium mb-1">
            Uploaded Affidavit (previous)
          </label>
          <div className="mb-2">{renderOldFilePreview()}</div>
        </div>

        <div className="col-span-2">
          <label className="block font-medium mb-1">
            Upload New Affidavit (optional)
          </label>
          <input
            type="file"
            name="affidivate"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {newFilePreview && (
          <div className="col-span-2">
            <label className="block font-medium mb-1">New File Preview:</label>
            {newFilePreview.type === "image" && (
              <img
                src={newFilePreview.url}
                alt="Preview"
                className="max-w-xs rounded"
              />
            )}
            {newFilePreview.type === "pdf" && (
              <iframe
                src={newFilePreview.url}
                title="PDF Preview"
                width="100%"
                height="400px"
                className="rounded border"
              />
            )}
            {newFilePreview.type === "doc" && (
              <p className="text-gray-700">📄 {newFilePreview.name}</p>
            )}
          </div>
        )}

        <div className="col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-48 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200 flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditConfirmationLetter;
