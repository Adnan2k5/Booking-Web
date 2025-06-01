import React from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

const InstructorPendingReview = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 lg:p-10 shadow-lg text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-6 text-gray-800">
          Application Under Review
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
          Thank you for registering as an instructor! Your information and documents are under review. We will contact you soon after verification is complete.
        </p>
        <Button
          className="bg-black text-white w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  )
}

export default InstructorPendingReview
