import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar({ menuItems }) {
  const authContext = useAuth();
  const { user, logout } = authContext || {};

  return (
    <div className="hidden flex-none lg:block">
      <ul className="menu menu-horizontal items-center">
        {menuItems.map((item) => (
          <li key={item.name} className="flex items-center">
            <a
              href={item.path}
              className="flex items-center text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors duration-200"
            >
              {item.name}
            </a>
          </li>
        ))}
        {/* UPP Dropdown */}
        <li className="flex items-center">
          <details className="flex items-center">
            <summary className="btn btn-ghost flex items-center px-4 py-2 text-white hover:text-blue-200 dark:hover:text-blue-300 hover:bg-white/10 dark:hover:bg-white/20 transition-all duration-200">
              UPP
            </summary>
            <ul className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-none p-2 dropdown-content right-0 mt-3 w-40 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <li>
                <Link
                  href="/upp/anak"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Anak
                </Link>
              </li>
              <li>
                <Link
                  href="/upp/pemuda"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Pemuda
                </Link>
              </li>
            </ul>
          </details>
        </li>
        {/* Profile Dropdown */}
        <li className="flex items-center">
          {user ? (
            <details className="flex items-center">
              <summary className="btn btn-ghost btn-circle avatar flex items-center hover:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200">
                <div className="w-10 rounded-full">
                  <img
                    alt="Profile"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </summary>
              <ul className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-none p-2 dropdown-content right-0 mt-3 w-52 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <li>
                  <Link
                    className="justify-between hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    href="/user"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <a
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    onClick={async () => {
                      if (logout) {
                        await logout();
                      } else {
                        await supabase.auth.signOut();
                      }
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </details>
          ) : (
            <Link
              className="border border-green-500 dark:border-green-400 rounded-full text-green-500 dark:text-green-400 hover:bg-green-500 dark:hover:bg-green-400 hover:text-white dark:hover:text-gray-900 px-4 py-1 font-bold flex items-center transition-all duration-200"
              href="/login"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}