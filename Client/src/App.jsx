import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Toaster } from 'sonner';
import {Booking} from './Pages/Booking';
import { ResetPass } from './Pages/ResetPass';
const LoginPage = lazy(()=>import('./Pages/LoginPage'));
const LandingPage = lazy(()=>import('./Pages/LandingPage'));
const BrowsingPage = lazy(()=>import('./Pages/BrowsingPage'));
import { configDotenv } from 'dotenv';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path='/browse' element={<BrowsingPage />} />
        <Route path='/booking' element={<Booking />} />
        <Route path="/reset" element={<ResetPass/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App