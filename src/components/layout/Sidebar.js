import Link from "next/link";

export default function Sidebar({ menuItems }) {
  return (
    <div className="drawer-side z-[60]">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-white dark:bg-gray-800 min-h-full w-80 p-4 transition-colors duration-300">
        <div className="mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          <p className="font-extrabold text-2xl">GMIT Imanuel</p>
          <p className="text-2xl">Oepura</p>
        </div>
        {menuItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.path}
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            >
              {item.name}
            </a>
          </li>
        ))}
        <h2 className="text-gray-900 dark:text-white font-semibold mt-6 mb-2 transition-colors duration-300">UPP</h2>
        <ul>
          <li>
            <Link
              href="/upp/anak"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            >
              Anak
            </Link>
          </li>
          <li>
            <Link
              href="/upp/pemuda"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            >
              Pemuda
            </Link>
          </li>
        </ul>
      </ul>
    </div>
  );
}