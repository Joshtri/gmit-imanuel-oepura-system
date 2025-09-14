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
            <a href={item.path} className="flex items-center">{item.name}</a>
          </li>
        ))}
        {/* UPP Dropdown */}
        <li className="flex items-center">
          <details className="flex items-center">
            <summary className="btn btn-ghost flex items-center px-4 py-2">
              UPP
            </summary>
            <ul className="bg-base-100 rounded-t-none p-2 dropdown-content right-0 mt-3 w-40 shadow">
              <li>
                <Link href="/upp/anak">Anak</Link>
              </li>
              <li>
                <Link href="/upp/pemuda">Pemuda</Link>
              </li>
            </ul>
          </details>
        </li>
        {/* Profile Dropdown */}
        <li className="flex items-center">
          {user ? (
            <details className="flex items-center">
              <summary className="btn btn-ghost btn-circle avatar flex items-center">
                <div className="w-10 rounded-full">
                  <img
                    alt="Profile"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </summary>
              <ul className="bg-base-100 rounded-t-none p-2 dropdown-content right-0 mt-3 w-52 shadow">
                <li>
                  <Link className="justify-between" href="/user">Profile
                  </Link>
                </li>
                <li>
                  <a
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
              className="border border-success rounded-full text-success px-4 py-1 font-bold flex items-center"
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