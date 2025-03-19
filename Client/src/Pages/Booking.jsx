"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Star,
  ArrowLeft,
  ChevronRight,
  Building,
  Check,
  Map,
  Users,
  ShoppingCart,
  ClipboardCheck,
  Plus,
  Minus,
  Eye,
  X,
  Award,
  Clock,
  Heart,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Modal } from "antd";
import mock_adventure from "../Data/mock_adventure";
import { useAuth } from "./AuthProvider";

// Mock data for items
const mockItems = [
  {
    id: 1,
    name: "Adventure Backpack",
    price: 89.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Hiking Boots",
    price: 129.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Water Bottle",
    price: 24.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Camping Tent",
    price: 199.99,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
  },
];

// Mock data for hotels
const mockHotels = [
  {
    id: 1,
    name: "Mountain View Resort",
    price: 189,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    location: "Alpine Heights",
  },
  {
    id: 2,
    name: "Lakeside Retreat",
    price: 159,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    location: "Crystal Lake",
  },
  {
    id: 3,
    name: "Forest Cabin Lodge",
    price: 129,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.5,
    location: "Evergreen Forest",
  },
  {
    id: 4,
    name: "Sunset Beach Hotel",
    price: 219,
    img: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    location: "Golden Coast",
  },
];

// Mock data for instructors
const mockInstructors = [
  {
    id: 1,
    name: "Alex Johnson",
    specialty: "Mountain Hiking",
    experience: "8 years",
    rating: 4.9,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Certified mountain guide with expertise in alpine terrain and wilderness survival.",
    achievements: [
      "Summit of Mt. Everest",
      "Led 200+ expeditions",
      "Wilderness First Responder",
    ],
    languages: ["English", "Spanish", "French"],
    reviews: [
      {
        user: "Sarah M.",
        comment: "Alex was an amazing guide! Very knowledgeable and patient.",
        rating: 5,
      },
      {
        user: "John D.",
        comment: "Great experience, felt very safe the entire time.",
        rating: 5,
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "Rock Climbing",
    experience: "6 years",
    rating: 4.8,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Professional climber with experience leading expeditions across three continents.",
    achievements: [
      "Free-climbed El Capitan",
      "National Climbing Champion",
      "Authored 'Vertical World'",
    ],
    languages: ["English", "Mandarin", "German"],
    reviews: [
      {
        user: "Mike T.",
        comment: "Sarah's techniques really improved my climbing skills.",
        rating: 5,
      },
      {
        user: "Lisa R.",
        comment: "Very professional and encouraging.",
        rating: 4,
      },
    ],
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    specialty: "Wilderness Survival",
    experience: "10 years",
    rating: 4.7,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Former military survival expert specializing in natural navigation and foraging.",
    achievements: [
      "Military Survival Instructor",
      "Survived 30 days in the Amazon",
      "TV Show Consultant",
    ],
    languages: ["English", "Spanish", "Portuguese"],
    reviews: [
      {
        user: "David K.",
        comment: "Miguel taught me skills I'll use for a lifetime.",
        rating: 5,
      },
      {
        user: "Emma P.",
        comment: "Incredible knowledge of local plants and wildlife.",
        rating: 4,
      },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    specialty: "Nature Photography",
    experience: "5 years",
    rating: 4.6,
    img: "/placeholder.svg?height=400&width=300",
    bio: "Award-winning photographer who combines adventure with capturing stunning landscapes.",
    achievements: [
      "National Geographic Feature",
      "Wildlife Photographer of the Year Finalist",
      "Published in 'Outdoor Magazine'",
    ],
    languages: ["English", "Italian"],
    reviews: [
      {
        user: "Robert J.",
        comment:
          "Emma helped me capture amazing shots I never thought possible.",
        rating: 5,
      },
      {
        user: "Sophia L.",
        comment: "Great tips for landscape composition and lighting.",
        rating: 4,
      },
    ],
  },
];

export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState();
  const [selectedInstructor, setSelectedInstructor] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [adventure, setAdventure] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState();

  // Parse the adventure ID from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const adventureId = query.get("id");

    if (adventureId) {
      // Find the adventure in mock data
      const foundAdventure = mock_adventure.find(
        (adv) => adv.id.toString() === adventureId
      );
      if (foundAdventure) {
        setAdventure(foundAdventure);
      } else {
        // Fallback or error handling
        navigate("/");
      }
    } else {
      // No ID provided, redirect back
      navigate("/");
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location, navigate]);

  const handleAddToCart = (itemId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (existingItem) {
        // Increment quantity if item already in cart
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prev, { id: itemId, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        // Decrement quantity if more than 1
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Remove item if quantity would be 0
        return prev.filter((item) => item.id !== itemId);
      }
    });
  };

  const handleHotelSelect = (hotelId) => {
    setSelectedHotel((prev) => (prev === hotelId ? null : hotelId));
  };

  const handleInstructorSelect = (instructorId) => {
    setSelectedInstructor((prev) =>
      prev === instructorId ? null : instructorId
    );
  };

  const openInstructorModal = (instructor) => {
    setCurrentInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Proceed to payment/confirmation
      navigate("/confirmation");
    }
  };

  const handleSkip = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(-1);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    const adventurePrice = adventure?.price || 0;

    const itemsPrice = cartItems.reduce((sum, item) => {
      const itemData = mockItems.find((i) => i.id === item.id);
      return sum + (itemData?.price || 0) * item.quantity;
    }, 0);

    const hotelPrice = selectedHotel
      ? mockHotels.find((hotel) => hotel.id === selectedHotel)?.price || 0
      : 0;

    const instructorPrice = selectedInstructor ? 50 : 0; // Fixed price for instructor

    return adventurePrice + itemsPrice + hotelPrice + instructorPrice;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    }),
  };

  // If still loading or adventure not found
  if (isLoading || !adventure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-24 w-24 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 p-4 sm:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Book Your Adventure
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { step: 1, icon: <Map size={18} />, label: "Adventure" },
              { step: 2, icon: <Users size={18} />, label: "Instructor" },
              { step: 3, icon: <ShoppingCart size={18} />, label: "Shop" },
              { step: 4, icon: <Building size={18} />, label: "Hotel" },
              { step: 5, icon: <ClipboardCheck size={18} />, label: "Summary" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                    currentStep === item.step
                      ? "bg-blue-600 text-white"
                      : currentStep > item.step
                      ? "bg-green-500 text-white"
                      : "bg-white/70 backdrop-blur-sm text-gray-400"
                  )}
                >
                  {currentStep > item.step ? <Check size={18} /> : item.icon}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStep === item.step
                      ? "text-blue-600"
                      : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Main content area with steps */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={currentStep}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2 overflow-hidden rounded-xl">
                      <motion.img
                        src={
                          adventure.img ||
                          "/placeholder.svg?height=300&width=500"
                        }
                        alt={adventure.name}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="md:w-1/2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin size={16} />
                          <span>{adventure.location}</span>
                          <span className="text-gray-300">•</span>
                          <span>{formatDate(adventure.date)}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          {adventure.name}
                        </h2>
                        <div className="flex items-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="text-sm ml-1 text-gray-500">
                            4.8
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Experience the thrill of adventure with our expert
                          guides. This adventure includes equipment, lunch, and
                          transportation from the meeting point.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          ${adventure.price}
                        </div>
                        <Badge className="bg-green-500 hover:bg-green-600">
                          +{adventure.exp} EXP
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      Select an Instructor
                    </h2>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {mockInstructors.map((instructor) => (
                      <motion.div key={instructor.id} variants={itemVariants}>
                        <Card
                          className={cn(
                            "overflow-hidden h-full transition-all duration-300 border-2",
                            selectedInstructor === instructor.id
                              ? "border-blue-500 shadow-md shadow-blue-200"
                              : "border-transparent hover:border-blue-200"
                          )}
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 p-4 flex justify-center items-start">
                              <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                                <AvatarImage
                                  src={instructor.img}
                                  alt={instructor.name}
                                />
                                <AvatarFallback>
                                  {instructor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="md:w-2/3 p-4">
                              <h3 className="text-lg font-bold text-gray-800 mb-1">
                                {instructor.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span>{instructor.specialty}</span>
                                <span className="text-gray-300">•</span>
                                <span>{instructor.experience}</span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="text-xs ml-1 text-gray-500">
                                  {instructor.rating}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {instructor.bio}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-blue-600">
                                  $50
                                  <span className="text-sm font-normal text-gray-500">
                                    /session
                                  </span>
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() =>
                                      openInstructorModal(instructor)
                                    }
                                  >
                                    <Eye size={14} />
                                    View Profile
                                  </Button>
                                  <Button
                                    variant={
                                      selectedInstructor === instructor.id
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    className={
                                      selectedInstructor === instructor.id
                                        ? "bg-blue-600"
                                        : ""
                                    }
                                    onClick={() =>
                                      handleInstructorSelect(instructor.id)
                                    }
                                  >
                                    {selectedInstructor === instructor.id
                                      ? "Selected"
                                      : "Select"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex items-center gap-2 mb-6">
                    <ShoppingCart className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      Shop Items
                    </h2>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {mockItems.map((item) => {
                      const cartItem = cartItems.find(
                        (ci) => ci.id === item.id
                      );
                      const quantity = cartItem ? cartItem.quantity : 0;

                      return (
                        <motion.div key={item.id} variants={itemVariants}>
                          <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={item.img || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {quantity > 0 && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    {quantity}
                                  </div>
                                </div>
                              )}
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-bold text-gray-800">
                                {item.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="text-xs ml-1 text-gray-500">
                                  {item.rating}
                                </span>
                              </div>
                            </CardContent>
                            <CardFooter className="pt-2 flex justify-between items-center">
                              <span className="font-bold text-blue-600">
                                ${item.price}
                              </span>

                              {quantity > 0 ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() =>
                                      handleRemoveFromCart(item.id)
                                    }
                                  >
                                    <Minus size={14} />
                                  </Button>
                                  <span className="w-6 text-center font-medium">
                                    {quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleAddToCart(item.id)}
                                  >
                                    <Plus size={14} />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleAddToCart(item.id)}
                                >
                                  <Plus size={14} />
                                  Add to Cart
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Cart Summary */}
                  {cartItems.length > 0 && (
                    <motion.div
                      className="mt-8 bg-blue-50 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Your Cart
                      </h3>
                      <div className="space-y-3">
                        {cartItems.map((cartItem) => {
                          const item = mockItems.find(
                            (i) => i.id === cartItem.id
                          );
                          return (
                            <div
                              key={cartItem.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                  <img
                                    src={item?.img || "/placeholder.svg"}
                                    alt={item?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {cartItem.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="font-medium text-blue-600">
                                $
                                {(
                                  (item?.price || 0) * cartItem.quantity
                                ).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                        <div className="pt-3 border-t border-blue-200 flex justify-between items-center font-bold">
                          <span>Cart Total</span>
                          <span className="text-blue-600">
                            $
                            {cartItems
                              .reduce((sum, item) => {
                                const itemData = mockItems.find(
                                  (i) => i.id === item.id
                                );
                                return (
                                  sum + (itemData?.price || 0) * item.quantity
                                );
                              }, 0)
                              .toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex items-center gap-2 mb-6">
                    <Building className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      Select Accommodation
                    </h2>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {mockHotels.map((hotel) => (
                      <motion.div key={hotel.id} variants={itemVariants}>
                        <Card
                          className={cn(
                            "overflow-hidden h-full transition-all duration-300 cursor-pointer border-2",
                            selectedHotel === hotel.id
                              ? "border-blue-500 shadow-md shadow-blue-200"
                              : "border-transparent hover:border-blue-200"
                          )}
                          onClick={() => handleHotelSelect(hotel.id)}
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/5 h-full">
                              <img
                                src={hotel.img || "/placeholder.svg"}
                                alt={hotel.name}
                                className="w-full h-full object-cover md:h-48"
                              />
                            </div>
                            <div className="md:w-3/5 p-4">
                              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <MapPin size={14} />
                                <span>{hotel.location}</span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {hotel.name}
                              </h3>
                              <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="text-xs ml-1 text-gray-500">
                                  {hotel.rating}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-blue-600">
                                  ${hotel.price}
                                  <span className="text-sm font-normal text-gray-500">
                                    /night
                                  </span>
                                </span>
                                <Badge
                                  variant={
                                    selectedHotel === hotel.id
                                      ? "default"
                                      : "outline"
                                  }
                                  className={
                                    selectedHotel === hotel.id
                                      ? "bg-blue-600"
                                      : ""
                                  }
                                >
                                  {selectedHotel === hotel.id
                                    ? "Selected"
                                    : "Select"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                custom={1}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
                  <div className="flex items-center gap-2 mb-6">
                    <ClipboardCheck className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      Booking Summary
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - User and Adventure */}
                    <div>
                      {/* User Profile */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Your Profile
                        </h3>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                            <AvatarFallback>
                              {user?.user?.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user?.user?.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              Adventure Enthusiast
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Adventure Details */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Adventure Details
                        </h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={adventure.img || "/placeholder.svg"}
                                alt={adventure.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {adventure.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>{adventure.location}</span>
                                <span className="text-gray-300">•</span>
                                <span>{formatDate(adventure.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                            <span className="text-gray-600">
                              Adventure Price
                            </span>
                            <span className="font-medium">
                              ${adventure.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Instructor Details (if selected) */}
                      {selectedInstructor && (
                        <div className="bg-blue-50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Your Instructor
                          </h3>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                              <AvatarImage
                                src={
                                  mockInstructors.find(
                                    (i) => i.id === selectedInstructor
                                  )?.img
                                }
                                alt={
                                  mockInstructors.find(
                                    (i) => i.id === selectedInstructor
                                  )?.name
                                }
                              />
                              <AvatarFallback>
                                {mockInstructors
                                  .find((i) => i.id === selectedInstructor)
                                  ?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">
                                {
                                  mockInstructors.find(
                                    (i) => i.id === selectedInstructor
                                  )?.name
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                {
                                  mockInstructors.find(
                                    (i) => i.id === selectedInstructor
                                  )?.specialty
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-100">
                            <span className="text-gray-600">
                              Instructor Fee
                            </span>
                            <span className="font-medium">$50</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right column - Items, Hotel, and Total */}
                    <div>
                      {/* Selected Items */}
                      {cartItems.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Selected Items
                          </h3>
                          <div className="space-y-3">
                            {cartItems.map((cartItem) => {
                              const item = mockItems.find(
                                (i) => i.id === cartItem.id
                              );
                              return (
                                <div
                                  key={cartItem.id}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={item?.img || "/placeholder.svg"}
                                      alt={item?.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      {item?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Qty: {cartItem.quantity}
                                    </p>
                                  </div>
                                  <div className="font-medium text-blue-600">
                                    $
                                    {(
                                      (item?.price || 0) * cartItem.quantity
                                    ).toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                              <span className="text-gray-600">Items Total</span>
                              <span className="font-medium">
                                $
                                {cartItems
                                  .reduce((sum, item) => {
                                    const itemData = mockItems.find(
                                      (i) => i.id === item.id
                                    );
                                    return (
                                      sum +
                                      (itemData?.price || 0) * item.quantity
                                    );
                                  }, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Selected Hotel */}
                      {selectedHotel && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Selected Accommodation
                          </h3>
                          <div className="flex items-start gap-3">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  mockHotels.find((h) => h.id === selectedHotel)
                                    ?.img || "/placeholder.svg"
                                }
                                alt={
                                  mockHotels.find((h) => h.id === selectedHotel)
                                    ?.name
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {
                                  mockHotels.find((h) => h.id === selectedHotel)
                                    ?.name
                                }
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>
                                  {
                                    mockHotels.find(
                                      (h) => h.id === selectedHotel
                                    )?.location
                                  }
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="text-xs ml-1 text-gray-500">
                                  {
                                    mockHotels.find(
                                      (h) => h.id === selectedHotel
                                    )?.rating
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="font-medium text-blue-600">
                              $
                              {
                                mockHotels.find((h) => h.id === selectedHotel)
                                  ?.price
                              }
                              <span className="text-xs font-normal text-gray-500">
                                /night
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Summary */}
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">
                          Payment Summary
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span>Adventure</span>
                            <span>${adventure.price}</span>
                          </div>

                          {cartItems.length > 0 && (
                            <div className="flex justify-between items-center">
                              <span>
                                Items (
                                {cartItems.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0
                                )}
                                )
                              </span>
                              <span>
                                $
                                {cartItems
                                  .reduce((sum, item) => {
                                    const itemData = mockItems.find(
                                      (i) => i.id === item.id
                                    );
                                    return (
                                      sum +
                                      (itemData?.price || 0) * item.quantity
                                    );
                                  }, 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                          )}

                          {selectedHotel && (
                            <div className="flex justify-between items-center">
                              <span>Hotel</span>
                              <span>
                                $
                                {
                                  mockHotels.find((h) => h.id === selectedHotel)
                                    ?.price
                                }
                              </span>
                            </div>
                          )}

                          {selectedInstructor && (
                            <div className="flex justify-between items-center">
                              <span>Instructor</span>
                              <span>$50</span>
                            </div>
                          )}
                        </div>

                        <Separator className="bg-white/20 my-4" />

                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <Button
                          onClick={() => navigate("/confirmation")}
                          className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50"
                        >
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons (only show if not on summary page) */}
        {currentStep < 5 && (
          <motion.div
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Booking Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Adventure</span>
                <span className="font-medium">${adventure.price}</span>
              </div>

              {cartItems.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-600">
                      Items (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                    </span>
                    <button
                      className="ml-2 text-xs text-blue-600 hover:underline"
                      onClick={() => setCurrentStep(3)}
                    >
                      Edit
                    </button>
                  </div>
                  <span className="font-medium">
                    $
                    {cartItems
                      .reduce((sum, item) => {
                        const itemData = mockItems.find(
                          (i) => i.id === item.id
                        );
                        return sum + (itemData?.price || 0) * item.quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              )}

              {selectedHotel && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-600">Hotel</span>
                    <button
                      className="ml-2 text-xs text-blue-600 hover:underline"
                      onClick={() => setCurrentStep(4)}
                    >
                      Edit
                    </button>
                  </div>
                  <span className="font-medium">
                    $
                    {mockHotels.find((hotel) => hotel.id === selectedHotel)
                      ?.price || 0}
                  </span>
                </div>
              )}

              {selectedInstructor && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-600">Instructor</span>
                    <button
                      className="ml-2 text-xs text-blue-600 hover:underline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Edit
                    </button>
                  </div>
                  <span className="font-medium">$50</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons (only show if not on summary page) */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
            >
              Back
            </Button>

            <div className="flex gap-3">
              {currentStep < 5 && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
                >
                  Skip
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                {currentStep === 4 ? "Review Booking" : "Next"}
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructor Profile Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
        className="instructor-modal"
      >
        {currentInstructor && (
          <div className="p-2">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Photo */}
              <div className="md:w-1/3">
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={currentInstructor.img || "/placeholder.svg"}
                    alt={currentInstructor.name}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <div className="mt-4 bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Award size={16} className="text-blue-600" />
                    Achievements
                  </h3>
                  <ul className="space-y-2">
                    {currentInstructor.achievements.map(
                      (achievement, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start gap-2"
                        >
                          <Check
                            size={14}
                            className="text-green-500 mt-1 flex-shrink-0"
                          />
                          <span>{achievement}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Right side - Details */}
              <div className="md:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {currentInstructor.name}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <span>{currentInstructor.specialty}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{currentInstructor.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">
                      {currentInstructor.rating}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-600">{currentInstructor.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentInstructor.languages.map((language, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50"
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Reviews
                    </h3>
                    <div className="space-y-3">
                      {currentInstructor.reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{review.user}</div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-3 h-3",
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="font-bold text-blue-600 text-xl">
                    $50
                    <span className="text-sm font-normal text-gray-500">
                      /session
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X size={14} />
                      Close
                    </Button>
                    <Button
                      className={cn(
                        "flex items-center gap-1",
                        selectedInstructor === currentInstructor.id
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      )}
                      onClick={() => {
                        handleInstructorSelect(currentInstructor.id);
                        setIsModalOpen(false);
                      }}
                    >
                      {selectedInstructor === currentInstructor.id ? (
                        <>
                          <Check size={14} />
                          Selected
                        </>
                      ) : (
                        <>
                          <Heart size={14} />
                          Select Instructor
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
