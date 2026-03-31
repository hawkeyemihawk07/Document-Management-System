import React from "react";
import { format, differenceInDays, isBefore } from "date-fns";
import {
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";
import {
  getDocumentCategoryLabel,
  getDocumentExpiryDate,
} from "../utils/documentRecords";

const categoryColors = {
  passport: "bg-violet-100 text-violet-700",
  driving_license: "bg-sky-100 text-sky-700",
  insurance: "bg-emerald-100 text-emerald-700",
  vehicle_puc: "bg-amber-100 text-amber-700",
  emi: "bg-rose-100 text-rose-700",
  property_tax: "bg-orange-100 text-orange-700",
  fd_maturity: "bg-indigo-100 text-indigo-700",
  warranty: "bg-pink-100 text-pink-700",
  subscription: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-700",
};

const DocumentCard = ({ document, onDelete, onClick }) => {
  const expiryDate = getDocumentExpiryDate(document);
  const daysLeft = expiryDate ? differenceInDays(expiryDate, new Date()) : null;
  const isExpired = expiryDate ? isBefore(expiryDate, new Date()) : false;

  const getStatusBadge = () => {
    if (!expiryDate) {
      return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Needs review
        </span>
      );
    }

    if (isExpired) {
      return (
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800">
          Expired
        </span>
      );
    }
    if (daysLeft <= 7) {
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
          Critical
        </span>
      );
    }
    if (daysLeft <= 30) {
      return (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          Warning
        </span>
      );
    }
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
        Active
      </span>
    );
  };

  return (
    <div className="glass-panel p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-28px_rgba(15,23,42,0.38)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className={`rounded-2xl p-3 ${categoryColors[document.category] || "bg-slate-100 text-slate-700"}`}
          >
            <HiOutlineDocumentText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {document.title}
            </h3>
            <span className="text-sm capitalize text-slate-500">
              {getDocumentCategoryLabel(document.category)}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex items-center text-sm text-slate-600">
          <HiOutlineCalendar className="mr-2 h-4 w-4 text-teal-700" />
          <span>
            Expires:{" "}
            {expiryDate ? format(expiryDate, "dd MMM yyyy") : "Not available"}
          </span>
        </div>

        {document.cost > 0 && (
          <div className="flex items-center text-sm text-slate-600">
            <HiOutlineCurrencyDollar className="mr-2 h-4 w-4 text-amber-600" />
            <span>Renewal Cost: Rs {document.cost}</span>
          </div>
        )}

        {document.documentNumber && (
          <p className="text-sm text-slate-500">
            Doc No: <span className="font-medium text-slate-700">{document.documentNumber}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <div className="text-sm">
          {!expiryDate ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              Missing expiry date
            </span>
          ) : !isExpired ? (
            <span className="rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-700">
              {daysLeft} days left
            </span>
          ) : (
            <span className="rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-700">
              Needs renewal
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            title="View Details"
          >
            <HiOutlineEye className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(document._id)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            title="Delete"
          >
            <HiOutlineTrash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
