import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Movies",
    path: "/movies",
    icon: "🎬",
  },
  {
    name: "Rewatch Plan",
    path: "/rewatch",
    icon: "📋",
  },
  {
    name: "Booking",
    path: "/booking",
    icon: "🎟️",
  },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        Doomsday<span className="text-red-500">.</span>
      </h1>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
