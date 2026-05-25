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
  // const [filePreview, setFilePreview] = useState(null);
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileType, setFileType] = useState(null);
  const navigate = useNavigate();
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  console.log("member data", memberData);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axiosInstance.get(
          `/member/get-confirmation/${id}`,
        );
        console.log("response", response);
        setMemberData(response);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };
    fetchMember();
  }, [id]);

  useEffect(() => {
    if (!memberData?.propertyDetails?.projectName) return;

    // Don't override if already exists
    if (memberData?.ConfirmationLetterNo) return;

    const projectName = memberData.propertyDetails.projectName.toLowerCase();

    let prefix = "";

    if (projectName.includes("tapasihalli")) {
      prefix = "DHS/DHT/CL/0000/2026-27";
    } else if (projectName.includes("marasandra")) {
      prefix = "DHS/DHD/CL/0000/2026-27";
    }

    if (prefix) {
      setMemberData((prev) => ({
        ...prev,
        ConfirmationLetterNo: prefix,
      }));
    }
  }, [memberData?.propertyDetails?.projectName]);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setFileType(file.type);

  //   if (file.type.startsWith("image/")) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setFilePreview({ type: "image", url: imageUrl });
  //   } else if (file.type === "application/pdf") {
  //     const pdfUrl = URL.createObjectURL(file);
  //     setFilePreview({ type: "pdf", url: pdfUrl });
  //   } else {
  //     // For doc, docx, others
  //     setFilePreview({ type: "doc", name: file.name });
  //   }
  // };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // append new files
    const updatedFiles = [...selectedFiles, ...newFiles];

    setSelectedFiles(updatedFiles);

    const previews = updatedFiles.map((file) => {
      const fileUrl = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        return {
          type: "image",
          url: fileUrl,
          name: file.name,
        };
      }

      if (file.type === "application/pdf") {
        return {
          type: "pdf",
          url: fileUrl,
          name: file.name,
        };
      }

      return {
        type: "doc",
        name: file.name,
      };
    });

    setFilePreviews(previews);

    // reset input
    e.target.value = "";
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove,
    );

    setSelectedFiles(updatedFiles);

    const updatedPreviews = updatedFiles.map((file) => {
      const fileUrl = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        return {
          type: "image",
          url: fileUrl,
          name: file.name,
        };
      }

      if (file.type === "application/pdf") {
        return {
          type: "pdf",
          url: fileUrl,
          name: file.name,
        };
      }

      return {
        type: "doc",
        name: file.name,
      };
    });

    setFilePreviews(updatedPreviews);
  };

  const handleCheckboxChange = (payment) => {
    let updated;

    const exists = selectedPayments.find(
      (p) => p.receiptNo === payment.receiptNo,
    );

    if (exists) {
      updated = selectedPayments.filter(
        (p) => p.receiptNo !== payment.receiptNo,
      );
    } else {
      updated = [...selectedPayments, payment];
    }

    setSelectedPayments(updated);

    const total = updated.reduce((sum, p) => sum + p.amount, 0);
    setTotalAmount(total);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   if (!formData.get("confirmationLetterIssueDate")) {
  //     toast.error("Please select a confirmation letter issue date.");
  //     return;
  //   }
  //   if (!formData.get("duration")) {
  //     toast.error("Please enter the time duration.");
  //     return;
  //   }

  //   // if (!formData.get("Amount")) {
  //   //   toast.error("Please enter the Total Site Down Payment Amount.");
  //   //   return;
  //   // }
  //   // ✅ Validate affidavit file from FormData
  //   const file = formData.get("affidivate");
  //   // if (!file || file.size === 0) {
  //   //   toast.error("Please upload an affidavit file before submitting.");
  //   //   return;
  //   // }

  //   setLoading(true);

  //   const data = Object.fromEntries(formData.entries());
  //   console.log("Form Data:", data);
  //   data.Amount = totalAmount;

  //   data.confirmationLetterReceiptNo = selectedPayments.map((p) => p.receiptNo);
  //   data.confirmationPayments = JSON.stringify(selectedPayments);

  //   try {
  //     const response = await axiosInstance.post(
  //       `/member/add-confirmation/${id}`,
  //       // `https://adminpanel.defencehousingsociety.com/member/add-confirmation/${id}`,
  //       data,
  //       { headers: { "Content-Type": "multipart/form-data" } },
  //     );
  //     console.log("Response:", response);
  //     toast.success("Confirmation letter added successfully");
  //     navigate("/viewsiteBooking");
  //   } catch (error) {
  //     console.error("Error adding confirmation letter:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    // validations
    if (!form.confirmationLetterIssueDate.value) {
      toast.error("Please select a confirmation letter issue date.");
      return;
    }

    if (!form.duration.value) {
      toast.error("Please enter the time duration.");
      return;
    }

    setLoading(true);

    try {
      // create multipart form data
      const formData = new FormData();

      // append normal fields
      formData.append(
        "confirmationLetterIssueDate",
        form.confirmationLetterIssueDate.value,
      );

      formData.append("duration", form.duration.value);

      formData.append("projectAddress", form.projectAddress.value);

      formData.append("pricePerSqft", form.pricePerSqft.value);

      formData.append("MembershipNo", form.MembershipNo.value);

      formData.append(
        "ConfirmationLetterNo",
        memberData?.ConfirmationLetterNo || "",
      );

      formData.append("Amount", totalAmount);

      // optional fields
      formData.append("ChequeNo", form.ChequeNo?.value || "");

      // selected receipts
      selectedPayments.forEach((payment) => {
        formData.append("confirmationLetterReceiptNo", payment.receiptNo);
      });

      // full payment details
      formData.append("confirmationPayments", JSON.stringify(selectedPayments));

      // append all uploaded files
      selectedFiles.forEach((file) => {
        formData.append("affidivate", file);
      });

      console.log("Selected Files:", selectedFiles);

      console.log("Selected Payments:", selectedPayments);

      // API call
      const response = await axiosInstance.post(
        `/member/add-confirmation/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Response:", response);

      toast.success("Confirmation letter added successfully");

      navigate("/viewsiteBooking");
    } catch (error) {
      console.error("Error adding confirmation letter:", error);

      toast.error(
        error?.response?.data?.message || "Failed to add confirmation letter",
      );
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
        {/* <div>
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
        </div> */}
        <div>
          <label className="block font-medium mb-1">Site Dimension</label>
          <input
            type="text"
            name="siteDiemension"
            placeholder="Site Dimension"
            className="w-full border px-4 py-2 rounded-md"
            value={
              memberData?.propertyDetails?.length *
                memberData?.propertyDetails?.breadth || ""
            }
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Member ID</label>
          <input
            type="text"
            name="MembershipNo"
            placeholder="Relationship"
            className="w-full border px-4 py-2 rounded-md"
            value={memberData?.MembershipNo || ""}
          />
        </div>
        {/* <div>
          <label className="block font-medium mb-1">Seniority No</label>
          <input
            type="text"
            name="SeniorityID"
            placeholder="Relationship"
            className="w-full border px-4 py-2 rounded-md"
            value={memberData?.SeniorityID || ""}
          />
        </div> */}
        <div>
          <label className="block font-medium mb-1">Confirmation Number</label>
          <input
            name="ConfirmationLetterNo"
            type="text"
            // value={memberData?.ConfirmationLetterNo || ""}
            value={memberData?.ConfirmationLetterNo || ""}
            onChange={(e) =>
              setMemberData((prev) => ({
                ...prev,
                ConfirmationLetterNo: e.target.value,
              }))
            }
            placeholder="Enter Confirmation Number"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Confirmation Letter Issue Date
          </label>
          <input
            name="confirmationLetterIssueDate"
            type="date"
            // value={new Date().toISOString().split("T")[0]}
            placeholder="Select Date"
            className="w-full border px-4 py-2 rounded-md"
            defaultValue={new Date().toISOString().split("T")[0]} // Default today
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Time Duration</label>
          <input
            name="duration"
            type="text"
            placeholder="enter duration"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
            Upload Files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />
          </label>

          <span className="text-sm text-gray-600">
            {selectedFiles.length} files selected
          </span>
        </div>
        {/* {filePreview && (
          <div className="mt-4">
            <label className="font-semibold block mb-1">File Preview:</label>
            {filePreview.type === "image" && (
              <img
                src={filePreview.url}
                alt="Preview"
                className="max-w-xs rounded"
              />
            )}
            {filePreview.type === "pdf" && (
              <iframe
                src={filePreview.url}
                title="PDF Preview"
                width="100%"
                height="400px"
                className="rounded border"
              />
            )}
            {filePreview.type === "doc" && (
              <p className="text-gray-700">📄 {filePreview.name}</p>
            )}
          </div>
        )} */}
        {filePreviews.length > 0 && (
          <div className="mt-4 md:col-span-2">
            <label className="font-semibold block mb-3">File Previews:</label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filePreviews.map((file, index) => (
                <div key={index} className="border rounded-lg p-2 relative">
                  {" "}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs z-10"
                  >
                    ✕
                  </button>
                  {file.type === "image" && (
                    <img
                      src={file.url}
                      alt={`Preview ${index}`}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}
                  {file.type === "pdf" && (
                    <iframe
                      src={file.url}
                      title={`PDF ${index}`}
                      className="w-full h-40 rounded"
                    />
                  )}
                  {file.type === "doc" && (
                    <p className="text-gray-700 text-sm">📄 {file.name}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <div>
          <label className="block font-medium mb-1">
            Site Down Payment Amount for Confirmation Letter(req)
          </label>
          <input
            type="number"
            name="Amount"
            defaultValue={memberData?.siteDownPaymentAmount || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div>
            <label className="block font-medium mb-1">
              Site Down Payment Amount for Confirmation Letter
            </label>

            <input
              type="number"
              name="Amount"
              value={totalAmount}
              readOnly
              className="w-full border px-4 py-2 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Reciept Number for Site Downpayment(Req)
            </label>

            <input
              type="text"
              name="confirmationLetterReceiptNo"
              value={selectedPayments.map((p) => p.receiptNo).join(", ")}
              readOnly
              className="w-full border px-4 py-2 rounded-md bg-gray-100"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-2">
            Site Down Payments (Select Multiple)
          </label>

          {memberData?.siteDownPayments?.length > 0 ? (
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
              {memberData.siteDownPayments.map((payment) => (
                // <div
                //   key={payment.receiptNo}
                //   className="flex items-start gap-3 mb-3"
                // >
                <div
                  key={payment.receiptNo}
                  onClick={() => handleCheckboxChange(payment)}
                  className={`flex items-start gap-3 mb-3 cursor-pointer border rounded-lg p-2 transition-all duration-200 ${
                    selectedPayments.some(
                      (p) => p.receiptNo === payment.receiptNo,
                    )
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* <input
                    type="checkbox"
                    className="mt-2"
                    onChange={() => handleCheckboxChange(payment)}
                  /> */}
                  <input
                    type="checkbox"
                    className="mt-2"
                    checked={selectedPayments.some(
                      (p) => p.receiptNo === payment.receiptNo,
                    )}
                    readOnly
                  />

                  <div className="text-sm rounded-md p-3 w-full bg-gray-50">
                    <div>
                      <strong>Receipt No:</strong> {payment.receiptNo}
                    </div>

                    <div>
                      <strong>Amount:</strong> ₹
                      {Number(payment.amount).toLocaleString("en-IN")}
                    </div>

                    <div>
                      <strong>Date:</strong>{" "}
                      {new Date(payment.date).toLocaleDateString("en-GB")}
                    </div>

                    <div>
                      <strong>Payment Mode:</strong>{" "}
                      {payment.paymentMode || "-"}
                    </div>

                    {payment.bankName && (
                      <div>
                        <strong>Bank Name:</strong> {payment.bankName}
                      </div>
                    )}

                    {payment.branchName && (
                      <div>
                        <strong>Branch Name:</strong> {payment.branchName}
                      </div>
                    )}

                    {payment.chequeNumber && (
                      <div>
                        <strong>Cheque No:</strong> {payment.chequeNumber}
                      </div>
                    )}

                    {payment.transactionId && (
                      <div>
                        <strong>Transaction ID:</strong> {payment.transactionId}
                      </div>
                    )}

                    {payment.ddNumber && (
                      <div>
                        <strong>DD Number:</strong> {payment.ddNumber}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No Site Down Payments Found</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-32 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center transition-all duration-200 ${
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
