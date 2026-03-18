import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { createDemoPasswordReset } from "../utils/passwordResetStorage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoResetLink, setDemoResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/password-reset/forgot-password", { email });
      setDemoResetLink("");
      setSubmitted(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      const demoReset = createDemoPasswordReset(email);

      if (demoReset) {
        setDemoResetLink(
          `${window.location.origin}/reset-password/${demoReset.token}`,
        );
        setSubmitted(true);
        toast.success("Demo reset link created. Open it below to continue.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to send reset email",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center  from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The link will expire in 1 hour. If you don't see the email, check
            your spam folder.
          </p>
          {demoResetLink && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
              <p className="text-sm font-medium text-amber-900">
                Demo mode reset link
              </p>
              <a
                href={demoResetLink}
                className="mt-2 block break-all text-sm text-indigo-600 hover:text-indigo-500"
              >
                {demoResetLink}
              </a>
            </div>
          )}
          <Link
            to="/login"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <HiOutlineArrowLeft className="mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-center text-gray-600 mb-8">
              No worries! Enter your email and we'll send you reset
              instructions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
