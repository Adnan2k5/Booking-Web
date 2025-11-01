import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import { Toaster } from "sonner"
import Booking from "./Pages/BookingSteps/Booking"
import { ResetPass } from "./Pages/ResetPass"
import { Loader } from "./components/Loader"
import { AuthProvider } from "./Pages/AuthProvider"
import { AdminRoute, InstructorRoute } from "./Auth/ProtectedRoute"
import { FeatureRoute } from "./Auth/FeatureRoute"
import UserDashboardPage from "./Pages/User/UserDashboardPage"
import UserBookingsPage from "./Pages/User/UserBookingsPage"
import UserFriendsPage from "./Pages/User/UserFriendsPage"
import UserTicketsPage from "./Pages/User/UserTicketsPage"
import UserProfilePage from "./Pages/User/UserProfilePage"
import UserSettingsPage from "./Pages/User/UserSettingsPage"
import DashboardLayout from "./Pages/User/DashboardLayout"
import InstructorDashboard from "./Pages/Instructor/InstructorDashboard"
import SessionForm from "./Pages/Instructor/SessionForm"
import ConfirmationPage from "./Pages/ConfirmationPage/Confirmation"
import FacebookCallback from "./Auth/FacebookCallback"
import { useLanguageInitializer } from "./hooks/useLanguageInitializer"
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
import EventDetailPage from "./Pages/EventDetailPage"

// Lazy loaded components
const LoginPage = lazy(() => import("./Pages/LoginPage"))
const LandingPage = lazy(() => import("./Pages/LandingPage"))
const FAQ = lazy(() => import("./Pages/FAQ"))
const BrowsingPage = lazy(() => import("./Pages/Browsing/BrowsingPage"))
const Shop = lazy(() => import("./Pages/Shop/Shop"))
const SearchPage = lazy(() => import("./Pages/Shop/SearchPage"))
const NavResultsPage = lazy(() => import("./Pages/Shop/NavResultsPage"))
const ComparisonPage = lazy(() => import("./Pages/Shop/ComparisonPage"))
const FavoritesPage = lazy(() => import("./Pages/Shop/FavoritesPage"))
const Hotel = lazy(() => import("./Pages/Hotel/Hotel"))
const HotelCheckout = lazy(() => import("./Pages/Hotel/HotelCheckout"))
const HotelBookingSuccess = lazy(() => import("./Pages/Hotel/HotelBookingSuccess"))
const LoginOptionsPage = lazy(() => import("./Pages/LoginOptionPage"))
const AuthLayout = lazy(() => import("./Pages/Auth/AuthLayout"))
const Terms = lazy(() => import("./Pages/Terms"))
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"))
const PaymentApprove = lazy(() => import("./Pages/Payment/PaymentApprove"))
const PaymentCancel = lazy(() => import("./Pages/Payment/PaymentCancel"))
const Payout = lazy(() => import("./Pages/Payment/Payout"))
const PayPalSuccess = lazy(() => import("./Pages/Payment/PayPalSuccess"))
const PayPalError = lazy(() => import("./Pages/Payment/PayPalError"))
const EventBookingConfirmation = lazy(() => import("./Pages/Payment/EventBookingConfirmation"))
const SecretNftEvents = lazy(() => import("./Pages/SecretNftEvents"))
const Mission = lazy(() => import("./Pages/Mission"))

// i18n
import { I18nextProvider } from "react-i18next"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslation from "./Locales/en.json"
import frTranslation from "./Locales/fr.json"
import deTranslation from "./Locales/de.json"
import esTranslation from "./Locales/es.json"
import itTranslation from "./Locales/it.json"
import { updateLanguageHeaders } from "./Api/language.api.js"
import { InstructorRegister } from "./Pages/Instructor/InstructorLogin"
import { InstructorSession } from "./Pages/Instructor/InstructorSession"
import { InstructorProfile } from "./Pages/Instructor/InstructorProfile"
import InstructorSettings from "./Pages/Instructor/InstructorSettings"
import InstructorTickets from "./Pages/Instructor/InstructorTickets"
import { CartProvider } from "./Pages/Cart/CartContext"
import { ComparisonProvider } from "./contexts/ComparisonContext"
import { FavoritesProvider } from "./contexts/FavoritesContext"
import InstructorPendingReview from "./Pages/Instructor/InstructorPendingReview"
import { WebsiteSettingsProvider } from "./contexts/WebsiteSettingsContext"
import InstructorsPage from "./Pages/Admin/SubPages/InstructorsVerification"
import { HotelRegister } from "./Pages/Hotel/HotelRegister"
import InstructorLayout from "./Pages/Instructor/InstructorLayout"
import { HotelProfile } from "./Pages/Hotel/HotelProfile"
import HotelPendingReview from "./Pages/Hotel/HotelPending"
import Managers from "./Pages/Admin/SubPages/Managers"
import { ItemPage } from "./Pages/Shop/ItemPage"
import { Cart } from "./Pages/Shop/Cart"
import CartSuccess from "./Pages/Shop/CartSuccess"
import EventsPage from "./Pages/Admin/SubPages/Events"
import WebsiteSettings from "./Pages/Admin/SubPages/WebsiteSettings"
import { ChatLayout } from "./Pages/Chat/ChatLayout"
import SponsorsPage from "./Pages/Admin/SubPages/Sponsors"
import AchievementRulesPage from "./Pages/Admin/SubPages/AchievementRules"

// Initialize i18n with stored language
const getInitialLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
    de: { translation: deTranslation },
    es: { translation: esTranslation },
    it: { translation: itTranslation },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

// Initialize language headers
updateLanguageHeaders(getInitialLanguage())

// Language Initializer Component
const LanguageInitializer = () => {
  useLanguageInitializer();
  return null;
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <WebsiteSettingsProvider>
          <CartProvider>
            <ComparisonProvider>
              <FavoritesProvider>
                <LanguageInitializer />
            <BrowserRouter>
              <ChatWidget />
              <Suspense fallback={<Loader />}>
                <Toaster />
                <Routes>
                  {/* Public routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login-options" element={<LoginOptionsPage />} />
                  </Route>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth/signInWithLinkedin" element={<LinkedInCallback />} />
                  <Route path="/auth/signInWithFacebook" element={<FacebookCallback />} />
                  <Route path="/secret-nft-events" element={<SecretNftEvents />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/browse" element={<BrowsingPage />} />
                  <Route path="/event/:id" element={<EventDetailPage />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/payment/approve" element={<PaymentApprove />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="/instructor/payout" element={<Payout />} />
                  <Route path="/paypal/success" element={<PayPalSuccess />} />
                  <Route path="/paypal/error" element={<PayPalError />} />
                  <Route path="/event-booking-confirmation" element={<EventBookingConfirmation />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                  <Route path="/chat" element={<ChatLayout />} />


                  <Route path="/shop" element={
                    <FeatureRoute feature="shop">
                      <Shop />
                    </FeatureRoute>
                  } />
                  <Route path="/shop/search" element={
                    <FeatureRoute feature="shop">
                      <SearchPage />
                    </FeatureRoute>
                  } />
                  <Route path="/shop/nav" element={
                    <FeatureRoute feature="shop">
                      <NavResultsPage />
                    </FeatureRoute>
                  } />
                  <Route path="/shop/comparison" element={
                    <FeatureRoute feature="shop">
                      <ComparisonPage />
                    </FeatureRoute>
                  } />
                  <Route path="/favorites" element={
                    <FeatureRoute feature="shop">
                      <FavoritesPage />
                    </FeatureRoute>
                  } />
                  <Route path="/book-hotel" element={
                    <FeatureRoute feature="hotels">
                      <Hotel />
                    </FeatureRoute>
                  } />                  <Route path="/cart" element={
                    <FeatureRoute feature="shop">
                      <Cart />
                    </FeatureRoute>
                  } />
                  <Route path="/cart/success" element={
                    <FeatureRoute feature="shop">
                      <CartSuccess />
                    </FeatureRoute>
                  } />
                  <Route path="/product/:productId" element={
                    <FeatureRoute feature="shop">
                      <ItemPage />
                    </FeatureRoute>
                  } />
                  <Route path="/reset" element={<ResetPass />} />
                  <Route path="/support" element={<Navigate to="/dashboard/tickets" replace />} />
                  <Route path="/instructor/register" element={<InstructorRegister />} />
                  <Route path="/instructor/pending-review" element={<InstructorPendingReview />} />
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<UserDashboardPage />} />
                    <Route path="bookings" element={<UserBookingsPage />} />
                    <Route path="friends" element={<UserFriendsPage />} />
                    <Route path="tickets" element={<UserTicketsPage />} />
                    <Route path="profile" element={<UserProfilePage />} />
                    <Route path="settings" element={<UserSettingsPage />} />
                  </Route>
                  <Route path="/hotel" element={
                    <FeatureRoute feature="hotels">
                      <HotelProfile />
                    </FeatureRoute>
                  } />
                  <Route path="/hotel/register" element={
                    <FeatureRoute feature="hotels">
                      <HotelRegister />
                    </FeatureRoute>
                  } />                  <Route path="/hotel/pending" element={
                    <FeatureRoute feature="hotels">
                      <HotelPendingReview />
                    </FeatureRoute>
                  } />                  <Route path="/hotel/checkout" element={
                    <FeatureRoute feature="hotels">
                      <HotelCheckout />
                    </FeatureRoute>
                  } />
                  <Route path="/hotel/booking-success" element={
                    <FeatureRoute feature="hotels">
                      <HotelBookingSuccess />
                    </FeatureRoute>
                  } />
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
                    path="/instructor/support"
                    element={
                      <InstructorRoute>
                        <InstructorTickets />
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
                    <Route path="/admin/events" element={<EventsPage />} />
                    <Route path="/admin/website-settings" element={<WebsiteSettings />} />
                    <Route path="/admin/sponsors" element={<SponsorsPage />} />
                    <Route path="/admin/achievement-rules" element={<AchievementRulesPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
            </FavoritesProvider>
            </ComparisonProvider>
          </CartProvider>
        </WebsiteSettingsProvider>
      </AuthProvider>
    </I18nextProvider>
  )
}

export default App
