import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { createStoredDocument, normalizeDocumentPayload } from "../utils/documentStorage";

const categories = [
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "insurance", label: "Insurance" },
  { value: "vehicle_puc", label: "Vehicle PUC" },
  { value: "emi", label: "EMI" },
  { value: "property_tax", label: "Property Tax" },
  { value: "fd_maturity", label: "FD Maturity" },
  { value: "warranty", label: "Warranty" },
  { value: "subscription", label: "Subscription" },
  { value: "other", label: "Other" },
];

const AddDocument = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    issuingAuthority: "",
    documentNumber: "",
    issueDate: "",
    expiryDate: "",
    cost: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/documents", normalizeDocumentPayload(formData));
      toast.success("Document added successfully!");
      navigate("/dashboard");
    } catch {
      createStoredDocument(formData);
      toast.success("Document added locally. Backend is unavailable.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel overflow-hidden">
          <div className="bg-slate-900 px-6 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.26em] text-teal-200">
              New record
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Add New Document
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Capture the important details once so renewals stay easy later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="field-shell"
                  placeholder="e.g., Indian Passport"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="field-shell"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document Number
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className="field-shell"
                  placeholder="e.g., PAS123456"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={handleChange}
                  className="field-shell"
                  placeholder="e.g., Regional Passport Office"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="issueDate"
                  required
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="field-shell"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  required
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="field-shell"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Renewal Cost (Rs)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="field-shell"
                  placeholder="e.g., 5000"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  className="field-shell min-h-28 py-3"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="action-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="action-primary">
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  "Add Document"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocument;
