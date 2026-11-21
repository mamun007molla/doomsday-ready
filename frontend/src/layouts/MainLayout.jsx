import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <main className="flex-1 p-8 text-white">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
