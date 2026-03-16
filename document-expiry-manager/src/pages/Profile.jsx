import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <div className="mt-6 space-y-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user?.name || "Guest User"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email || "Not available"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
