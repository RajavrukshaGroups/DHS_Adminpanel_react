import { ArrowLeft, Calendar } from "lucide-react";
import axiosInstance from "../../api/interceptors";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

const PlotTransferForm = () => {
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("id"); // 'id' | 'name'
  const [nameQuery, setNameQuery] = useState("");
  const initialToMember = {
    saluation: "",
    name: "",
    email: "",
    mobileNumber: "",
    dateofbirth: "",
    fatherName: "",
    contactAddress: "",
    permanentAddress: "",
    workingAddress: "",
    nomineeName: "",
    nomineeAge: "",
    nomineeRelation: "",
    nomineeAddress: "",
    reason: "",
    transferDate: "",
  };
  const [selectedId, setSelectedId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [memberPhoto, setMemberPhoto] = useState(null);
  const [memberSign, setMemberSign] = useState(null);
  // const [toMember, setToMember] = useState({
  //   saluation: "",
  //   name: "",
  //   email: "",
  //   mobileNumber: "",
  //   dateofbirth: "",
  //   fatherName: "",
  //   contactAddress: "",
  //   permanentAddress: "",
  //   workingAddress: "",
  //   nomineeName: "",
  //   nomineeAge: "",
  //   nomineeRelation: "",
  //   nomineeAddress: "",
  //   reason: "",
  //   transferDate: "",
  // });

  const [toMember, setToMember] = useState(initialToMember);
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "memberPhoto") {
      setMemberPhoto(files[0]);
    } else if (name === "memberSign") {
      setMemberSign(files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!memberData || !toMember.name || !toMember.mobileNumber) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formattedTransferDate = toMember.transferDate
      ? new Date(toMember.transferDate).toISOString()
      : new Date().toISOString();

    const formData = new FormData();
    formData.append(
      "fromMember",
      JSON.stringify({
        seniorityId: selectedId,
        name: memberData.name,
        email: memberData.email,
        projectName: memberData.propertyDetails?.projectName || "",
        propertySize:
          memberData.propertyDetails?.length &&
          memberData.propertyDetails?.breadth
            ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
            : "",
      })
    );

    formData.append(
      "toMember",
      JSON.stringify({
        saluation: toMember.saluation,
        name: toMember.name,
        email: toMember.email,
        mobile: toMember.mobileNumber,
        dateofbirth: toMember.dateofbirth,
        fatherName: toMember.fatherName,
        contactAddress: toMember.contactAddress,
        permanentAddress: toMember.permanentAddress,
        workingAddress: toMember.workingAddress,
        nomineeName: toMember.nomineeName,
        nomineeAge: toMember.nomineeAge,
        nomineeRelation: toMember.nomineeRelation,
        nomineeAddress: toMember.nomineeAddress,
      })
    );

    formData.append("reason", toMember.reason);
    formData.append("transferDate", formattedTransferDate);

    if (memberPhoto) formData.append("memberPhoto", memberPhoto);
    if (memberSign) formData.append("memberSign", memberSign);
    try {
      const res = await axiosInstance.post("/plot/create-transfer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Plot transferred successfully.");
      setSelectedId("");
      setMemberData(null);
      setMemberPhoto(null);
      setMemberSign(null);
      setToMember(initialToMember);
    } catch (err) {
      toast.error("Transfer failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMember = async () => {
    setSearchResults([]);
    if (searchMode === "id") {
      if (!selectedId) {
        toast.error("Please enter a Seniority ID.");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/plot/getMemberBySeniorityID/${selectedId}`
        );
        setMemberData(response);
        setToMember({
          saluation: response.saluation || "",
          name: response.name || "",
          email: response.email || "",
          mobileNumber: response.mobileNumber || "",
          dateofbirth: response.dateofbirth || "",
          fatherName: response.fatherName || "",
          contactAddress: response.contactAddress || "",
          permanentAddress: response.permanentAddress || "",
          workingAddress: response.workingAddress || "",
          nomineeName: response.nomineeName || "",
          nomineeAge: response.nomineeAge || "",
          nomineeRelation: response.nomineeRelation || "",
          nomineeAddress: response.nomineeAddress || "",
          reason: "",
          transferDate: "",
        });
      } catch (error) {
        console.error("Error fetching member:", error);
        toast.error("Member not found or error occurred.");
        setMemberData(null);
      }
    } else {
      if (!nameQuery.trim()) {
        toast.error("Please enter a name to search.");
        return;
      }
      try {
        const res = await axiosInstance.get(
          `/member/view-member-details?page=1&search=${encodeURIComponent(
            nameQuery.trim()
          )}`
        );
        const results = Array.isArray(res.data) ? res.data : [];
        if (results.length === 0) {
          toast.error("No members found with that name.");
          setSearchResults([]);
          setMemberData(null);
          return;
        }
        if (results.length === 1) {
          const only = results[0];
          if (only.SeniorityID) {
            setSelectedId(only.SeniorityID);
            const response = await axiosInstance.get(
              `/plot/getMemberBySeniorityID/${only.SeniorityID}`
            );
            setMemberData(response);
            setToMember({
              saluation: response.saluation || "",
              name: response.name || "",
              email: response.email || "",
              mobileNumber: response.mobileNumber || "",
              dateofbirth: response.dateofbirth || "",
              fatherName: response.fatherName || "",
              contactAddress: response.contactAddress || "",
              permanentAddress: response.permanentAddress || "",
              workingAddress: response.workingAddress || "",
              nomineeName: response.nomineeName || "",
              nomineeAge: response.nomineeAge || "",
              nomineeRelation: response.nomineeRelation || "",
              nomineeAddress: response.nomineeAddress || "",
              reason: "",
              transferDate: "",
            });
          } else {
            setSearchResults(results);
          }
        } else {
          setSearchResults(results);
          setMemberData(null);
        }
      } catch (error) {
        console.error("Error searching members by name:", error);
        toast.error("Search failed.");
        setSearchResults([]);
      }
    }
  };

  const handleSelectMemberFromList = async (member) => {
    try {
      if (!member?.SeniorityID) return;
      setSelectedId(member.SeniorityID);
      const response = await axiosInstance.get(
        `/plot/getMemberBySeniorityID/${member.SeniorityID}`
      );
      setMemberData(response);
      setToMember({
        saluation: response.saluation || "",
        name: response.name || "",
        email: response.email || "",
        mobileNumber: response.mobileNumber || "",
        dateofbirth: response.dateofbirth || "",
        fatherName: response.fatherName || "",
        contactAddress: response.contactAddress || "",
        permanentAddress: response.permanentAddress || "",
        workingAddress: response.workingAddress || "",
        nomineeName: response.nomineeName || "",
        nomineeAge: response.nomineeAge || "",
        nomineeRelation: response.nomineeRelation || "",
        nomineeAddress: response.nomineeAddress || "",
        reason: "",
        transferDate: "",
      });
      setSearchResults([]);
    } catch (error) {
      console.error("Error fetching selected member:", error);
      toast.error("Failed to load member details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setToMember((prev) => ({
      ...prev,
      [name]: type === "date" ? value : value,
    }));
  };

  return (
    <div
      style={{ backgroundColor: "oklch(0.92 0.04 252.1)" }}
      className="min-h-screen  p-4 md:p-6"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        {/* From Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4">
            <button className="flex items-center text-lg font-medium">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          </div>
          <h2 className="mb-6 text-2xl font-bold">Plot Transfer From</h2>
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
              <ClipLoader color="#36d7b7" size={60} />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block font-medium text-gray-800">Search Mode</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={searchMode}
                onChange={(e) => {
                  setSearchMode(e.target.value);
                  setSearchResults([]);
                  setMemberData(null);
                  setSelectedId("");
                  setNameQuery("");
                }}
              >
                <option value="id">By Seniority ID</option>
                <option value="name">By Name</option>
              </select>
            </div>

            {searchMode === "id" && (
              <div className="space-y-2 md:col-span-1">
                <label
                  htmlFor="seniorityId"
                  className="block font-medium text-gray-800"
                >
                  Seniority ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="seniorityId"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFetchMember();
                    }}
                    placeholder="Enter Seniority ID"
                  />
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center justify-center text-sm"
                    onClick={handleFetchMember}
                    title="Fetch Member"
                  >
                    <FiSearch className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {searchMode === "name" && (
              <div className="space-y-2 md:col-span-1">
                <label htmlFor="nameSearch" className="block font-medium text-gray-800">
                  Member Name
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="nameSearch"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFetchMember();
                    }}
                    placeholder="Enter member name"
                  />
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center justify-center text-sm"
                    onClick={handleFetchMember}
                    title="Search by name"
                  >
                    <FiSearch className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {searchMode === "name" && searchResults.length > 0 && (
              <div className="md:col-span-3">
                <div className="mt-2 border rounded p-3 bg-gray-50">
                  <p className="font-medium text-gray-800 mb-2">Select a member:</p>
                  <ul className="space-y-2">
                    {searchResults.map((m) => (
                      <li
                        key={m._id}
                        className="flex justify-between items-center bg-white border rounded px-3 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleSelectMemberFromList(m)}
                        title="Click to select this member"
                      >
                        <span className="text-sm text-gray-800">
                          {`${m.name || ""}, ${m.email || ""}, ${m.mobileNumber || ""}`}
                        </span>
                        <span className="text-xs text-gray-500">{m.SeniorityID ? `ID: ${m.SeniorityID}` : ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="saluation"
                className="block font-medium text-gray-800"
              >
                Salutation
              </label>
              <input
                id="saluation"
                value={memberData?.saluation || ""}
                readOnly
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium text-gray-800">
                Name
              </label>
              <input
                id="name"
                value={memberData?.name || ""}
                readOnly
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-medium text-gray-800"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={memberData?.email || ""}
                readOnly
                className="w-full border p-2"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dateofbirth"
                className="block font-medium text-gray-800"
              >
                Date of Birth
              </label>
              <input
                id="dateofbirth"
                value={
                  memberData?.dateofbirth
                    ? new Date(memberData.dateofbirth).toLocaleDateString(
                        "en-GB"
                      ) // DD/MM/YYYY
                    : ""
                }
                readOnly
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="fatherName"
                className="block font-medium text-gray-800"
              >
                Father/Spouse Name
              </label>
              <input
                id="fatherName"
                value={memberData?.fatherName || ""}
                readOnly
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="project"
                className="block font-medium text-gray-800"
              >
                Project
              </label>
              <textarea
                type="text"
                readOnly
                id="project"
                value={memberData?.propertyDetails?.projectName || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="propertySize"
                className="block font-medium text-gray-800"
              >
                Property Size
              </label>
              <input
                id="propertySize"
                value={
                  memberData?.propertyDetails?.length &&
                  memberData?.propertyDetails?.breadth
                    ? `${memberData.propertyDetails.length}X${memberData.propertyDetails.breadth}`
                    : ""
                }
                readOnly
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contactAddress"
                className="block font-medium text-gray-800"
              >
                Contact Address
              </label>
              <textarea
                type="text"
                readOnly
                id="contactAddress"
                value={memberData?.contactAddress || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="permanentAddress"
                className="block font-medium text-gray-800"
              >
                Permanent Address
              </label>
              <textarea
                type="text"
                readOnly
                id="permanentAddress"
                value={memberData?.permanentAddress || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workingAddress"
                className="block font-medium text-gray-800"
              >
                Working Address
              </label>
              <textarea
                type="text"
                readOnly
                id="workingAddress"
                value={memberData?.workingAddress || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="nomineeName"
                className="block font-medium text-gray-800"
              >
                Nominee Name
              </label>
              <textarea
                type="text"
                readOnly
                id="nomineeName"
                value={memberData?.nomineeName || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="nomineeAge"
                className="block font-medium text-gray-800"
              >
                Nominee Age
              </label>
              <textarea
                type="text"
                readOnly
                id="nomineeAge"
                value={memberData?.nomineeAge || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nomineeAddress"
                className="block font-medium text-gray-800"
              >
                Nominee Address
              </label>
              <textarea
                type="text"
                readOnly
                id="nomineeAddress"
                value={memberData?.nomineeAddress || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nomineeRelation"
                className="block font-medium text-gray-800"
              >
                Nominee Relation
              </label>
              <textarea
                type="text"
                readOnly
                id="nomineeRelation"
                value={memberData?.nomineeRelation || ""}
                className="block border font-medium text-gray-800 p-2"
              />
            </div>
          </div>
        </div>
        {/* To Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">Plot Transfer To</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="transferDate"
                className="block font-medium text-gray-800"
              >
                Transfer Date
              </label>
              <div className="relative">
                <input
                  id="transferDate"
                  type="date"
                  className="w-full border p-2"
                  name="transferDate"
                  value={toMember.transferDate}
                  onChange={handleInputChange}
                />
                <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />{" "}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toSaluation"
                className="block font-medium text-gray-800"
              >
                Salutation
              </label>
              <input
                id="toSaluation"
                name="saluation"
                value={toMember.saluation}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toName"
                className="block font-medium text-gray-800"
              >
                Name*
              </label>
              <input
                id="toName"
                name="name"
                value={toMember.name}
                onChange={handleInputChange}
                className="w-full border p-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toEmail"
                className="block font-medium text-gray-800"
              >
                Email
              </label>
              <input
                id="toEmail"
                type="email"
                name="email"
                value={toMember.email}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toMobileNumber"
                className="block font-medium text-gray-800"
              >
                Mobile Number*
              </label>
              <input
                id="toMobileNumber"
                name="mobileNumber"
                value={toMember.mobileNumber}
                onChange={handleInputChange}
                className="w-full border p-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toDateofbirth"
                className="block font-medium text-gray-800"
              >
                Date of Birth
              </label>
              <input
                id="toDateofbirth"
                type="date"
                name="dateofbirth"
                value={toMember.dateofbirth}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toFatherName"
                className="block font-medium text-gray-800"
              >
                Father/Spouse Name
              </label>
              <input
                id="toFatherName"
                name="fatherName"
                value={toMember.fatherName}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="toContactAddress"
                className="block font-medium text-gray-800"
              >
                Contact Address
              </label>
              <textarea
                id="toContactAddress"
                name="contactAddress"
                value={toMember.contactAddress}
                onChange={handleInputChange}
                className="h-24 w-full resize-none border p-2"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="toPermanentAddress"
                className="block font-medium text-gray-800"
              >
                Permanent Address
              </label>
              <textarea
                id="toPermanentAddress"
                name="permanentAddress"
                value={toMember.permanentAddress}
                onChange={handleInputChange}
                className="h-24 w-full resize-none border p-2"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="toWorkingAddress"
                className="block font-medium text-gray-800"
              >
                Working Address
              </label>
              <textarea
                id="toWorkingAddress"
                name="workingAddress"
                value={toMember.workingAddress}
                onChange={handleInputChange}
                className="h-24 w-full resize-none border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toNomineeName"
                className="block font-medium text-gray-800"
              >
                Nominee Name
              </label>
              <input
                id="toNomineeName"
                name="nomineeName"
                value={toMember.nomineeName}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toNomineeAge"
                className="block font-medium text-gray-800"
              >
                Nominee Age
              </label>
              <input
                id="toNomineeAge"
                name="nomineeAge"
                type="number"
                value={toMember.nomineeAge}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="toNomineeRelation"
                className="block font-medium text-gray-800"
              >
                Nominee Relation
              </label>
              <input
                id="toNomineeRelation"
                name="nomineeRelation"
                value={toMember.nomineeRelation}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="toNomineeAddress"
                className="block font-medium text-gray-800"
              >
                Nominee Address
              </label>
              <textarea
                id="toNomineeAddress"
                name="nomineeAddress"
                value={toMember.nomineeAddress}
                onChange={handleInputChange}
                className="h-24 w-full resize-none border p-2"
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label
                htmlFor="reason"
                className="block font-medium text-gray-800"
              >
                Reason for Transfer*
              </label>
              <textarea
                id="reason"
                name="reason"
                value={toMember.reason}
                onChange={handleInputChange}
                className="h-24 w-full resize-none border p-2"
                required
              />
            </div>
          </div>

          <div className="mb-6 mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Member Photo
            </label>
            <input
              type="file"
              name="memberPhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Member Signature
            </label>
            <input
              type="file"
              name="memberSign"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>

          <div className="mt-6">
            <button
              className="bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlotTransferForm;
