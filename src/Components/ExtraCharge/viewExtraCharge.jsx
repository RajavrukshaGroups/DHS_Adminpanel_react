import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const ViewExtraCharge = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/receipt/collect-all-extrachargehistory")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data", err);
      });
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">View Extra Charges</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Project Details</th>
              <th className="border p-2">Member Name</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Total Ex.Amount</th>
              <th className="border p-2">Payment Mode</th>
              <th className="border p-2">Reference ID</th>
              <th className="border p-2">Paid Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.paymentId}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 whitespace-pre-line text-center">
                  Seniority ID: {item.SeniorityID || ""} <br />
                  Project Name: {item.projectName || ""} <br />
                  Property Size: {item.plotDimension || ""}
                </td>
                <td className="border p-2 text-center">
                  {item.memberName || ""}
                </td>
                <td className="border p-2 capitalize text-center">
                  {item.otherCharges || ""}
                </td>

                <td className="border p-2 text-center">
                  {item.amount.toLocaleString("en-IN")}/-
                </td>
                <td className="border p-2 capitalize text-center">
                  {item.paymentMode || ""}
                </td>
                <td className="border p-2 text-center">
                  {item.transactionId ||
                    item.chequeNumber ||
                    item.ddNumber ||
                    "-"}
                </td>
                <td className="border p-2 text-center">
                  {formatDate(item.date)}
                </td>
                <td className="border p-2 text-center">
                  <FaEdit className="text-blue-600 cursor-pointer inline-block text-center" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewExtraCharge;
