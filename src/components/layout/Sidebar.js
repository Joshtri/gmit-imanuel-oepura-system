import Link from "next/link";

export default function Sidebar({ menuItems }) {
  return (
    <div className="drawer-side z-[60]">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-base-200 min-h-full w-80 p-4">
        <div className="mb-4">
          <p className="font-extrabold text-2xl">GMIT Imanuel</p>
          <p className="text-2xl">Oepura</p>
        </div>
        {menuItems.map((item) => (
          <li key={item.name}>
            <a href={item.path}>{item.name}</a>
          </li>
        ))}
        <h2>UPP</h2>
        <ul>
          <li>
            <Link href="/upp/anak">Anak</Link>
          </li>
          <li>
            <Link href="/upp/pemuda">Pemuda</Link>
          </li>
        </ul>
      </ul>
    </div>
  );
}