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
      <Navbar />
      <Routes>
        {/* All other routes */}
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
