import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const ExtraChargeFormDetails = () => {
  const [seniorityId, setSeniorityId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [seniorityIdOptions, setSeniorityIdOptions] = useState([]);
  const [memberData, setMemberData] = useState(null);

  const [paymentMode, setPaymentMode] = useState(""); // NEW
  const [paymentType, setPaymentType] = useState("Extra Charge");
  const [otherCharges, setOtherCharges] = useState("");
  const [formFields, setFormFields] = useState({
    chequeNumber: "",
    bankName: "",
    branchName: "",
    transactionId: "",
    ddNumber: "",
    amount: "",
  });

  useEffect(() => {
    const fetchSeniorityIds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/member/collect-seniorityIds"
        );
        if (response.data.success) {
          const options = response.data.SeniorityIds.map((id) => ({
            value: id,
            label: id,
          }));
          setSeniorityIdOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch Seniority IDs:", error);
      }
    };

    fetchSeniorityIds();
  }, []);

  const handleSubmitSeniority = async () => {
    if (!seniorityId?.value) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/member/member-info-seniority-id?SeniorityID=${seniorityId.value}`
      );

      if (response.data.success) {
        setMemberData(response.data.member);
        setShowForm(true);
      } else {
        setShowForm(false);
        setMemberData(null);
        alert("No member found with the selected Seniority ID.");
      }
    } catch (error) {
      console.error("Error fetching member info:", error);
      alert("Server error while fetching member info.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSeniorityId(null);
    setMemberData(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>

        {/* Searchable Seniority ID */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Enter or Select Seniority ID
          </label>
          <div className="flex gap-2 items-center">
            <div className="flex-grow">
              <Select
                options={seniorityIdOptions}
                value={seniorityId}
                onChange={setSeniorityId}
                placeholder="Search or select Seniority ID"
                isClearable
                className="text-sm"
                noOptionsMessage={() => "No match found"}
              />
            </div>

            <button
              onClick={handleSubmitSeniority}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enter
            </button>

            {showForm && (
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Conditional Member Info */}
        {showForm && memberData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={memberData.name || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={memberData.mobileNumber || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email ID</label>
                <input
                  type="email"
                  value={memberData.email || ""}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Residence/Contact Address
              </label>
              <input
                type="text"
                value={memberData.permanentAddress || ""}
                readOnly
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Extra Charges Form */}
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Extra Charges Details
        </h1>

        {showForm && (
          <>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Payment Type</label>
              <input
                type="text"
                value={paymentType}
                // onChange={(e) => setPaymentType(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                // placeholder="enter here"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                Reason for Extra Charge
              </label>
              <input
                type="text"
                value={otherCharges}
                onChange={(e) => setOtherCharges(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                placeholder="enter here"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Payment Mode</label>
              <select
                className="w-full border px-4 py-2 rounded"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="netbanking">Netbanking / UPI</option>
                <option value="dd">DD</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {paymentMode === "cheque" && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Cheque Number
                  </label>
                  <input
                    type="text"
                    value={formFields.chequeNumber}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        chequeNumber: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formFields.bankName}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formFields.branchName}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        branchName: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
              </>
            )}

            {paymentMode === "netbanking" && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Transaction Id
                  </label>
                  <input
                    type="text"
                    value={formFields.transactionId}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        transactionId: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formFields.bankName}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formFields.branchName}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        branchName: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
              </>
            )}

            {paymentMode === "dd" && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">DD Number</label>
                  <input
                    type="text"
                    value={formFields.ddNumber}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        ddNumber: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formFields.bankName}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={formFields.branchName}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        branchName: e.target.value,
                      })
                    }
                    className="w-full border px-4 py-2 rounded"
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block font-semibold mb-1">Amount</label>
              <input
                type="number"
                value={formFields.amount}
                onChange={(e) =>
                  setFormFields({
                    ...formFields,
                    amount: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded"
                placeholder="Enter amount"
                min="0"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                Submit Extra Charge
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ExtraChargeFormDetails;
