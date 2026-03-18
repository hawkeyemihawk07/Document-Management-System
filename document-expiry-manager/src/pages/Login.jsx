import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between rounded-[32px] bg-slate-900 p-10 text-white shadow-[0_30px_100px_-30px_rgba(15,23,42,0.8)] lg:flex">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-200">
              Document command center
            </p>
            <h1 className="mt-6 text-5xl leading-tight text-white">
              Keep every renewal date in one calm, clear workspace.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
              Track passports, insurance, licenses, subscriptions, and other
              deadlines with a cleaner dashboard and faster follow-through.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Early alerts", "See expiring items before they become urgent."],
              ["Clear records", "Store numbers, issuers, and costs together."],
              ["Daily focus", "Search and filter everything in seconds."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur"
              >
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel mx-auto w-full max-w-xl p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-teal-600 text-white shadow-lg">
              <HiOutlineLockClosed className="h-8 w-8" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
              Welcome back
            </p>
            <h2 className="mt-3 text-4xl text-slate-900">Sign in</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Access your renewal timeline, records, and document reminders.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineMail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-shell pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-shell pl-11"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="action-primary w-full"
            >
              {loading ? "Signing in..." : "Open dashboard"}
            </button>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-center text-sm text-slate-500">
              <div className="mb-3 flex items-center justify-between gap-4 text-left">
                <label
                  htmlFor="remember-me"
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-medium text-teal-700 transition hover:text-teal-800"
                >
                  Forgot password?
                </Link>
              </div>
              Need an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-teal-700 transition hover:text-teal-800"
              >
                Create one here
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
