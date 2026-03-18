import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  HiOutlinePhone,
  HiOutlineX,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const WhatsAppVerification = ({ isOpen, onClose, onVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone, otp, verified
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendOTP = async () => {
    if (!phoneNumber) {
      toast.error("Please enter phone number");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/whatsapp/send-otp", {
        phoneNumber,
      });
      setStep("otp");
      toast.success("OTP sent to your WhatsApp!");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/whatsapp/verify-otp", {
        phoneNumber,
        otp,
      });
      setStep("verified");
      onVerified(phoneNumber);
      toast.success("WhatsApp verified successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {step === "phone" && "Verify WhatsApp Number"}
                {step === "otp" && "Enter OTP"}
                {step === "verified" && "Verified!"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            {step === "phone" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter your WhatsApp number to receive expiry reminders
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlinePhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter the 6-digit OTP sent to {phoneNumber}
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength="6"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest"
                />
                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={() => setStep("phone")}
                  className="w-full text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change phone number
                </button>
              </div>
            )}

            {step === "verified" && (
              <div className="text-center py-4">
                <HiOutlineCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  WhatsApp Verified!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  You'll now receive reminders on WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppVerification;
