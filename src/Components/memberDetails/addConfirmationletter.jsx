import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/interceptors";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddConfirmationletter() {
  const { id } = useParams();
  const [memberData, setMemberData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axiosInstance.get(
          `/member/get-confirmation/${id}`
        );
        console.log("response", response);
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
    // ✅ Validate affidavit file from FormData
    const file = formData.get("affidivate");
    if (!file || file.size === 0) {
      toast.error("Please upload an affidavit file before submitting.");
      return;
    }
    setLoading(true);

    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);

    try {
      const response = await axiosInstance.post(
        // `http://localhost:3000/member/add-confirmation/${id}`,
        `http://localhost:4000/member/add-confirmation/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Response:", response);
      toast.success("Confirmation letter added successfully");
      navigate("/viewsiteBooking");
    } catch (error) {
      console.error("Error adding confirmation letter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-16 rounded-xl shadow-md mb-6 ">
      <h2 className="text-xl font-bold mb-4">Add Confirmation letter</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block font-medium mb-1">Member Name</label>
          <input
            name="name"
            type="text"
            value={memberData?.name || ""}
            className="w-full border px-4 py-2 rounded-md"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Seniority ID</label>
          <input
            type="text"
            name="SeniorityID"
            value={memberData?.SeniorityID || ""}
            className="w-full border px-4 py-2 rounded-md"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={memberData?.propertyDetails?.projectName || ""}
            className="w-full border px-4 py-2 rounded-md"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Property Size</label>
          <input
            type="text"
            name="propertySize"
            value={`${memberData?.propertyDetails?.length || ""} x ${
              memberData?.propertyDetails?.breadth || ""
            }`}
            className="w-full border px-4 py-2 rounded-md"
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sqft Rate</label>
          <input
            name="pricePerSqft"
            type="number"
            placeholder="Relationship"
            value={memberData?.propertyDetails?.pricePerSqft || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Project Address</label>
          <input
            name="projectAddress"
            type="text"
            className="w-full border px-4 py-2 rounded-md"
            value={memberData?.projectLocation || ""}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={
              memberData.date
                ? new Date(memberData.date).toISOString().split("T")[0]
                : ""
            }
            placeholder="Date"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Site Diemension</label>
          <input
            type="text"
            name="siteDiemension"
            placeholder="Relationship"
            className="w-full border px-4 py-2 rounded-md"
            value={memberData?.propertyDetails?.propertySize || ""}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Memeber ID</label>
          <input
            type="text"
            name="MembershipNo"
            placeholder="Relationship"
            className="w-full border px-4 py-2 rounded-md"
            value={memberData?.MembershipNo || ""}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Seniority No</label>
          <input
            type="text"
            name="SeniorityID"
            placeholder="Relationship"
            className="w-full border px-4 py-2 rounded-md"
            value={memberData?.SeniorityID || ""}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Confirmation Number</label>
          <input
            name="ConfirmationLetterNo"
            type="text"
            value={memberData?.ConfirmationLetterNo || ""}
            placeholder="Relationship"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Confirmation Letter Issue Date
          </label>
          <input
            name="ConfirmationLetterDate"
            type="date"
            value={new Date().toISOString().split("T")[0]}
            placeholder="Select Date"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Upload Affidivate</label>
          <input
            name="affidivate"
            type="file"
            placeholder="affidivate"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-32 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddConfirmationletter;
