import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="  bg-black mt-auto h-auto relative">
      <div className="flex items-center gap-3.5  mx-auto p-2  text-white ">
        <Link className="flex text text-white text-justify" href="/">
          TT Website
        </Link>
        {/* use link instead of router , two is a same, but Link will be convinent (Link is a component from React) */}
        {user && user.role === "Lecturer" && (
          <>
            <Link
              className="flex border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300"
              href="/Lecturepage"
            >
              View Application
            </Link>
            <Link
              className="flex border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300"
              href="/Leaderboard"
            >
              Leaderboard
            </Link>
            <Link
              className="flex border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300"
              href="/profile"
            >
              Profile
            </Link>
          </>
        )}

        {user && user.role === "Tutor" && (
          <>
            <Link
              className="flex border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300"
              href="/Tutorpage"
            >
              Apply
            </Link>
            <Link
              className="flex border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300"
              href="/profile"
            >
              Profile
            </Link>
          </>
        )}

        {user ? (
          <div className="flex items-center gap-3.5 ml-auto">
            <div className="text-xs text-white ">
              {user.email}!
            </div>
            <button
              className="border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300 float-right"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              className="flex border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300 ml-auto"
              href="/signup"
            >
              Sign-up
            </Link>
            <Link
              className="border py-1 px-2 rounded hover:bg-amber-700 hover:text-amber-50 hover:duration-300 float-right"
              href="/login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
