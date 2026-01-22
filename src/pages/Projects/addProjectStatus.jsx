import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Puff } from "react-loader-spinner";

const AddProjectStatus = () => {
  const [listProjects, setListProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusDetails, setStatusDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [sendSMS, setSendSMS] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          // "http://localhost:4000/project/all-projects",
          "https://adminpanel.defencehousingsociety.com/project/all-projects",
        );
        setListProjects(res.data.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };
    fetchProjects();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...filePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  const handleChooseImage = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return toast.error("Project Name is required.");
    if (!statusDate) return toast.error("Status Date is required.");
    if (!statusTitle) return toast.error("Status Title is required.");
    if (!statusDetails) return toast.error("Status Details are required.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("projectName", selectedProject);
    formData.append("statusDate", statusDate);
    formData.append("statusTitle", statusTitle);
    formData.append("statusDetails", statusDetails);
    formData.append("sendSMS", sendSMS);
    formData.append("sendEmail", sendEmail);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        // "http://localhost:4000/project/project-status",
        "https://adminpanel.defencehousingsociety.com/project/project-status",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      toast.success("Project status added successfully!");
      setSelectedProject("");
      setStatusDate("");
      setStatusTitle("");
      setStatusDetails("");
      setFiles([]);
      setFilePreviews([]);
      setSendSMS(false);
      setSendEmail(false);
      navigate("/viewprojectstatus");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting project status",
      );
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mt-6">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Add Project Status
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Project Name */}
          <div>
            <label className="block mb-2 font-semibold">Project Name</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Choose an option</option>
              {listProjects.map((project, index) => (
                <option key={index} value={project.projectName}>
                  {project.projectName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Status Date */}
          <div>
            <label className="block mb-2 font-semibold">Status Date</label>
            <input
              type="date"
              value={statusDate}
              onChange={(e) => setStatusDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Status Title */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">Status Title</label>
            <input
              value={statusTitle}
              onChange={(e) => setStatusTitle(e.target.value)}
              placeholder="Enter status title"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Status Details */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">Status Details</label>
            <textarea
              value={statusDetails}
              onChange={(e) => setStatusDetails(e.target.value)}
              placeholder="Enter status details"
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">
              Upload Images or Documents
            </label>
            <div className="mt-2">
              <button
                type="button"
                onClick={handleChooseImage}
                className="bg-yellow-500 hover:bg-yellow-600 text-sm px-4 py-2 rounded"
              >
                {files.length > 0 ? "Add More Files" : "Choose Files"}
              </button>
            </div>

            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {filePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                {filePreviews.map((src, i) => {
                  const file = files[i];
                  const isPDF = file.type === "application/pdf";

                  return (
                    <div
                      key={i}
                      className="relative w-full h-24 rounded overflow-hidden border"
                    >
                      {/* Render PDF preview */}
                      {isPDF ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-700 p-2">
                          <p>📄 PDF File</p>
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                          >
                            View PDF
                          </a>
                        </div>
                      ) : (
                        <img
                          src={src}
                          alt={`Preview ${i}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="md:col-span-2 flex flex-col gap-2">
            {/* <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendSMS}
                onChange={() => setSendSMS(!sendSMS)}
              />
              <span>Send notification to customer as text message (SMS)</span>
            </label> */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
              />
              <span>Send Email</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white w-full sm:w-48 py-2 rounded hover:bg-blue-700 flex justify-center items-center"
            >
              {isLoading ? (
                <Puff color="#fff" height={24} width={24} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectStatus;
