import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ViewProjectStatus = () => {
  const [projectStatusList, setProjectStatusLists] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // 🔹 modal state
  const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectStatusLists = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:4000/project/all-projectstatus"
          "https://adminpanel.defencehousingsociety.com/project/all-projectstatus"
        );
        if (response.data?.success) {
          setProjectStatusLists(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching projects", err);
        toast.error("error fetching details");
      }
    };
    fetchProjectStatusLists();
  }, []);

  const formatDate = (datestring) => {
    return new Date(datestring).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 bg-blue-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">View Project Status</h1>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-center">S.No</th>
              <th className="border px-4 py-2 text-center">Project Name</th>
              <th className="border px-4 py-2 text-center">Title</th>
              <th className="border px-4 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Image/File</th>
              <th className="border px-4 py-2 text-center">Notified Via</th>
              <th className="border px-4 py-2 text-center">Updated Date</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {projectStatusList.map((project, index) => (
              <tr key={index} className="bg-white">
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2 capitalize text-center">
                  {project.projectName}
                </td>
                <td className="border px-4 py-2 max-w-[150px] truncate text-center">
                  {project.statusTitle?.slice(0, 50)}
                </td>
                <td className="border px-4 py-2 max-w-[200px] truncate text-center">
                  {project.statusDetails?.slice(0, 60)}...
                </td>
                <td className="border px-4 py-2 text-center">
                  {project.image?.length > 0 ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {project.sendSMS && "SMS "}
                  {project.sendEmail && "Email"}
                  {!project.sendSMS && !project.sendEmail && "—"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {formatDate(project.updatedAt)}
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View More
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/editviewprojectstatus/${project._id}`)
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full overflow-auto max-h-[90vh] relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2 capitalize">
              {selectedProject.projectName}
            </h2>
            <p className="mb-2">
              <strong>Title:</strong> {selectedProject.statusTitle}
            </p>
            <p className="mb-2 whitespace-pre-line break-words">
              <strong>Description:</strong> {selectedProject.statusDetails}
            </p>
            <p className="mb-2">
              <strong>Notified Via:</strong> {selectedProject.sendSMS && "SMS "}
              {selectedProject.sendEmail && "Email"}
              {!selectedProject.sendSMS && !selectedProject.sendEmail && "—"}
            </p>
            <p className="mb-4">
              <strong>Updated Date:</strong>{" "}
              {formatDate(selectedProject.updatedAt)}
            </p>
            {selectedProject.image?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedProject.image?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedProject.image.map((fileUrl, i) => {
                      const isPDF = fileUrl.endsWith(".pdf");

                      return (
                        <div key={i} className="relative w-24 h-24">
                          {isPDF ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-sm text-gray-700 p-2 border rounded">
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
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={fileUrl}
                                alt={`project-img-${i}`}
                                className="h-24 w-24 object-cover border rounded"
                              />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Do you really want to delete project status for{" "}
              <strong>{projectToDelete.projectName}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  try {
                    const res = await axios.delete(
                      // `http://localhost:4000/project/delete-projectstatus/${projectToDelete._id}`
                      `https://adminpanel.defencehousingsociety.com/project/delete-projectstatus/${projectToDelete._id}`
                    );
                    if (res.data?.success) {
                      toast.success(res.data.message);
                      setProjectStatusLists((prev) =>
                        prev.filter((p) => p._id !== projectToDelete._id)
                      );
                      setProjectToDelete(null); // Close modal
                    } else {
                      toast.error("Failed to delete project");
                    }
                  } catch (err) {
                    console.error("Delete error:", err);
                    toast.error("Error deleting project");
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setProjectToDelete(null)} // Cancel
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProjectStatus;
