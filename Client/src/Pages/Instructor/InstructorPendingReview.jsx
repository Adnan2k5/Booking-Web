import React from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

const InstructorPendingReview = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-8 bg-gray-50">
      <Card className="w-full max-w-lg p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Application Under Review</h1>
        <p className="text-gray-600 mb-6">
          Thank you for registering as an instructor! Your information and documents are under review. We will contact you soon after verification is complete.
        </p>
        <Button className="bg-black text-white" onClick={() => navigate("/")}>Back to Home</Button>
      </Card>
    </div>
  )
}

export default InstructorPendingReview
