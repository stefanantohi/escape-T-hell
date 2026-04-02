import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/Sidebar";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import DayPage from "@/pages/DayPage";
import OverviewPage from "@/pages/OverviewPage";

function App() {
  // TODO: Replace with real auth later
  const isLoggedIn = false;

  return (
    <Router>
      <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<Landing />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with Sidebar */}
          <Route
            path="/day"
            element={
              isLoggedIn ? (
                <div className="flex h-full w-full">
                  <Sidebar />
                  <DayPage />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/overview"
            element={
              isLoggedIn ? (
                <div className="flex h-full w-full">
                  <Sidebar />
                  <OverviewPage />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-center" richColors closeButton />
      </div>
    </Router>
  );
}

export default App;
