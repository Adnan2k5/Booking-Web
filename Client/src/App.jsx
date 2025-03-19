import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import Booking from "./Pages/Booking";
import { ResetPass } from "./Pages/ResetPass";
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const BrowsingPage = lazy(() => import("./Pages/BrowsingPage"));
import LinkedInCallback from "./Auth/LinkedinCallBack";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminLayout from "./Pages/Admin/Layout";
import FacebookCallback from "./Auth/FacebookCallback";
import { useDispatch, useSelector } from "react-redux";
import { AuthProvider } from "./Pages/AuthProvider";
import ConfirmationPage from "./Pages/Confirmation";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/auth/signInWithLinkedin"
              element={<LinkedInCallback />}
            />
            <Route
              path="/auth/signInWithFacebook"
              element={<FacebookCallback />}
            />
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<BrowsingPage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/confirmation" element={<ConfirmationPage/>}/>
            {/* <Route path='/booking' element={<Booking/>} /> */}
            <Route path="/reset" element={<ResetPass />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
          
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
