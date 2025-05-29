import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Schedule from "../pages/schedule";
import Groups from "../pages/groups";
import Signup from "../pages/signup";
import Landing from "../pages/landing";
import PrivateRoute from "../contexts/PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Landing />} />
      <Route element={<PrivateRoute />}>
        <Route path="/:userId/schedule" element={<Schedule />} />
        <Route path="/:userId/groups" element={<Groups />} />
      </Route>

      <Route path="*" element={<p>404: Not Found</p>} />
    </Routes>
  );
}

export default AppRoutes;
