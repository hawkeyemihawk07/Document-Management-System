import React from "react";

const colorClasses = {
  blue: "from-sky-100 to-cyan-50 text-sky-700",
  yellow: "from-amber-100 to-yellow-50 text-amber-700",
  red: "from-rose-100 to-orange-50 text-rose-700",
  green: "from-emerald-100 to-teal-50 text-emerald-700",
  purple: "from-violet-100 to-fuchsia-50 text-violet-700",
};

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  return (
    <div className="glass-panel overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-28px_rgba(13,148,136,0.35)]">
      <div className="flex items-center">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClasses[color]}`}
        >
          {Icon ? <Icon className="h-6 w-6" /> : null}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold text-slate-900">{value}</p>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
