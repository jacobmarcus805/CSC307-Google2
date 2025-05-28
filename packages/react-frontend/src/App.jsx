import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserContext"; // Import UserProvider

function App() {
  return (
    <Router>
      <UserProvider>
        {/* User context provider to manage user state */}
        <Navbar />
        <Routes>
          {/* Redirect / to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* All other routes */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
