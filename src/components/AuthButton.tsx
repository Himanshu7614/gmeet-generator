"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut, User } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{session.user?.name}</p>
            <p className="text-sm text-gray-600">{session.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Welcome to Meeting Scheduler
      </h2>
      <p className="text-gray-600 mb-6">
        Sign in with Google to create instant meetings and schedule future
        meetings
      </p>
      <button
        onClick={() => signIn("google")}
        className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <LogIn className="w-5 h-5" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
