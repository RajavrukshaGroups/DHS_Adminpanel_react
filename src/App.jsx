import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

import { BrowserRouter as Router, Routes,Route,useLocation } from "react-router-dom";
import AdminLogin from "./pages/adminLogin";
import Dashboard from "./pages/dashboard";
import Sidebar from "./pages/sidebar";
import PrivateRoute from "./components/privateRoute";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Router>
      <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}
function MainLayout({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/adminlogin";
  return (
    <div className="flex">
      {!isLoginPage && (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isLoginPage && sidebarOpen ? "ml-56" : "ml-0"
        }`} >
        <Routes>
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;