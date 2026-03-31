import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { differenceInDays, isBefore } from "date-fns";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import DocumentCard from "../components/DocumentCard";
import {
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineExclamation,
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { getStoredDocuments, removeStoredDocument } from "../utils/documentStorage";
import {
  getDocumentExpiryDate,
  getSearchableDocumentValue,
  normalizeDocuments,
} from "../utils/documentRecords";

const FILTER_TYPES = {
  ALL: "all",
  ACTIVE: "active",
  EXPIRING: "expiring",
  EXPIRED: "expired",
};

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/documents");
        setDocuments(normalizeDocuments(response.data));
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments(getStoredDocuments());
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const stats = useMemo(() => {
    const today = new Date();

    const expiringSoon = documents.filter((doc) => {
      const expiryDate = getDocumentExpiryDate(doc);
      if (!expiryDate) {
        return false;
      }

      const daysLeft = differenceInDays(expiryDate, today);
      return daysLeft <= 30 && daysLeft > 0;
    }).length;

    const expired = documents.filter((doc) => {
      const expiryDate = getDocumentExpiryDate(doc);
      return expiryDate ? isBefore(expiryDate, today) : false;
    }).length;

    const monthlyCost = documents
      .filter((doc) => {
        const expiryDate = getDocumentExpiryDate(doc);
        if (!expiryDate) {
          return false;
        }

        const daysLeft = differenceInDays(expiryDate, today);
        return daysLeft <= 30 && daysLeft > 0;
      })
      .reduce((sum, doc) => sum + (doc.cost || 0), 0);

    return {
      total: documents.length,
      expiringSoon,
      expired,
      monthlyCost,
    };
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const today = new Date();
      const expiryDate = getDocumentExpiryDate(doc);
      const daysLeft = expiryDate ? differenceInDays(expiryDate, today) : null;

      switch (filter) {
        case FILTER_TYPES.ACTIVE:
          if (daysLeft === null || daysLeft <= 30) return false;
          break;
        case FILTER_TYPES.EXPIRING:
          if (daysLeft === null || daysLeft > 30 || daysLeft <= 0) return false;
          break;
        case FILTER_TYPES.EXPIRED:
          if (daysLeft === null || daysLeft > 0) return false;
          break;
        default:
          break;
      }

      if (searchTerm) {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        return (
          getSearchableDocumentValue(doc.title).includes(normalizedSearchTerm) ||
          getSearchableDocumentValue(doc.category).includes(
            normalizedSearchTerm,
          ) ||
          getSearchableDocumentValue(doc.documentNumber).includes(
            normalizedSearchTerm,
          ) ||
          getSearchableDocumentValue(doc.issuingAuthority).includes(
            normalizedSearchTerm,
          )
        );
      }

      return true;
    });
  }, [documents, filter, searchTerm]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`/api/documents/${id}`);
        setDocuments((currentDocuments) =>
          currentDocuments.filter((doc) => doc._id !== id),
        );
      } catch (error) {
        console.error("Error deleting document:", error);
        const nextDocuments = removeStoredDocument(id);
        setDocuments(nextDocuments);
      }
    }
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="app-shell min-h-screen">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel relative mb-8 overflow-hidden p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            Portfolio overview
          </p>
          <h1 className="mt-3 text-4xl text-slate-900">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Here is a sharper view of your document health, upcoming renewals,
            and the items that need attention first.
          </p>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Documents"
            value={stats.total}
            icon={HiOutlineDocumentText}
            color="blue"
          />
          <StatCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={HiOutlineClock}
            color="yellow"
          />
          <StatCard
            title="Expired"
            value={stats.expired}
            icon={HiOutlineExclamation}
            color="red"
          />
          <StatCard
            title="Monthly Cost"
            value={`Rs ${stats.monthlyCost.toLocaleString("en-IN")}`}
            icon={HiOutlineCurrencyDollar}
            color="green"
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button onClick={() => navigate("/add-document")} className="action-primary">
            <HiOutlinePlus className="mr-2 h-5 w-5" />
            Add Document
          </button>
          <button onClick={() => navigate("/calendar")} className="action-secondary">
            <HiOutlineCalendar className="mr-2 h-5 w-5" />
            View Calendar
          </button>
        </div>

        <div className="glass-panel mb-6 p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <HiOutlineSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="field-shell pl-11 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <HiOutlineX className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.values(FILTER_TYPES).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`rounded-full px-4 py-2 capitalize whitespace-nowrap transition ${
                    filter === filterType
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filterType}
                  {filterType === FILTER_TYPES.EXPIRING &&
                    stats.expiringSoon > 0 && (
                      <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-teal-700">
                        {stats.expiringSoon}
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          {searchTerm && (
            <div className="mt-2 text-sm text-slate-500">
              Found {filteredDocs.length} document
              {filteredDocs.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {filteredDocs.length === 0 ? (
          <div className="glass-panel py-14 text-center">
            <HiOutlineDocumentText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-lg font-medium text-slate-900">
              {searchTerm
                ? "No matching documents found"
                : filter !== FILTER_TYPES.ALL
                  ? `No ${filter} documents`
                  : "No documents"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {searchTerm
                ? "Try adjusting your search or filter"
                : "Get started by adding a new document."}
            </p>
            {(searchTerm || filter !== FILTER_TYPES.ALL) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {searchTerm && (
                  <button onClick={clearSearch} className="action-secondary">
                    Clear Search
                  </button>
                )}
                {filter !== FILTER_TYPES.ALL && (
                  <button
                    onClick={() => setFilter(FILTER_TYPES.ALL)}
                    className="action-secondary"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={() => navigate("/add-document")}
                  className="action-primary"
                >
                  <HiOutlinePlus className="mr-2 h-5 w-5" />
                  Add Document
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-500">
              Showing {filteredDocs.length} of {documents.length} documents
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  onDelete={handleDelete}
                  onClick={() => navigate(`/document/${doc._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
