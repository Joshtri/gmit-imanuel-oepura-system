import Link from "next/link";

export default function Sidebar({ menuItems, uppItems = [], uppLoading = false }) {
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
          {uppLoading ? (
            <li className="text-center py-2">
              <span className="loading loading-spinner loading-sm"></span>
            </li>
          ) : uppItems.length > 0 ? (
            uppItems.map((kategori) => (
              <li
                key={kategori.id}
                className="mb-4"
              >
                {/* Category Header */}
                <Link
                  href={`/upp/${kategori.nama.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 block py-1"
                >
                  {kategori.nama}
                </Link>

                {/* Subcategories */}
                {kategori.jenisPengumuman && kategori.jenisPengumuman.length > 0 && (
                  <ul className="ml-4 mt-1">
                    {kategori.jenisPengumuman.map((jenis) => (
                      <li key={jenis.id}>
                        <Link
                          href={`/upp/${kategori.nama.toLowerCase().replace(/\s+/g, "-")}/${jenis.nama.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 block py-1 px-2 rounded"
                        >
                          {jenis.nama}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li className="text-center py-2 text-gray-500 dark:text-gray-400">No categories available</li>
          )}
        </ul>
      </ul>
    </div>
  );
}
