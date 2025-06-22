"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Hotel as HotelIcon, 
  MapPin, 
  User, 
  Clock, 
  Bed, 
  Phone, 
  Mail,
  Shield,
  CalendarCheck
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { Navbar } from "../../components/Navbar"
import { useTranslation } from "react-i18next"
import { createHotelBooking } from "../../Api/hotelBooking.api"

export default function HotelCheckout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  
  // Get hotel data from location state or redirect back
  const hotelData = location.state?.hotel
  
  if (!hotelData) {
    useEffect(() => {
      toast.error("No hotel selected for booking")
      navigate("/hotels")
    }, [])
    return null
  }
  
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: location.state?.checkInDate || new Date().toISOString().split("T")[0],
    checkOutDate: location.state?.checkOutDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
    rooms: location.state?.rooms || 1,
    guests: {
      adults: location.state?.guests?.adults || 1,
      children: location.state?.guests?.children || 0
    },
    guestInfo: {
      fullName: "",
      email: "",
      phone: ""
    },
    specialRequests: ""
  })

  // Calculate stay duration in nights
  const nights = Math.ceil((new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / (1000 * 60 * 60 * 24))
  
  // Calculate total price
  const roomRate = hotelData.pricePerNight || hotelData.price || 0
  const subtotal = roomRate * bookingDetails.rooms * nights
  const tax = subtotal * 0.08 // 8% tax
  const totalPrice = subtotal + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith("guestInfo.")) {
      const field = name.split(".")[1]
      setBookingDetails(prev => ({
        ...prev,
        guestInfo: {
          ...prev.guestInfo,
          [field]: value
        }
      }))
    } else {
      setBookingDetails(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate booking information
    if (!bookingDetails.guestInfo.fullName || !bookingDetails.guestInfo.email || !bookingDetails.guestInfo.phone) {
      toast.error("Please fill in all required guest information")
      setIsLoading(false)
      return
    }

    try {
      // Prepare booking data
      const bookingData = {
        hotels: [
          {
            hotel: hotelData._id,
            checkInDate: bookingDetails.checkInDate,
            checkOutDate: bookingDetails.checkOutDate,
            quantity: bookingDetails.rooms,
            nights: nights,
            pricePerNight: roomRate
          }
        ],
        amount: totalPrice,
        guestInfo: bookingDetails.guestInfo,
        specialRequests: bookingDetails.specialRequests
      }
        // Make API request to create hotel booking
      const response = await createHotelBooking(bookingData)
      
      // Check for successful booking
      if (response.data && response.data.success) {
        toast.success("Hotel booked successfully!")
        
        // Redirect to success page or booking details
        navigate("/hotel/booking-success", { 
          state: { 
            bookingId: response.data.data._id,
            bookingDetails: response.data.data
          } 
        })
      } else {
        throw new Error(response.data?.message || "Booking failed")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error(error.response?.data?.message || "Failed to process booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20 max-w-7xl mx-auto px-4 py-8"
      >
        {/* Back navigation */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-600 hover:text-gray-900 p-0" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <HotelIcon className="h-8 w-8 text-blue-600" />
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-1">
            Please review your reservation details and provide payment information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main booking form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Hotel details summary */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Hotel Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden shrink-0">
                      <img
                        src={hotelData.logo || hotelData.medias?.[0] || "/placeholder.svg"}
                        alt={hotelData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{hotelData.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {hotelData.location?.name || "Location not specified"}
                        </span>
                      </div>
                      {hotelData.rating !== undefined && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < Math.round(hotelData.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium">
                          {new Date(bookingDetails.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CalendarCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium">
                          {new Date(bookingDetails.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Bed className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Rooms</p>
                        <p className="font-medium">{bookingDetails.rooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName">Full Name*</Label>
                      <Input
                        id="fullName"
                        name="guestInfo.fullName"
                        placeholder="Enter your full name"
                        value={bookingDetails.guestInfo.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        name="guestInfo.email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={bookingDetails.guestInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone*</Label>
                      <Input
                        id="phone"
                        name="guestInfo.phone"
                        placeholder="Your contact number"
                        value={bookingDetails.guestInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Input
                        id="specialRequests"
                        name="specialRequests"
                        placeholder="Any special requests or preferences"
                        value={bookingDetails.specialRequests}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Payment Method</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Payment will be processed securely at the final step
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-white">Visa</Badge>
                      <Badge variant="outline" className="bg-white">MasterCard</Badge>
                      <Badge variant="outline" className="bg-white">American Express</Badge>
                      <Badge variant="outline" className="bg-white">PayPal</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm mt-4">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Your payment info is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Room Rate (${roomRate}/night)
                    </span>
                    <span>${roomRate.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms</span>
                    <span>{bookingDetails.rooms}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p>You'll be charged the total amount after confirming this booking.</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Processing..." : "Confirm and Pay"}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    By confirming, you agree to our{" "}
                    <Link className="text-blue-600 underline" to="/terms">Terms & Conditions</Link> and{" "}
                    <Link className="text-blue-600 underline" to="/terms">Cancellation Policy</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
