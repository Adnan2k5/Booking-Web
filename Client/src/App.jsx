import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const LoginPage = lazy(()=>import('./Pages/LoginPage'));
const LandingPage = lazy(()=>import('./Pages/LandingPage'));
const BrowsingPage = lazy(()=>import('./Pages/BrowsingPage'));

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path='/browse' element={<BrowsingPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App