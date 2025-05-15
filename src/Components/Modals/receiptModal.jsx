// components/ReceiptModal.jsx
import React from "react";

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-[750px] rounded-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">
          ✖
        </button>
        <div className="text-center font-bold text-lg mb-2">
          DEFENCE HABITAT HOUSING CO-OPERATIVE SOCIETY LTD.
        </div>
        <p className="text-center text-sm mb-4">
          Behind Swathi Garden Hotel, E-Block, Sahakar Nagar, Bangalore – 560092
          <br />
          Mobile: +91 7026147770
        </p>

        <div className="flex justify-between mb-2">
          <div>
            <span className="font-bold">No:</span> {receipt.receiptNo}
          </div>
          <div>
            <span className="font-bold">Date:</span>{" "}
            {new Date(receipt.date).toLocaleDateString("en-GB")}
          </div>
        </div>

        <div className="mb-2">
          <span className="font-bold">Received from Smt/Sri:</span>{" "}
          {receipt.member?.name}
        </div>
        <div className="mb-2">
          <span className="font-bold">Address:</span>{" "}
          {receipt.member?.propertyDetails?.address || "-"}
        </div>
        <div className="mb-2">
          <span className="font-bold">Rupees:</span>{" "}
          {Number(receipt.amount).toLocaleString("en-IN")} Only
        </div>

        <div className="mb-4">
          <span className="font-bold">Membership Fee:</span> ₹
          {Number(receipt.amount).toLocaleString("en-IN")}
        </div>

        <table className="w-full text-sm border border-collapse border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">S.No</th>
              <th className="border px-2 py-1 text-left">Particulars</th>
              <th className="border px-2 py-1 text-left">Rs.</th>
              <th className="border px-2 py-1 text-left">Ps.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">1</td>
              <td className="border px-2 py-1">Membership Fee</td>
              <td className="border px-2 py-1">₹{receipt.amount}</td>
              <td className="border px-2 py-1">00</td>
            </tr>
            {/* Add more rows based on actual receipt breakdown */}
            <tr>
              <td colSpan="2" className="border px-2 py-1 font-bold">
                Total
              </td>
              <td className="border px-2 py-1 font-bold">₹{receipt.amount}</td>
              <td className="border px-2 py-1">00</td>
            </tr>
          </tbody>
        </table>

        {/* <div className="mt-4 text-right">
          <p>President / Secretary</p>
          <img src="/signature.png" alt="signature" className="h-10 inline" />
        </div> */}
      </div>
    </div>
  );
};

export default ReceiptModal;
