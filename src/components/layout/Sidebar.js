import { Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar({
  menuItems,
  uppItems = [],
  uppLoading = false,
}) {
  const authContext = useAuth();
  const { user, logout } = authContext || {};
  const router = useRouter();

  // Check if current route is a role-based dashboard page
  const isInDashboard =
    router.pathname.startsWith("/admin") ||
    router.pathname.startsWith("/jemaat") ||
    router.pathname.startsWith("/majelis") ||
    router.pathname.startsWith("/employee");

  const handleLogout = async () => {
    // Close sidebar first
    document.getElementById("my-drawer-3").checked = false;

    if (logout) {
      await logout();
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="drawer-side z-[60]">
      <label
        aria-label="close sidebar"
        className="drawer-overlay"
        htmlFor="my-drawer-3"
      />
      <ul className="menu bg-white dark:bg-gray-800 min-h-full w-80 p-4 transition-colors duration-300">
        <div className="mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          <p className="font-extrabold text-2xl">GMIT Imanuel</p>
          <p className="text-2xl">Oepura</p>
        </div>
        {menuItems.map((item) => (
          <li key={item.name}>
            <a
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              href={item.path}
            >
              {item.name}
            </a>
          </li>
        ))}
        <h2 className="text-gray-900 dark:text-white font-semibold mt-6 mb-2 transition-colors duration-300">
          UPP
        </h2>
        <ul>
          {uppLoading ? (
            <li className="text-center py-2">
              <span className="loading loading-spinner loading-sm" />
            </li>
          ) : uppItems.length > 0 ? (
            uppItems.map((item) => (
              <li key={item.id}>
                <Link
                  className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                  href={`/upp/${item.nama.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.nama}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-center py-2 text-gray-500 dark:text-gray-400">
              No items available
            </li>
          )}
        </ul>

        {/* User Authentication Section */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          {user ? (
            <>
              {/* User Profile Section */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                    {user.avatar_url ? (
                      <img
                        alt="Profile"
                        className="w-full h-full object-cover"
                        src={user.avatar_url}
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.nama || user.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {user.role?.toLowerCase() || "User"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {!isInDashboard && (
                  <Link
                    className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 p-3 rounded-lg"
                    href={`/${user?.role?.toLowerCase() || "admin"}/dashboard`}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                )}

                <Link
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 p-3 rounded-lg"
                  href={`/${user?.role?.toLowerCase() || "admin"}/profile`}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profil
                </Link>

                <button
                  className="w-full flex items-center text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 p-3 rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <Link
              className="flex items-center justify-center bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-200 p-3 rounded-lg font-medium"
              href="/login"
            >
              <User className="w-4 h-4 mr-2" />
              Masuk / Login
            </Link>
          )}
        </div>
      </ul>
    </div>
  );
}
