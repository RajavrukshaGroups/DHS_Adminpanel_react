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
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newFilePreview, setNewFilePreview] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [siteDownPayments, setSiteDownPayments] = useState([]);
  console.log("site down payments", siteDownPayments);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axiosInstance.get(`/member/get-affidavit/${id}`);
        const paymentResponse = await axiosInstance.get(
          `/member/get-confirmation/${id}`,
        );
        console.log("payment response", paymentResponse);
        setMemberData(response);
        setSiteDownPayments(paymentResponse.siteDownPayments || []);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };
    fetchMember();
  }, [id]);

  useEffect(() => {
    if (
      memberData?.confirmationLetterReceiptNo &&
      siteDownPayments.length > 0
    ) {
      const existingReceipts = Array.isArray(
        memberData.confirmationLetterReceiptNo,
      )
        ? memberData.confirmationLetterReceiptNo
        : [memberData.confirmationLetterReceiptNo];

      const matchedPayments = siteDownPayments.filter((payment) =>
        existingReceipts.includes(payment.receiptNo),
      );

      setSelectedPayments(matchedPayments);

      const total = matchedPayments.reduce((sum, p) => sum + p.amount, 0);

      setTotalAmount(total);
    }
  }, [memberData, siteDownPayments]);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const mime = file.type;
  //   if (mime.startsWith("image/")) {
  //     const url = URL.createObjectURL(file);
  //     setNewFilePreview({ type: "image", url });
  //   } else if (mime === "application/pdf") {
  //     const url = URL.createObjectURL(file);
  //     setNewFilePreview({ type: "pdf", url });
  //   } else {
  //     setNewFilePreview({ type: "doc", name: file.name });
  //   }
  // };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

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
      } else if (file.type === "application/pdf") {
        return {
          type: "pdf",
          url: fileUrl,
          name: file.name,
        };
      } else {
        return {
          type: "doc",
          name: file.name,
        };
      }
    });

    setFilePreviews(previews);

    // preserve old preview compatibility
    if (previews.length > 0) {
      setNewFilePreview(previews[0]);
    }

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
      } else if (file.type === "application/pdf") {
        return {
          type: "pdf",
          url: fileUrl,
          name: file.name,
        };
      } else {
        return {
          type: "doc",
          name: file.name,
        };
      }
    });

    setFilePreviews(updatedPreviews);

    setNewFilePreview(updatedPreviews.length > 0 ? updatedPreviews[0] : null);
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
  //   formData.set("Amount", totalAmount);

  //   formData.delete("confirmationLetterReceiptNo");

  //   selectedPayments.forEach((payment) => {
  //     formData.append("confirmationLetterReceiptNo", payment.receiptNo);
  //   });
  //   formData.set("confirmationPayments", JSON.stringify(selectedPayments));
  //   setLoading(true);

  //   try {
  //     await axiosInstance.put(`/member/edit-confirmation/${id}`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     toast.success("Confirmation letter updated successfully");
  //     navigate("/viewsiteBooking");
  //   } catch (error) {
  //     console.error("Error updating confirmation letter:", error);
  //     toast.error("Failed to update confirmation letter.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // ✅ create empty formdata
      const formData = new FormData();

      // ✅ preserve previous logic
      formData.set(
        "confirmationLetterIssueDate",
        memberData?.confirmationLetterIssueDate || "",
      );

      formData.set("duration", memberData?.duration || "");

      formData.set(
        "pricePerSqft",
        memberData?.propertyDetails?.pricePerSqft || "",
      );

      formData.set(
        "ConfirmationLetterNo",
        memberData?.ConfirmationLetterNo || "",
      );

      formData.set("Amount", totalAmount);

      // ✅ remove old receipt entries
      formData.delete("confirmationLetterReceiptNo");

      // ✅ append selected receipt numbers
      selectedPayments.forEach((payment) => {
        formData.append("confirmationLetterReceiptNo", payment.receiptNo);
      });

      // ✅ preserve payment logic
      formData.set("confirmationPayments", JSON.stringify(selectedPayments));

      // ✅ append uploaded files
      selectedFiles.forEach((file) => {
        formData.append("affidivate", file);
      });

      // ✅ api call unchanged
      await axiosInstance.put(`/member/edit-confirmation/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

        <div>
          <label className="block font-medium mb-1">
            Site Down Payment Amount for Confirmation Letter(req)
          </label>
          {/* <input
            type="number"
            name="Amount"
            value={memberData?.Amount || ""}
            onChange={(e) =>
              setMemberData({ ...memberData, Amount: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-md"
          /> */}
          <input
            type="number"
            name="Amount"
            value={totalAmount}
            readOnly
            className="w-full border px-4 py-2 rounded-md bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-2">
            Site Down Payments (Select Multiple)
          </label>

          {siteDownPayments.length > 0 ? (
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
              {siteDownPayments.map((payment) => (
                // <div
                //   key={payment.receiptNo}
                //   className="flex items-center gap-2 mb-2"
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
                    checked={selectedPayments.some(
                      (p) => p.receiptNo === payment.receiptNo,
                    )}
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

                  <div className="text-sm border rounded-md p-3 w-full bg-gray-50">
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

        <div>
          <label className="block font-medium mb-1">
            Confirmation Letter Number (Req)
          </label>
          <input
            type="text"
            name="ConfirmationLetterNo"
            value={memberData?.ConfirmationLetterNo || ""}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                ConfirmationLetterNo: e.target.value,
              })
            }
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Reciept Number for Site Downpayment(Req)
          </label>
          {/* <input
            type="number"
            name="confirmationLetterReceiptNo"
            value={memberData?.confirmationLetterReceiptNo || ""}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                confirmationLetterReceiptNo: e.target.value,
              })
            }
            className="w-full border px-4 py-2 rounded-md"
          /> */}
          <input
            type="text"
            name="confirmationLetterReceiptNo"
            value={selectedPayments.map((p) => p.receiptNo).join(", ")}
            readOnly
            className="w-full border px-4 py-2 rounded-md bg-gray-100"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-medium mb-1">
            Uploaded Affidavit (previous)
          </label>
          <div className="mb-2">{renderOldFilePreview()}</div>
        </div>

        {/* <div className="col-span-2">
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
        </div> */}

        <div className="flex items-center gap-3">
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
            Upload Files
            <input
              type="file"
              multiple
              name="affidivate"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <span className="text-sm text-gray-600">
            {selectedFiles.length} files selected
          </span>
        </div>

        {/* {newFilePreview && (
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
        )} */}

        {filePreviews.length > 0 && (
          <div className="col-span-2">
            <label className="block font-medium mb-1">New File Preview:</label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filePreviews.map((file, index) => (
                <div key={index} className="border rounded-lg p-2 relative">
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
                      alt="Preview"
                      className="w-full h-40 object-cover rounded"
                    />
                  )}

                  {file.type === "pdf" && (
                    <iframe
                      src={file.url}
                      title="PDF Preview"
                      className="w-full h-40 rounded border"
                    />
                  )}

                  {file.type === "doc" && (
                    <p className="text-gray-700">📄 {file.name}</p>
                  )}
                </div>
              ))}
            </div>
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
