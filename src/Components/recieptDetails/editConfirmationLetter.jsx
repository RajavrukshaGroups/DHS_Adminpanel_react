import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/interceptors";
import { FaSpinner } from 'react-icons/fa';
import { toast } from "react-hot-toast";

function EditConfirmationLetter() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const fetchMember = async () => {
      try {
        const response = await axiosInstance.get(`/receipt/get-affidavit/${id}`);
        setMemberData(response);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMember();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `/member/edit-confirmation/${id}`, // make sure your backend route supports PUT
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Confirmation letter updated successfully");
      navigate("/viewsiteBooking");
    } catch (error) {
      console.error("Error updating confirmation letter:", error);
      toast.error("Failed to update confirmation letter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Edit Confirmation Letter</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            defaultValue={memberData?.propertyDetails?.pricePerSqft || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="text"
            name="Amount"
            defaultValue={memberData?.Amount || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          <input
            type="text"
            name="PaymentType"
            defaultValue={memberData?.PaymentType || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Confirmation Number</label>
          <input
            type="text"
            name="ConfirmationLetterNo"
            defaultValue={memberData?.ConfirmationLetterNo || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Confirmation Letter Issue Date</label>
          <input
            type="date"
            name="ConfirmationLetterDate"
            defaultValue={
              memberData?.ConfirmationLetterDate
                ? new Date(memberData.ConfirmationLetterDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload New Affidavit (optional)</label>
          <input
            type="file"
            name="affidivate"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

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