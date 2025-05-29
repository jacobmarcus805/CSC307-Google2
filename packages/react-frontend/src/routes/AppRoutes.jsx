import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Schedule from "../pages/schedule";
import Groups from "../pages/groups";
import Signup from "../pages/signup";
import Landing from "../pages/landing";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/:userId/schedule" element={<Schedule />} />
      <Route path="/:username/groups" element={<Groups />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<p>404: Not Found</p>} />
    </Routes>
  );
}

export default AppRoutes;
