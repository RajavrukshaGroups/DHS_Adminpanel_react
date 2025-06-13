// import Image from "next/image"
import { MapPin, Globe, Mail, Phone } from "lucide-react";

export default function SiteBookingConfirmation({ member, onBack }) {
  const { userId } = member || {};
  return (
    <div className="mt-5 max-w-4xl mx-auto border border-gray-300 shadow-sm bg-white">
      <img
        src="https://adminpanel.defencehousingsociety.com/img/letterheader.jpg"
        alt=""
      />

      {/* Document reference numbers */}
      <div className="flex justify-between px-6 py-3 border-b border-gray-300 text-sm">
        <div>DHS/DHD/{userId?.ReceiptNo || "XXXX"}/2024-2025</div>
        <div>
          {new Date(member.createdAt).toLocaleDateString() || "Invalid Date"}
        </div>
      </div>

      {/* Document title */}
      <div className="text-center py-4">
        <h2 className="text-xl font-bold underline">
          SITE BOOKING CONFIRMATION
        </h2>
      </div>

      {/* Main content */}
      <div className="px-6 py-2 text-sm leading-relaxed">
        <p className="mb-4">
          This is to confirm that{" "}
          <span className="font-semibold">
            {userId?.saluation || "Mr./Ms."} {userId?.name}
          </span>{" "}
          residing at <strong>{userId?.contactAddress}</strong> booked a site of
          measuring {member?.propertyDetails?.length || "40"}X
          {member?.propertyDetails?.width || "60"} (Rate per SQFT Rs. 1399/-) on
          this day of {new Date(member.createdAt).toLocaleDateString()} in the
          proposed "Defence Habitat - Marasandra". You have booked your site by
          paying an initial amount of{" "}
          <strong>Rs. {userId?.Amount || "200000"}/-</strong> by way of
          netbanking. Receipt number is <strong>{userId?.ReceiptNo}</strong>,
          Membership No. <strong>{userId?.MembershipNo || "XXXX"}</strong>,
          Seniority Number <strong>{userId?.SeniorityID}</strong>.
        </p>

        <p className="font-semibold mb-2">
          The site is booked under the following conditions:
        </p>

        <ol className="list-decimal pl-6 text-sm space-y-2 mb-4">
          <li>
            The booking of your site is purely based on rules and regulations of
            the society and provisions of Karnataka Co-operative registration
            act and the rules and By-laws of the society.
          </li>
          <li>
            The allotment of site is subject to approval of membership /
            associate membership, clearance of land by concerned authority and
            subject to availability of the site.
          </li>
          <li>
            Sites will be allotted on a first come first serve basis and
            Conditions mentioned behind the application will be applicable.
            Seniority number may change, in case of failing to pay the
            installment amount in time.
          </li>
          <li>
            Withdrawals or transfers of membership / bookings are only after the
            completion of the project period. Any withdrawal before completion
            of the project will be liable for penalty and interest will not be
            paid for any withdrawals of site advances.
          </li>
          <li>
            All the remaining payments should be paid as per Defence Habitat
            Housing co-operative Society Norms. Bank loans will be arranged from
            leading banks after the plan approval.
          </li>
          <li>
            Installment amount should be paid within 6 to 8 months from the date
            of booking confirmation.
          </li>
          <li>Corner/Commercial plots will be charged extra.</li>
          <li>
            Any issues that arise in the process of completion of the project
            should be resolved in the General Body Meeting.
          </li>
          <li>
            As per rules & regulations of Karnataka Co-Operative Department, the
            paid amount will be refundable in case of project failure.
          </li>
        </ol>
      </div>
      <div className="text-center py-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to List
        </button>
      </div>

      <img
        src="https://adminpanel.defencehousingsociety.com/img/footerSign.jpg"
        alt=""
      />
    </div>
  );
}
