import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Shield,
    ArrowLeft,
    CreditCard,
    DollarSign
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'
import { Footer } from '../../components/Footer'
import { createEventBooking } from '../../Api/eventBooking.api'

const PaymentPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const bookingData = location.state?.bookingData
    const selectedEvent = location.state?.selectedEvent

    const [processing, setProcessing] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('revolut')

    // Redirect if no booking data
    useEffect(() => {
        if (!bookingData || !selectedEvent) {
            toast.error('No booking data found. Please start the booking process again.')
            navigate('/')
        }
    }, [bookingData, selectedEvent, navigate])

    const calculateTotal = () => {
        // Base price calculation - you can modify this based on your pricing logic
        const basePrice = 150 // Example base price
        const participantPrice = basePrice * (bookingData?.participants || 1)
        const serviceFee = participantPrice * 0.1 // 10% service fee
        const tax = participantPrice * 0.05 // 5% tax
        return {
            basePrice: participantPrice,
            serviceFee,
            tax,
            total: participantPrice + serviceFee + tax
        }
    }

    const pricing = calculateTotal()

    const handleRevolutPayment = async () => {
        setProcessing(true)

        try {
            // Create event booking with payment order
            const eventBookingData = {
                event: selectedEvent._id,
                participants: bookingData.participants,
                contactInfo: {
                    email: bookingData.email,
                    phone: bookingData.phone
                },
                specialRequests: bookingData.specialRequests,
                amount: pricing.total,
                paymentMethod: 'revolut'
            }

            const response = await createEventBooking(eventBookingData)

            // Redirect to Revolut payment page
            if (response.data?.paymentOrder?.checkout_url) {
                window.location.href = response.data.paymentOrder.checkout_url
            } else {
                toast.error('Failed to create payment session. Please try again.')
            }

        } catch (error) {
            console.error('Payment session error:', error)
            toast.error(error.response?.data?.message || 'Failed to create payment session. Please try again.')
        } finally {
            setProcessing(false)
        }
    }

    const handlePayPalPayment = () => {
        toast.info('PayPal payment is coming soon!')
    }

    if (!bookingData || !selectedEvent) {
        return null
    }

    return (
        <div className="min-h-screen  bg-gray-50">

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Event Details
                    </Button>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
                        <p className="text-gray-600">Choose your payment method to secure your spot</p>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2  gap-8">
                    {/* Event Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    Booking Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Event Details */}
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={selectedEvent.image || "/placeholder.svg"}
                                            alt={selectedEvent.title}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
                                            <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                                            <Badge variant="secondary" className="mt-2">
                                                Level {selectedEvent.level}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>{selectedEvent.city}, {selectedEvent.country}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>{bookingData.participants} participant(s)</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Contact Information */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Contact Information</h4>
                                    <div className="text-sm space-y-2 bg-gray-50 p-3 rounded-lg">
                                        <p><span className="font-medium">Email:</span> {bookingData.email}</p>
                                        <p><span className="font-medium">Phone:</span> {bookingData.phone}</p>
                                        {bookingData.specialRequests && (
                                            <p><span className="font-medium">Special Requests:</span> {bookingData.specialRequests}</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Price Breakdown</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Base Price ({bookingData.participants} × $150)</span>
                                            <span>${pricing.basePrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Service Fee (10%)</span>
                                            <span>${pricing.serviceFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (5%)</span>
                                            <span>${pricing.tax.toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total</span>
                                            <span>${pricing.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Payment Methods */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                    Choose Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Payment Method Selection */}
                                <div className="space-y-4">
                                    <div
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'revolut'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setPaymentMethod('revolut')}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                                    <DollarSign className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Revolut Pay</h3>
                                                    <p className="text-sm text-gray-600">Secure and fast payment</p>
                                                </div>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'revolut'
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {paymentMethod === 'revolut' && (
                                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all opacity-50 ${paymentMethod === 'paypal'
                                            ? 'border-yellow-500 bg-yellow-50'
                                            : 'border-gray-200'
                                            }`}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-8 bg-yellow-500 rounded flex items-center justify-center">
                                                    <CreditCard className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">PayPal</h3>
                                                    <p className="text-sm text-gray-600">Coming soon</p>
                                                </div>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'paypal'
                                                ? 'bg-yellow-500 border-yellow-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {paymentMethod === 'paypal' && (
                                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Payment Button */}
                                <div className="space-y-4">
                                    {paymentMethod === 'revolut' ? (
                                        <Button
                                            onClick={handleRevolutPayment}
                                            disabled={processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="h-5 w-5 mr-2" />
                                                    Pay ${pricing.total.toFixed(2)} with Revolut
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handlePayPalPayment}
                                            disabled={true}
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 text-lg font-semibold opacity-50 cursor-not-allowed"
                                        >
                                            PayPal - Coming Soon
                                        </Button>
                                    )}
                                </div>

                                {/* Security Notice */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-green-800 font-medium">100% Secure Payment</span>
                                    </div>
                                    <p className="text-xs text-green-700 mt-1">
                                        Your payment is processed securely through our trusted payment partners
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default PaymentPage
