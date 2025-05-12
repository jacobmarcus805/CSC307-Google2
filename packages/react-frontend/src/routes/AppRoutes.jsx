import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Schedule from "../pages/schedule";
import Groups from "../pages/groups";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/schedule/:username" element={<Schedule />} />
      <Route path="/groups/:username" element={<Groups />} />
    </Routes>
  );
}

export default AppRoutes;
