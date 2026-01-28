import React, { useEffect, useState } from "react";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../api/interceptors";

function Dashboard() {
  const [totalProjectsCount, setTotalProjects] = useState(0);
  const [totalRegMembers, setTotalRegMembers] = useState(0);
  const [totalInactiveMembers, setTotalInactiveMembers] = useState(0);
  const [showSkippedModal, setShowSkippedModal] = useState(false);
  const [skippedDetails, setSkippedDetails] = useState([]);

  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/adminlogin"); // Redirect to login page
  };

  useEffect(() => {
    const fetchProjectsCount = async () => {
      try {
        const data = await axiosInstance.get("/project/totalprojectscount");
        setTotalProjects(data.totalProjects);
        setTotalRegMembers(data.totalRegMembers);
        setTotalInactiveMembers(data.totalInactiveMembers);
      } catch (err) {
        toast.error("failed to fetch the projects count");
        console.error("failed to fetch the projects count", err);
      }
    };
    fetchProjectsCount();
  }, []);

  // inside Dashboard component
  // const handleUploadMembers = async () => {
  //   try {
  //     const toastId = toast.loading("Uploading members from Google Sheet...");
  //     const data = await axiosInstance.post("/member/upload-google-sheet");
  //     console.log("data value", data);
  //     toast.success(
  //       `Upload finished. Created: ${data.summary.created}, Skipped: ${data.summary.skippedExisting}`,
  //       { id: toastId },
  //     );
  //     console.log("Upload result:", data);
  //     // Optionally refresh counts
  //     // fetchProjectsCount();
  //   } catch (err) {
  //     console.error("Upload error:", err.response?.data || err.message);
  //     toast.error("Upload failed. Check server logs.");
  //   }
  // };

  const handleUploadMembers = async () => {
    try {
      const toastId = toast.loading("Uploading members from Google Sheet...");

      const resp = await axiosInstance.post("/member/upload-google-sheet");

      const summary = resp?.summary || {};

      // ✅ SHOW SKIPPED MEMBERS MODAL (same as receipts)
      if (summary.skippedDetails?.length) {
        console.group("Skipped Members");
        summary.skippedDetails.forEach((item) => {
          console.log(
            `Row ${item.row} | ${item.seniorityId || "N/A"} | ${
              item.membershipNo || "N/A"
            } | ${item.reason}`,
          );
        });
        console.groupEnd();

        setSkippedDetails(summary.skippedDetails);
        setShowSkippedModal(true);
      }

      toast.success(
        `Upload finished. Created: ${summary.created}, Skipped: ${summary.skippedExisting}`,
        { id: toastId },
      );
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error("Upload failed. Check server logs.");
    }
  };

  // const handleUploadSiteAdvanceReceipts = async () => {
  //   try {
  //     const toastId = toast.loading(
  //       "Uploading Site Advance receipts from Site advance sheet..."
  //     );
  //     // this calls: POST /receipt/bulk-receipts-upload (as wired in your routes)
  //     const resp = await axiosInstance.post("/receipt/bulk-receipts-upload");
  //     console.log("response", resp);
  //     const summary = resp?.summary || {};
  //     // prefer readable fields if available
  //     const success = summary.success ?? summary.created ?? 0;
  //     const skipped = summary.skipped ?? 0;
  //     const failed = summary.failed ?? 0;

  //     toast.success(
  //       `SiteAdvance upload finished. Success: ${success}, Skipped: ${skipped}, Failed: ${failed}`,
  //       { id: toastId }
  //     );

  //     // debug log full response
  //     console.log("SiteAdvance bulk upload response:", resp.data);
  //   } catch (err) {
  //     console.error(
  //       "SiteAdvance upload error:",
  //       err.response?.data || err.message
  //     );
  //     // try to extract server message if present
  //     const serverMsg =
  //       err.response?.data?.error || err.response?.data?.message;
  //     if (serverMsg) toast.error(`Upload failed: ${serverMsg}`);
  //     else toast.error("SiteAdvance upload failed. Check server logs.");
  //   }
  // };

  const handleUploadSiteAdvanceReceipts = async () => {
    try {
      const toastId = toast.loading(
        "Uploading Site Advance receipts from Site advance sheet...",
      );

      const resp = await axiosInstance.post("/receipt/bulk-receipts-upload");

      const summary = resp?.summary || {};

      // ✅ ADD HERE — EXACT SPOT
      if (summary.skippedDetails?.length) {
        console.group("Skipped Receipts");
        summary.skippedDetails.forEach((item) => {
          console.log(
            `Row ${item.row} | ${item.seniorityId || "N/A"} | ${
              item.receiptNo || "N/A"
            } | ${item.reason}`,
          );
        });
        console.groupEnd();

        setSkippedDetails(summary.skippedDetails);
        setShowSkippedModal(true);
      }

      const success = summary.success ?? 0;
      const skipped = summary.skipped ?? 0;
      const failed = summary.failed ?? 0;

      toast.success(
        `SiteAdvance upload finished. Success: ${success}, Skipped: ${skipped}, Failed: ${failed}`,
        { id: toastId },
      );
    } catch (err) {
      toast.error("SiteAdvance upload failed. Check server logs.");
    }
  };

  const handleDeleteAllMembersAndReceiptsData = async () => {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete ALL members and ALL receipts. Are you sure?",
    );

    if (!confirmed) return;

    try {
      const toastId = toast.loading("Deleting all members and receipts...");

      const resp = await axiosInstance.delete("/member/delete-members-data");

      toast.success(
        `Deleted Members: ${resp.membersDeleted}, Receipts: ${resp.receiptsDeleted}`,
        { id: toastId },
      );

      // Optionally refresh dashboard counts
      // fetchProjectsCount();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete members and receipts");
    }
  };

  const handleDeleteReceiptsData = async () => {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete ALL receipts. Continue?",
    );

    if (!confirmed) return;

    try {
      const toastId = toast.loading("Deleting receipts...");

      const resp = await axiosInstance.delete("/member/delete-receipts-data");

      toast.success(`Deleted Receipts: ${resp.receiptsDeleted}`, {
        id: toastId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete receipts");
    }
  };

  return (
    <>
      <div className="bg-[#E7F2FD] w-full h-screen">
        <div className="min-h-full bg-[#E7F2FD]">
          <div className="flex justify-center gap-10 pt-12">
            <div className="bg-white border-1 border-green-500 text-green-600 rounded-lg shadow-md w-64 h-48 flex flex-col items-center justify-center text-center hover:shadow-lg transition p-4">
              <h2 className="text-2xl font-semibold capitalize mb-2">
                Total number of Projects
              </h2>
              <p className="text-4xl font-bold">{totalProjectsCount}</p>
            </div>

            <div className="bg-white border-1 border-red-500 text-red-600 rounded-lg shadow-md w-64 h-48 flex flex-col items-center justify-center text-center hover:shadow-lg transition p-4">
              <h2 className="text-2xl font-semibold capitalize mb-2">
                Total Registered Members
              </h2>
              <p className="text-4xl font-bold">{totalRegMembers}</p>
            </div>
            <div className="bg-white border-1 border-blue-500 text-blue-600 rounded-lg shadow-md w-64 h-48 flex flex-col items-center justify-center text-center hover:shadow-lg transition p-4">
              <h2 className="text-2xl font-semibold capitalize mb-2">
                Inactive Members
              </h2>
              <p className="text-4xl font-bold">{totalInactiveMembers}</p>
            </div>
          </div>
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={handleUploadMembers}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Upload Members
            </button>

            <button
              onClick={handleUploadSiteAdvanceReceipts}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Upload Site Advance / Installments/ Downpayment Receipts
            </button>
          </div>

          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={handleDeleteAllMembersAndReceiptsData}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
            >
              Delete All Members and Receipts Data
            </button>

            <button
              onClick={handleDeleteReceiptsData}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
            >
              Delete Receipts Data
            </button>
          </div>

          <div className="mt-12 mx-auto w-11/12 max-w-5xl overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
            <div className="p-8 text-gray-700 text-lg leading-relaxed animate-scroll overflow-y-auto h-72 hover:[animation-play-state:paused] space-y-4">
              <p>
                ⭐️ Defence Habitat is a social service organization, functioning
                with an objective of promoting and facilitating to Serving and
                Retired Armed / Defence Forces as well as Para Military
                personnel.
              </p>
              <p>
                ⭐️ The objectives of Defence Habitat amongst others, include
                facilitating provisions of residential plots by promoting
                housing schemes in cities all over the States as per the demand
                of Defence and Para Military personnel and their families.
              </p>
              <p>
                ⭐️ Although Defence Habitat does not construct any projects on
                its own, it ties up with reputed builders /developers to provide
                the best in class dwelling units to its members at genuine
                prices.
              </p>
              <p>
                ⭐️ Defence Habitat amongst others provides premium residential
                plots which is peaceful, and pollution-free property by
                promoting housing schemes in cities all over the state as per
                the demand of Defence and ParaMilitary personnel and their
                families.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSkippedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {/* Skipped Receipts */}
                Skipped Records
              </h2>
              <button
                onClick={() => setShowSkippedModal(false)}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <table className="w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Row</th>
                    <th className="border px-3 py-2 text-left">Seniority ID</th>
                    <th className="border px-3 py-2 text-left">
                      Membership / Receipt No
                    </th>
                    <th className="border px-3 py-2 text-left">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {skippedDetails.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{item.row}</td>
                      <td className="border px-3 py-2">
                        {item.seniorityId || "—"}
                      </td>
                      {/* <td className="border px-3 py-2">
                        {item.receiptNo || "—"}
                      </td> */}
                      <td className="border px-3 py-2">
                        {item.receiptNo || item.membershipNo || "—"}
                      </td>

                      <td className="border px-3 py-2 text-red-600">
                        {item.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t">
              <button
                onClick={() => setShowSkippedModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
