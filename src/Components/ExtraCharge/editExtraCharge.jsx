import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditExtraCharge = () => {
  const { paymentId } = useParams();
  const [formData, setFormData] = useState({
    recieptNo: "",
    date: "",
    paymentMode: "",
    paymentType: "Extra Charge",
    chequeNumber: "",
    bankName: "",
    branchName: "",
    transactionId: "",
    ddNumber: "",
    otherCharges: "",
    amount: "",
  });

  //   console.log("formdata123", formData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/receipt/get-extra-charge-by-paymentid/${paymentId}`
        );
        const data = res.data;

        console.log("data-edit", data);

        setFormData({
          recieptNo: data.data.payment.receiptNo || "",
          date: data.data.payment.date?.slice(0, 10) || "",
          paymentMode: data.data.payment.paymentMode || "",
          paymentType: data.data.payment.paymentType || "Extra Charge",
          chequeNumber: data.data.payment.chequeNumber || "",
          bankName: data.data.payment.bankName || "",
          branchName: data.data.payment.branchName || "",
          transactionId: data.data.payment.transactionId || "",
          ddNumber: data.data.payment.ddNumber || "",
          otherCharges: data.data.payment.otherCharges || "",
          amount: data.data.payment.amount?.toString() || "",
        });
      } catch (error) {
        console.error("Failed to fetch extra charge:", error);
        toast.error("Failed to fetch extra charge details.");
      }
    };

    fetchData();
  }, [paymentId]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Extra Charge</h2>
      <form className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Receipt No"
          value={formData.recieptNo}
          onChange={handleInputChange("recieptNo")}
          className="border p-2"
        />
        <input
          type="date"
          value={formData.date}
          onChange={handleInputChange("date")}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Payment Mode"
          value={formData.paymentMode}
          onChange={handleInputChange("paymentMode")}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Payment Mode"
          value={formData.paymentType}
          onChange={handleInputChange("paymentType")}
          className="border p-2"
        />
        {/* Add other fields here similarly */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditExtraCharge;
