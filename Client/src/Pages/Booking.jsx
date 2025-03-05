import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import mock_adventure from "../Data/mock_adventure.json";
import mock_instructor from "../Data/mock_instructor.json";
import {  Star, MapPin, Clock,ArrowLeft } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { useSelector } from "react-redux";
import { Modal } from "antd";
import "../../src/index.css";
import "./booking.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Booking = () => {
  const {user} = useSelector((state)=>state.user);
  const adventureList = mock_adventure;
  const location = useLocation();
  const query = new URLSearchParams(location?.search);
  const id = query.get("id");
  const adventure = adventureList.find((item) => item.id === Number(id));
  const instructorList = mock_instructor.filter(
    (instructor) => instructor.adventure === adventure?.name
  );

  const [isChecked, setIsChecked] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [openedit, setopenedit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
  });
  const [bookingSummary, setBookingSummary] = useState({
    adventure: adventure?.name || "Adventure",
    date: "2025-02-26",
    instructor: "",
    price: adventure?.price || "0",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedInstructor) {
      setBookingSummary((prev) => ({
        ...prev,
        instructor: selectedInstructor.name,
      }));
    }
  }, [selectedInstructor]);

  const onSelect = (instructor) => {
    setSelectedInstructor(instructor);
    setIsChecked(true);
  };

  const onCancel = () => {
    setSelectedInstructor(null);
    setIsChecked(false);
  };

  const handleOk = () => {
    setopenedit(false);
  };

  const handleCancel = () => {
    setopenedit(false);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setProfileData({
      name: formData.get("name") || profileData.name,
      email: formData.get("email") || profileData.email,
      phone: formData.get("phone") || profileData.phone,
    });
    setopenedit(false);
  };

  const handleConfirmBooking = () => {
    // Handle booking confirmation
    console.log("Booking confirmed:", bookingSummary);
  };

  const GoBack = () => {
    window.history.back();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
         <ArrowLeft className="cursor-pointer" onClick={GoBack}/> Book Your Adventure
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Adventure Details */}
          <div className="w-full lg:w-2/5 space-y-6 flex flex-col justify-between">
            <div key={adventure.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {adventure ? (
                <>
                  <img
                    src={
                      adventure.img || "/placeholder.svg?height=400&width=600"
                    }
                    alt={adventure.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {adventure.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {adventure.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span>{adventure.date}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <p className="text-lg text-gray-600">Adventure not found!</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Location
              </h3>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Location map"
                  className="rounded-lg object-cover"
                />
              </div>
              <p className="text-gray-600">
                Our adventure takes place in a scenic location with breathtaking
                views and exciting challenges.
              </p>
            </div>
          </div>

          {/* Right Section - Instructors & Form */}
          <div className="w-full lg:w-3/5">
            {/* Instructor Selection */}
            <div
              className={`bg-white rounded-lg shadow-md  transition-all duration-500 ease-in-out ${
                selectedInstructor
                  ? "opacity-0 h-0 overflow-hidden"
                  : "opacity-100"
              }`}
            >
              <h2 className="text-2xl p-6 font-bold text-gray-800 mb-6">
                Select Your Instructor
              </h2>
              <div className="space-y-4">
                {instructorList.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="flex items-center gap-4 p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-300"
                  >
                    <img
                      src={
                        instructor.profile_photo ||
                        "/placeholder.svg?height=100&width=100"
                      }
                      alt={instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {instructor.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(instructor.ratings)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill={
                                  i < Math.floor(instructor.ratings)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {instructor.ratings}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 font-semibold mb-2">
                        ${instructor.charges}
                      </p>
                      <button
                        onClick={() => onSelect(instructor)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div
              className={`bg-white rounded-lg shadow-md p-6 transition-all duration-500 ease-in-out ${
                selectedInstructor
                  ? "opacity-100"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Booking Form
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="title flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Your Profile
                    </h3>
                    <button
                      onClick={() => setopenedit(true)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-sm mr-4"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={selectedInstructor?.profile_photo}
                        alt="Your profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-gray-800 font-semibold">
                          {profileData.name}
                        </h4>
                        <p className="text-gray-600">{profileData.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="title flex justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Selected Instructor
                    </h3>
                    <button
                      onClick={onCancel}
                      className="text-blue-500 hover:text-gray-800 text-sm transition-colors duration-300"
                    >
                      Change Instructor
                    </button>
                  </div>

                  {selectedInstructor && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            selectedInstructor.profile_photo ||
                            "/placeholder.svg?height=100&width=100"
                          }
                          alt={selectedInstructor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-gray-800 font-semibold">
                            {selectedInstructor.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Star
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                            />
                            <span className="text-gray-600 text-sm">
                              {selectedInstructor.ratings}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Booking Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Adventure:</span>
                    <span className="text-gray-800 font-medium">
                      {bookingSummary.adventure}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-800 font-medium">
                      {bookingSummary.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Instructor:</span>
                    <span className="text-gray-800 font-medium">
                      {bookingSummary.instructor}
                    </span>
                  </div>
                  <div className="flex flex-col  pt-3 border-t border-gray-200">
                    <div className="charge1 flex justify-between">
                      <span className="text-gray-800 font-semibold">
                        Instructor Charges:
                      </span>
                      <span className="text-blue-600 font-bold text-xl">
                        ${selectedInstructor?.charges}
                      </span>
                    </div>
                    <div className="charge2 flex justify-between">
                      <span className="text-gray-800 font-semibold">
                        Platform fee:
                      </span>
                      <span className="text-blue-600 font-bold text-xl">
                        ${Math.ceil(selectedInstructor?.charges * 0.12)}
                      </span>
                    </div>
                    <div className="total flex justify-between">
                      <span className="text-gray-800 font-semibold">
                        Total Charges:
                      </span>
                      <span className="text-blue-600 font-bold text-xl">
                        ${Math.ceil(selectedInstructor?.charges * 1.12)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreement"
                    checked={isChecked}
                    onClick={() => setIsChecked(!isChecked)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    I agree to the terms and conditions, including the privacy
                    policy and the use of my data for processing this booking.
                  </label>
                </div>

                <button
                  className={`w-full py-3 rounded-md font-medium text-white transition-all duration-300 ${
                    isChecked
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isChecked}
                  onClick={handleConfirmBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Modal
        title="Edit Profile Details"
        open={openedit}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="professional-modal"
      >
        <form className="space-y-4 py-5" onSubmit={handleProfileUpdate}>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={profileData.name}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={profileData.email}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={profileData.phone}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Update Profile
          </button>
        </form>
      </Modal>

      {/* Footer */}
      <Footer/>
    </div>
  );
};
