import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

// Header navigation bar component
export function Header() {
  // Get user info and logout function from authentication context
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-black mt-auto h-auto relative">
      <div className="flex items-center gap-3.5 mx-auto p-2 text-white ">
        {/* Home link */}
        <Link className="flex text text-white text-justify" href="/">
          Mini App
        </Link>
        {/* Login link (disabled if logged in) */}
        <Link
          href="/loginForAdmin"
          className={`border rounded py-1 px-2 flex text text-white text-justify ${user ? "pointer-events-none opacity-50" : ""}`}
        >
          Login
        </Link>

        {/* Show these links only if user is logged in */}
        {user && (
          <>
            {/* Logout button */}
            <button
              onClick={logout}
              className="border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300 float-right"
            >
              Logout
            </button>
            {/* Manage Candidate link (disabled if already on that page) */}
            <Link
              href="/ManageCandidate"
              className={`border rounded py-1 px-2 flex text text-white text-justify ${router.pathname === "/ManageCandidate" ? "pointer-events-none opacity-50" : ""}`}
            >
              Manage Candidate
            </Link>
            {/* Main Content link (disabled if already on that page) */}
            <Link
              href="/mainContent"
              className={`border rounded py-1 px-2 flex text text-white text-justify ${router.pathname === "/mainContent" ? "pointer-events-none opacity-50" : ""}`}
            >
              Main Content
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}