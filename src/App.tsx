import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Sidebar from '@/components/Sidebar';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import DayPage from '@/pages/DayPage';
import OverviewPage from '@/pages/OverviewPage';

function App() {
  // TEMPORARY: Set to true during development so we can test /day and /overview
  // We'll replace this with real auth state later
  const isLoggedIn = true;

  return (
    <Router>
      <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
        <Routes>
          {/* Public Landing Page - only shown if NOT logged in */}
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/day" replace /> : <Landing />} 
          />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Main App Routes with Sidebar */}
          <Route
            path="/day"
            element={
              <div className="flex h-full w-full">
                <Sidebar />
                <DayPage />
              </div>
            }
          />

          <Route
            path="/overview"
            element={
              <div className="flex h-full w-full">
                <Sidebar />
                <OverviewPage />
              </div>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/day" : "/"} replace />} />
        </Routes>

        <Toaster position="top-center" richColors closeButton />
      </div>
    </Router>
  );
}

export default App;
