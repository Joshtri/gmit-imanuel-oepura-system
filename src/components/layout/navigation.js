import { Menu } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Navigation({ children }) {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <div className="drawer text-white">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-black/30 w-full absolute top-0 left-0 z-50">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <Menu className="w-8 h-8" />
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">
              <p className="font-extrabold text-2xl">GMIT Imanuel</p>
              <p className="text-2xl">Oepura</p>
            </div>
            <Navbar menuItems={menuItems} />
          </div>
          {/* Page content here */}
          <main>{children}</main>
        </div>
        <Sidebar menuItems={menuItems} />
      </div>
    </>
  );
}
