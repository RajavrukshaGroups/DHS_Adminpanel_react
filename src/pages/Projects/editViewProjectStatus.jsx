import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Puff } from "react-loader-spinner";

const EditProjectStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [listProjects, setListProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusDetails, setStatusDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]); // in case you're showing previous images
  const [sendSMS, setSendSMS] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   console.log("existing files",existingFiles)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const res = await axios.get(
        //   "http://localhost:3000/project/all-projects"
        // );
        const res = await axios.get(
          "http://localhost:4000/project/all-projects"
        );
        setListProjects(res.data.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };

    const fetchStatus = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:3000/project/indprojectstatus/${id}`
        // );
        const res = await axios.get(
          `http://localhost:4000/project/indprojectstatus/${id}`
        );
        if (res.data.success) {
          const data = res.data.data;
          setSelectedProject(data.projectName);
          setStatusDate(data.statusDate.slice(0, 10));
          setStatusTitle(data.statusTitle);
          setStatusDetails(data.statusDetails);
          setSendSMS(data.sendSMS || false);
          setSendEmail(data.sendEmail || false);
          setExistingFiles(data.image || []);
          console.log("data", data);
        } else {
          toast.error("Project status not found.");
        }
      } catch (error) {
        toast.error("Error fetching project status.");
        console.error(error);
      }
    };

    fetchProjects();
    if (id) fetchStatus();
  }, [id]);

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

  const removeExistingImage = (index) => {
    const updatedExistingFiles = [...existingFiles];
    updatedExistingFiles.splice(index, 1);
    setExistingFiles(updatedExistingFiles);
  };

  const handleChooseImage = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !statusDate || !statusTitle || !statusDetails) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("projectName", selectedProject);
    formData.append("statusDate", statusDate);
    formData.append("statusTitle", statusTitle);
    formData.append("statusDetails", statusDetails);
    formData.append("sendSMS", sendSMS);
    formData.append("sendEmail", sendEmail);

    // Append retained existing files (Cloudinary URLs)
    existingFiles.forEach((url) => formData.append("existingImages", url));

    // Append new files
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.put(
        // `http://localhost:3000/project/update-indprojectstatus/${id}`,
        `http://localhost:4000/project/update-indprojectstatus/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Project status updated successfully!");
      navigate("/viewprojectstatus");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mt-6">
        <h1 className="text-2xl font-bold mb-8">Edit Project Status</h1>
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
                  {project.projectName}
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

            {/* {existingFiles.length > 0 && (
              <div className="mt-3">
                <label className="block mb-1 font-semibold">
                  Previously Uploaded Files
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                  {existingFiles.map((fileUrl, i) => (
                    <div
                      key={i}
                      className="relative w-full h-24 rounded overflow-hidden border"
                    >
                      <img
                        src={fileUrl}
                        alt={`Existing ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            {existingFiles.length > 0 && (
              <div className="mt-3">
                <label className="block mb-1 font-semibold">
                  Previously Uploaded Files
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                  {existingFiles.map((fileUrl, i) => (
                    <div
                      key={i}
                      className="relative w-full h-24 rounded overflow-hidden border flex items-center justify-center bg-gray-100"
                    >
                      {fileUrl.toLowerCase().endsWith(".pdf") ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-700 p-2">
                          <p>📄 PDF File</p>
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600"
                          >
                            View PDF
                          </a>
                        </div>
                      ) : (
                        <img
                          src={fileUrl}
                          alt={`Existing ${i}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filePreviews.length > 0 && (
              <div className="mt-3">
                <label className="block mb-1 font-semibold">
                  Newly Added Files
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                  {filePreviews.map((preview, i) => {
                    const file = files[i];
                    const isPDF = file.type === "application/pdf";

                    return (
                      <div
                        key={i}
                        className="relative w-full h-24 rounded overflow-hidden border flex items-center justify-center bg-gray-100"
                      >
                        {isPDF ? (
                          <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-700 p-2">
                            <p>📄 PDF File</p>
                            <a
                              href={preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-blue-600"
                            >
                              View PDF
                            </a>
                          </div>
                        ) : (
                          <img
                            src={preview}
                            alt={`Preview ${i}`}
                            className="w-full h-full object-cover"
                          />
                        )}

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
              </div>
            )}
          </div>

          {/* Notification Checkboxes */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendSMS}
                onChange={() => setSendSMS(!sendSMS)}
              />
              <span>Send notification to customer as text message (SMS)</span>
            </label>
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
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectStatus;
