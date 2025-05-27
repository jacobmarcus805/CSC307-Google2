import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Schedule from "../pages/schedule";
import Groups from "../pages/groups";
import Signup from "../pages/signup";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/:userId/schedule" element={<Schedule />} />
      <Route path="/:userId/groups" element={<Groups />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  );
}

export default AppRoutes;
