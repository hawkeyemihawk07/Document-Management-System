import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import Navbar from "../components/Navbar";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { getStoredDocuments } from "../utils/documentStorage";
import {
  getDocumentExpiryDate,
  normalizeDocuments,
} from "../utils/documentRecords";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("/api/documents");
        setDocuments(normalizeDocuments(response.data));
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments(getStoredDocuments());
      }
    };

    fetchDocuments();
  }, []);

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getDocumentsForDate = (date) => {
    return documents.filter((doc) => {
      const expiryDate = getDocumentExpiryDate(doc);
      return expiryDate ? isSameDay(expiryDate, date) : false;
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="app-shell min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel overflow-hidden">
          <div className="flex items-center justify-between bg-slate-900 px-6 py-5">
            <h2 className="text-3xl font-semibold text-white">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={prevMonth}
                className="rounded-full border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
              >
                <HiOutlineChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="rounded-full border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
              >
                <HiOutlineChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-3 grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayDocuments = getDocumentsForDate(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={index}
                    className={`min-h-28 rounded-2xl border p-3 transition ${
                      isToday
                        ? "border-teal-400 bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-white/70 hover:border-teal-200 hover:bg-white"
                    }`}
                  >
                    <div className="text-right">
                      <span
                        className={`text-sm ${isToday ? "font-bold text-teal-700" : "text-slate-700"}`}
                      >
                        {format(day, "d")}
                      </span>
                    </div>

                    {dayDocuments.length > 0 && (
                      <div className="mt-1">
                        {dayDocuments.slice(0, 2).map((doc) => (
                          <div
                            key={doc._id}
                            className="mb-1 truncate rounded-xl bg-amber-100 px-2 py-1 text-xs text-amber-800"
                          >
                            {doc.title}
                          </div>
                        ))}
                        {dayDocuments.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{dayDocuments.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
