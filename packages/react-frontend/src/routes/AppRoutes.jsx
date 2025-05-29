import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Schedule from "../pages/schedule";
import Groups from "../pages/groups";
import Signup from "../pages/signup";
import ManageGroup from "../pages/manageGroup";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/:userId/schedule" element={<Schedule />} />
      <Route path="/:username/groups" element={<Groups />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/groups/:groupId" element={<ManageGroup />} />
    </Routes>
  );
}

export default AppRoutes;
