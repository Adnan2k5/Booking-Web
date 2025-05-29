import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import Booking from "./Pages/BookingSteps/Booking"
import { ResetPass } from "./Pages/ResetPass"
import { Loader } from "./components/Loader"
import { AuthProvider } from "./Pages/AuthProvider"
import { AdminRoute, InstructorRoute } from "./Auth/ProtectedRoute"
import UserDashboard from "./Pages/User/UserDashboard"
import UserDashboardLayout from "./components/UserDashboardLayout"
import InstructorDashboard from "./Pages/Instructor/InstructorDashboard"
import SessionForm from "./Pages/Instructor/SessionForm"
import ConfirmationPage from "./Pages/ConfirmationPage/Confirmation"
import FacebookCallback from "./Auth/FacebookCallback"
import LinkedInCallback from "./Auth/LinkedinCallBack"
import ChatWidget from "./components/ChatWidget"
import AdminDashboard from "./Pages/Admin/AdminDashboard"
import AdminLayout from "./Pages/Admin/Layout"
import AdventuresPage from "./Pages/Admin/SubPages/Adventures"
import AdventureFormPage from "./Pages/Admin/SubPages/AdventureForm"
import Dash_Bookings from "./Pages/Admin/SubPages/Bookings"
import Dash_User from "./Pages/Admin/SubPages/Users"
import Dash_Store from "./Pages/Admin/SubPages/Store"
import Dash_Hotels from "./Pages/Admin/SubPages/Hotels"
import Dash_Tickets from "./Pages/Admin/SubPages/Tickets"
import Dash_Terms from "./Pages/Admin/SubPages/Terms"
import Dash_Declation from "./Pages/Admin/SubPages/Declaration"
import LocationsPage from "./Pages/Admin/SubPages/Location"

// Lazy loaded components
const LoginPage = lazy(() => import("./Pages/LoginPage"))
const LandingPage = lazy(() => import("./Pages/LandingPage"))
const BrowsingPage = lazy(() => import("./Pages/Browsing/BrowsingPage"))
const Shop = lazy(() => import("./Pages/Shop/Shop"))
const LoginOptionsPage = lazy(() => import("./Pages/LoginOptionPage"))

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
import { InstructorBookings } from "./Pages/Instructor/Instructor.bookings"
import { InstructorSession } from "./Pages/Instructor/InstructorSession"
import { InstructorProfile } from "./Pages/Instructor/InstructorProfile"
import InstructorSettings from "./Pages/Instructor/InstructorSettings"
import { CartProvider } from "./Pages/Cart/CartContext"
import InstructorPendingReview from "./Pages/Instructor/InstructorPendingReview"
import InstructorsPage from "./Pages/Admin/SubPages/InstructorsVerification"
import { HotelRegister } from "./Pages/Hotel/HotelRegister"
import InstructorLayout from "./Pages/Instructor/InstructorLayout"
import { Hotel } from "./Pages/Hotel/Hotel"
import HotelPendingReview from "./Pages/Hotel/HotelPending"
import Managers from "./Pages/Admin/SubPages/Managers"
import { ItemPage } from "./Pages/Shop/ItemPage"

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
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <Toaster />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login-options" element={<LoginOptionsPage />} />
                <Route path="/auth/signInWithLinkedin" element={<LinkedInCallback />} />
                <Route path="/auth/signInWithFacebook" element={<FacebookCallback />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/browse" element={<BrowsingPage />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:productId" element={<ItemPage />} />
                <Route path="/reset" element={<ResetPass />} />
                <Route path="/instructor/register" element={<InstructorRegister />} />
                <Route path="/instructor/pending-review" element={<InstructorPendingReview />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/hotel" element={<Hotel />} />
                <Route path="/hotel/register" element={<HotelRegister />} />
                <Route path="/hotel/pending" element={<HotelPendingReview />} />
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
                <Route
                  path="/instructor/"
                  element={
                    <InstructorRoute>
                      <InstructorLayout />
                    </InstructorRoute>
                  }
                />
                <Route
                  path="/instructor/dashboard"
                  element={
                    <InstructorRoute>
                      <InstructorDashboard />
                    </InstructorRoute>
                  }
                />
                <Route
                  path="/instructor/bookings"
                  element={
                    <InstructorRoute>
                      <InstructorBookings />
                    </InstructorRoute>
                  }
                />
                <Route
                  path="/instructor/sessions"
                  element={
                    <InstructorRoute>
                      <InstructorSession />
                    </InstructorRoute>
                  }
                />
                <Route
                  path="/instructor/sessions/new"
                  element={
                    <InstructorRoute>
                      <SessionForm />
                    </InstructorRoute>
                  }
                />
                <Route
                  path="/instructor/profile"
                  element={
                    <InstructorRoute>
                      <InstructorProfile />
                    </InstructorRoute>
                  }
                />
                <Route
                  path="/instructor/settings"
                  element={
                    <InstructorRoute>
                      <InstructorSettings />
                    </InstructorRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route path="/admin/adventures" element={<AdventuresPage />} />
                  <Route path="/admin/adventures/new" element={<AdventureFormPage />} />
                  <Route path="/admin/adventures/edit/:id" element={<AdventureFormPage />} />
                  <Route path="/admin/bookings" element={<Dash_Bookings />} />
                  <Route path="/admin/users" element={<Dash_User />} />
                  <Route path="/admin/instructors" element={<InstructorsPage />} />
                  <Route path="/admin/store" element={<Dash_Store />} />
                  <Route path="/admin/hotels" element={<Dash_Hotels />} />
                  <Route path="/admin/tickets" element={<Dash_Tickets />} />
                  <Route path="/admin/terms" element={<Dash_Terms />} />
                  <Route path="/admin/declaration" element={<Dash_Declation />} />
                  <Route path="/admin/locations" element={<LocationsPage />} />
                  <Route path="/admin/manager" element={<Managers />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </I18nextProvider>
  )
}

export default App
