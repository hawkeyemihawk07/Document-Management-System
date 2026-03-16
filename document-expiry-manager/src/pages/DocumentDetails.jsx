import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const DocumentDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">Document Details</h1>
          <p className="mt-3 text-gray-600">
            Details for document <span className="font-medium">{id}</span> are
            not implemented yet.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex mt-6 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DocumentDetails;
