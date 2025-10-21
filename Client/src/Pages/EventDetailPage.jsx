import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { getEventById } from "../Api/event.api";
import { createEventBooking } from "../Api/eventBooking.api";
import { useAuth } from "./AuthProvider";

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("revolut");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await getEventById(id);
                if (response.success) {
                    setEvent(response.data);
                } else {
                    setError("Event not found");
                }
            } catch (err) {
                setError("Failed to load event details");
                console.error("Error fetching event:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    const formatDisplayDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDisplayTime = (timeString) => {
        if (!timeString) return "";
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleBooking = async () => {
        if (!user?.user) {
            // Store current URL to redirect back after login
            localStorage.setItem("redirectAfterLogin", window.location.pathname);
            toast.info("Please login to book this event");
            navigate("/login");
            return;
        }

        const userLevel = user.user.level || 1;
        const requiredLevel = event.level || 1;

        if (userLevel < requiredLevel) {
            toast.error(`You need to be level ${requiredLevel} or higher to book this event. Your current level is ${userLevel}.`);
            return;
        }

        // Collect booking info from user
        let email = user.user.email || "";
        let phone = user.user.phone || "";
        if (!email) {
            email = prompt("Enter your email for booking:", email);
            if (!email) {
                toast.error("Email is required for booking.");
                return;
            }
        }
        if (!phone) {
            phone = prompt("Enter your phone number for booking:", phone);
            if (!phone) {
                toast.error("Phone number is required for booking.");
                return;
            }
        }

        // Ask for number of participants (default 1)
        let participants = 1;
        const maxParticipants = event.maxParticipants || 20;
        if (maxParticipants > 1) {
            const input = prompt(`How many participants? (1-${maxParticipants})`, "1");
            const parsed = parseInt(input, 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= maxParticipants) {
                participants = parsed;
            }
        }

        // Calculate amount (if event has price)
        let price = event.price || 0;
        let amount = price * participants;
        if (isNaN(amount) || amount < 0) amount = 0;

        // Prepare booking data (ensure all required fields are present and valid)
        // Try to send all possible event IDs for backend compatibility
        const eventId = event._id || event.id || event.eventId || id;
        const safeParticipants = Number(participants) > 0 ? Number(participants) : 1;
        const safeAmount = Number(amount) >= 0 ? Number(amount) : 0;
        const safeEmail = String(email).trim();
        const safePhone = String(phone).trim();
        const bookingData = {
            event: eventId,
            participants: safeParticipants,
            contactInfo: { email: safeEmail, phone: safePhone },
            amount: safeAmount,
            paymentMethod: paymentMethod, // Use selected payment method
        };

        // Debug: log bookingData before sending
        // eslint-disable-next-line no-console
        console.log("Booking Data:", bookingData, { event, id });

        // Validate all required fields before sending
        if (!bookingData.event || !bookingData.participants || !bookingData.contactInfo.email || !bookingData.contactInfo.phone || isNaN(bookingData.amount)) {
            toast.error("Missing required booking fields. Please check your input.");
            return;
        }

        try {
            // Check if event is free
            const isFreeEvent = safeAmount === 0;
            const messageText = isFreeEvent ? "Confirming your free event booking..." : "Creating your booking...";
            toast.loading(messageText);

            const response = await createEventBooking(bookingData);
            toast.dismiss();
            
            // Debug: log API response - Check response structure
            // eslint-disable-next-line no-console
            console.log("🔵 Full API Response:", response);
            console.log("🔵 Response.data:", response?.data);
            console.log("🔵 Response.data.paymentMethod:", response?.data?.paymentMethod);
            console.log("🔵 Response.data.paymentOrder:", response?.data?.paymentOrder);
            console.log("🔵 isFreeEvent:", isFreeEvent);

            // Check payment method FIRST before checking for checkout_url
            if (isFreeEvent) {
                // Free event - no payment needed
                toast.success("Booking confirmed! Check your bookings.");
                navigate("/my-bookings");
            } else if (response?.data?.paymentMethod === "paypal") {
                // For PayPal, redirect to PayPal approval URL
                const paymentOrder = response?.data?.paymentOrder;
                let approvalUrl = null;

                // Debug log to see response structure
                console.log("🔵 PayPal Order Response:", paymentOrder);

                // Try to find approval link
                if (paymentOrder?.links && Array.isArray(paymentOrder.links)) {
                    // Look for "approve" link
                    const approveLink = paymentOrder.links.find(
                        link => link.rel === "approve"
                    );
                    approvalUrl = approveLink?.href;
                    console.log("🔵 Found approve link href:", approvalUrl);
                }

                // Fallback to approve_url if links not found (older API versions)
                if (!approvalUrl && paymentOrder?.approve_url) {
                    approvalUrl = paymentOrder.approve_url;
                }

                console.log("🔵 Final approval URL:", approvalUrl);

                if (approvalUrl) {
                    console.log("🔵 🔵 🔵 REDIRECTING TO PAYPAL:", approvalUrl);
                    toast.success("Booking created! Redirecting to PayPal...");
                    // Use a small delay to ensure toast is shown
                    setTimeout(() => {
                        window.location.href = approvalUrl;
                    }, 500);
                } else {
                    console.error("❌ No approval URL found!");
                    console.error("❌ PayPal response links:", paymentOrder?.links);
                    console.error("❌ Full PayPal response:", paymentOrder);
                    toast.error("Failed to get PayPal checkout URL. Order ID: " + paymentOrder?.id);
                }
            } else if (response?.data?.paymentMethod === "revolut" || response?.data?.paymentOrder?.checkout_url) {
                // For Revolut, redirect to Revolut checkout
                const checkoutUrl = response?.data?.paymentOrder?.checkout_url;
                console.log("🔴 Redirecting to Revolut:", checkoutUrl);
                toast.success("Booking created! Redirecting to Revolut...");
                setTimeout(() => {
                    window.location.href = checkoutUrl;
                }, 500);
            } else {
                // No payment method detected, assume booking confirmed
                console.warn("⚠️ Unexpected state - paymentMethod:", response?.data?.paymentMethod);
                toast.success("Booking created! Check your bookings.");
                navigate("/my-bookings");
            }
        } catch (err) {
            toast.dismiss();
            // Debug: log error
            // eslint-disable-next-line no-console
            console.error("Booking error:", err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to create booking. Please try again.");
            }
        }
    };

    const canBook = () => {
        if (!user?.user) return false;
        const userLevel = user.user.level || 1;
        const requiredLevel = event?.level || 1;
        return userLevel >= requiredLevel;
    };

    const getBookingButtonText = () => {
        if (!user?.user) return "Login to Book";
        if (!canBook()) return `Level ${event?.level || 1} Required`;
        
        const price = event?.price || 0;
        if (price === 0) {
            return "Book Now - FREE";
        }
        return `Book Now - £${price.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Event</h2>
                    <p className="text-gray-600 mb-4">{error || "Event not found"}</p>
                    <Button onClick={() => navigate("/")} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Images */}
                        {event.medias && event.medias.length > 0 && (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                        {event.medias.map((imageUrl, index) => (
                                            <div
                                                key={index}
                                                className="aspect-video rounded-lg overflow-hidden bg-gray-100"
                                            >
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt={`Event image ${index + 1}`}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                        e.target.nextSibling.style.display = "flex";
                                                    }}
                                                />
                                                <div
                                                    className="hidden w-full h-full items-center justify-center bg-gray-100 text-gray-400 text-sm"
                                                    style={{ display: "none" }}
                                                >
                                                    Image not available
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Event Details */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl md:text-3xl font-bold">
                                            {event.title}
                                        </CardTitle>
                                        <div className="flex items-center mt-2 space-x-4">
                                            <Badge variant="secondary">
                                                <Star className="mr-1 h-3 w-3" />
                                                Level {event.level || 1}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
                                                <p className="font-medium">{formatDisplayDate(event.date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Time</p>
                                                <p className="font-medium">
                                                    {formatDisplayTime(event.startTime)}
                                                    {event.endTime ? ` - ${formatDisplayTime(event.endTime)}` : ""}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-medium">{event.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Book This Event</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user?.user && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Your Level: {user.user.level || 1}</p>
                                        <p className="text-sm text-gray-600">Required Level: {event.level || 1}</p>
                                    </div>
                                )}

                                {/* Price Display */}
                                <div className={`p-3 rounded-lg ${event.price && event.price > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                                    {event.price && event.price > 0 ? (
                                        <p className="text-sm font-semibold text-blue-900">
                                            Price: <span className="text-xl">£{event.price.toFixed(2)}</span> per person
                                        </p>
                                    ) : (
                                        <p className="text-sm font-semibold text-green-900">
                                            ✓ This event is FREE
                                        </p>
                                    )}
                                </div>

                                {/* Payment Method Selection (only for paid events) */}
                                {event.price && event.price > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-gray-700">Select Payment Method:</p>
                                        <div className="space-y-2">
                                            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors" style={{borderColor: paymentMethod === 'revolut' ? '#0066ff' : '#e5e7eb'}}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="revolut"
                                                    checked={paymentMethod === 'revolut'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-900">Revolut</p>
                                                    <p className="text-xs text-gray-500">Fast and secure payment</p>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors" style={{borderColor: paymentMethod === 'paypal' ? '#003087' : '#e5e7eb'}}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="paypal"
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-900">PayPal</p>
                                                    <p className="text-xs text-gray-500">Trusted payment platform</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleBooking}
                                    disabled={user?.user && !canBook()}
                                    className="w-full"
                                    size="lg"
                                >
                                    {getBookingButtonText()}
                                </Button>

                                {user?.user && !canBook() && (
                                    <p className="text-sm text-red-600 text-center">
                                        You need to reach level {event.level || 1} to book this event.
                                    </p>
                                )}

                                {!user?.user && (
                                    <p className="text-sm text-gray-600 text-center">
                                        Sign in to book this event and see personalized recommendations.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Required Level</span>
                                    <Badge variant="outline">Level {event.level || 1}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Time</span>
                                    <span className="font-medium">
                                        {formatDisplayTime(event.startTime)}
                                        {event.endTime ? ` - ${formatDisplayTime(event.endTime)}` : ""}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
