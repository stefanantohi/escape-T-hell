import { Link, useLocation } from "react-router-dom";
import { Calendar, BarChart3, LogOut, BookOpen } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl font-bold tracking-tight">Escape Hell</h1>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Learning Tracker</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/day"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            location.pathname === "/day"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          <Calendar className="w-5 h-5" />
          Today
        </Link>

        <Link
          to="/overview"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            location.pathname === "/overview"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Overview
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-800 mt-auto">
        <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
