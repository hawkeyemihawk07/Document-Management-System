import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineHome,
} from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-teal-600 text-white shadow-lg">
            <HiOutlineHome className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400">
              Renewal Desk
            </span>
            <span className="block text-lg font-semibold text-slate-900">
              DocManager
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/calendar"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            title="Calendar"
          >
            <HiOutlineCalendar className="h-5 w-5" />
          </Link>

          <Link
            to="/profile"
            className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 sm:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
              <HiOutlineUser className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">
                Signed in
              </span>
              <span className="block max-w-32 truncate text-sm font-medium">
                {user?.name || "Guest"}
              </span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            title="Logout"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
