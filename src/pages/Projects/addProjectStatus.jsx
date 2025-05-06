import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Puff } from "react-loader-spinner"; // Spinner

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
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/project/all-projects"
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
        "http://localhost:3000/project/project-status",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Project status added successfully!");
      console.log("Success:", response.data);

      // Reset form
      setSelectedProject("");
      setStatusDate("");
      setStatusTitle("");
      setStatusDetails("");
      setFiles([]);
      setFilePreviews([]);
      setSendSMS(false);
      setSendEmail(false);
    } catch (error) {
      if (error.response && error.response.data) {
        // Show error message from backend
        toast.error(
          error.response.data.message || "Error submitting project status"
        );
      } else {
        toast.error("Error submitting project status");
      }
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-5">
        <h1 className="text-xl font-bold mb-6">Add Project Status</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block mb-1 font-medium">Project Name:</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full border rounded px-3 py-2 capitalize"
            >
              <option value="">Choose an option</option>
              {listProjects.map((project, index) => (
                <option key={index} value={project.projectName}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Status Date:</label>
            <input
              type="date"
              value={statusDate}
              onChange={(e) => setStatusDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status Title:</label>
            <textarea
              value={statusTitle}
              onChange={(e) => setStatusTitle(e.target.value)}
              placeholder="Enter status title"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status Details:</label>
            <textarea
              value={statusDetails}
              onChange={(e) => setStatusDetails(e.target.value)}
              placeholder="Enter Status Details"
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              Upload Images or Documents
            </label>
            <button
              type="button"
              onClick={handleChooseImage}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
            >
              {files.length > 0 ? "Add Another Image" : "Choose Image"}
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {filePreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {filePreviews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img
                      src={src}
                      alt={`Preview ${i}`}
                      className="w-full h-full object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sendSMS}
                onChange={() => setSendSMS(!sendSMS)}
                className="mr-2"
              />
              Send notification to customer as text message (SMS)
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
                className="mr-2"
              />
              Send Email
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
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
