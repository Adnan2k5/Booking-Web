import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import Booking from "./Pages/Booking"
import { ResetPass } from "./Pages/ResetPass"
import { Loader } from "./components/Loader"
import { AuthProvider } from "./Pages/AuthProvider"
import UserDashboard from "./Pages/UserDashboard"
import UserDashboardLayout from "./components/UserDashboardLayout"
import InstructorDashboard from "./Pages/Instructor/InstructorDashboard"
import SessionForm from "./Pages/Instructor/SessionForm"
import { ProtectedRoute } from "./Auth/ProtectedRoute"
import ConfirmationPage from "./Pages/Confirmation"
import FacebookCallback from "./Auth/FacebookCallback"
import LinkedInCallback from "./Auth/LinkedinCallBack"
import ChatWidget from "./components/ChatWidget"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminLayout from "./Pages/Admin/Layout"
import AdventuresPage from "./Pages/Admin/SubPages/Adventures"
import Dash_Bookings from "./Pages/Admin/SubPages/Bookings"
import Dash_User from "./Pages/Admin/SubPages/Users"
import Dash_Store from "./Pages/Admin/SubPages/Store"
import Dash_Hotels from "./Pages/Admin/SubPages/Hotels"
import Dash_Tickets from "./Pages/Admin/SubPages/Tickets"
import Dash_Terms from "./Pages/Admin/SubPages/Terms"
import Dash_Declation from "./Pages/Admin/SubPages/Declaration"

// Lazy loaded components
const LoginPage = lazy(() => import("./Pages/LoginPage"))
const LandingPage = lazy(() => import("./Pages/LandingPage"))
const BrowsingPage = lazy(() => import("./Pages/BrowsingPage"))
const Shop = lazy(() => import("./Pages/Shop"))

// i18n
import { I18nextProvider } from "react-i18next"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslation from "./locales/en.json"
import frTranslation from "./locales/fr.json"
import deTranslation from "./locales/de.json"
import esTranslation from "./locales/es.json"
import itTranslation from "./locales/it.json"
import { InstructorRegister } from "./Pages/Instructor/InstructorLogin"

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
    de: { translation: deTranslation },
    es: { translation: esTranslation },
    it: { translation: itTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Toaster />
            <ChatWidget />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/signInWithLinkedin" element={<LinkedInCallback />} />
              <Route path="/auth/signInWithFacebook" element={<FacebookCallback />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/browse" element={<BrowsingPage />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/reset" element={<ResetPass />} />
              <Route path="/instructor/register" element={<InstructorRegister />} />
              <Route
                path="/dashboard"
                element={
                  <UserDashboard />
                }
              />
              <Route
                path="/dashboard/bookings"
                element={
                  <UserDashboardLayout>
                    <UserDashboard />
                  </UserDashboardLayout>
                }
              />
              <Route
                path="/dashboard/tickets"
                element={
                  <UserDashboardLayout>
                    <UserDashboard />
                  </UserDashboardLayout>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <UserDashboardLayout>
                    <UserDashboard />
                  </UserDashboardLayout>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <UserDashboardLayout>
                    <UserDashboard />
                  </UserDashboardLayout>
                }
              />
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/bookings" element={<InstructorDashboard />} />
              <Route path="/instructor/sessions" element={<InstructorDashboard />} />
              <Route path="/instructor/sessions/new" element={<SessionForm />} />
              <Route path="/instructor/profile" element={<InstructorDashboard />} />
              <Route path="/instructor/settings" element={<InstructorDashboard />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/adventures" element={<AdventuresPage />} />
                <Route path="/admin/bookings" element={<Dash_Bookings />} />
                <Route path="/admin/users" element={<Dash_User />} />
                <Route path="/admin/store" element={<Dash_Store />} />
                <Route path="/admin/hotels" element={<Dash_Hotels />} />
                <Route path="/admin/tickets" element={<Dash_Tickets />} />
                <Route path="/admin/terms" element={<Dash_Terms />} />
                <Route path="/admin/declaration" element={<Dash_Declation />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  )
}

export default App
