import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Toaster } from 'sonner';
import {Booking} from './Pages/Booking';
import { ResetPass } from './Pages/ResetPass';
const LoginPage = lazy(()=>import('./Pages/LoginPage'));
const LandingPage = lazy(()=>import('./Pages/LandingPage'));
const BrowsingPage = lazy(()=>import('./Pages/BrowsingPage'));
import { AuthProvider } from './Auth/AuthProvider';
import LinkedInCallback from './Auth/LinkedinCallBack';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminLayout from './Pages/Admin/Layout';
import FacebookCallback from './Auth/FacebookCallback';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/signInWithLinkedin" element={<LinkedInCallback />} />
        <Route path="/auth/signInWithFacebook" element={<FacebookCallback />} />
        <Route path="/" element={<LandingPage />} />
        <Route path='/browse' element={<BrowsingPage />} />
        {/* <Route path='/booking' element={<AuthProvider><Booking/></AuthProvider>} /> */}
        <Route path='/booking' element={<Booking/>} />
        <Route path="/reset" element={<ResetPass/>}/>
        <Route path='/admin' element={<AdminLayout/>}>
          <Route index element={<AdminDashboard/>}/>
        </Route>

      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App