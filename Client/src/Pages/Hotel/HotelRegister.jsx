"use client"

import { useState, useEffect } from "react"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Modal } from "antd"
import { InputOTPSlot, InputOTP, InputOTPGroup } from "../../components/ui/input-otp"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { Textarea } from "../../components/ui/textarea"
import { VerifyUser } from "../../Auth/UserAuth"
import { axiosClient } from "../../AxiosClient/axios"
import { useNavigate } from "react-router-dom"
import { X, Upload, FileText, Building, MapPin, Phone, Mail, User, ImageIcon } from "lucide-react"
import { Checkbox } from "../../components/ui/checkbox"

export const HotelRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
        location: "",
        address: "",
        phone: "",
        managerName: "",
        rooms: "",
        amenities: [],
        profileImage: null,
        hotelImages: [],
        businessLicense: null,
        taxCertificate: null,
        insuranceDocument: null,
        role: "hotel",
    })

    const [error, setError] = useState("")
    const [otpDialog, setOtpDialog] = useState(false)
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const amenitiesList = [
        "Pool",
        "Spa",
        "Restaurant",
        "Bar",
        "Gym",
        "Conference Room",
        "Free WiFi",
        "Room Service",
        "Parking",
        "Beach Access",
        "Airport Shuttle",
        "Concierge",
        "Pet Friendly",
        "Laundry Service",
        "Business Center",
    ]

    const passValidation = () => {
        if (
            formData.password &&
            formData.confirmPassword &&
            formData.password.length > 0 &&
            formData.confirmPassword.length > 0
        ) {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match")
            } else {
                setError("")
            }
        }
    }

    useEffect(() => {
        passValidation()
    }, [formData.password, formData.confirmPassword])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAmenityChange = (amenity) => {
        setFormData((prev) => {
            const currentAmenities = [...prev.amenities]
            if (currentAmenities.includes(amenity)) {
                return {
                    ...prev,
                    amenities: currentAmenities.filter((item) => item !== amenity),
                }
            } else {
                return {
                    ...prev,
                    amenities: [...currentAmenities, amenity],
                }
            }
        })
    }

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profileImage: file,
            }))
        }
    }

    const handleHotelImagesChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length + formData.hotelImages.length > 6) {
            toast.error("You can upload up to 6 images only")
            return
        }

        const newImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }))

        setFormData((prev) => ({
            ...prev,
            hotelImages: [...prev.hotelImages, ...newImages],
        }))
    }

    const handleDocumentChange = (type, e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                [type]: file,
            }))
        }
    }

    const removeHotelImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            hotelImages: prev.hotelImages.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (error) {
            toast.error(error)
            return
        }

        // Validate required fields
        if (!formData.name) {
            toast.error("Hotel name is required")
            return
        }
        if (!formData.location) {
            toast.error("Location is required")
            return
        }
        if (!formData.description) {
            toast.error("Description is required")
            return
        }
        if (!formData.rooms || formData.rooms <= 0) {
            toast.error("Number of rooms is required and must be greater than 0")
            return
        }
        if (!formData.businessLicense) {
            toast.error("Business license is required")
            return
        }
        if (formData.hotelImages.length === 0) {
            toast.error("At least one hotel image is required")
            return
        }

        setLoading(true)
        const toastId = toast.loading("Processing your request...")

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("email", formData.email)
            data.append("password", formData.password)
            data.append("confirmPassword", formData.confirmPassword)
            data.append("description", formData.description)
            data.append("location", formData.location)
            data.append("address", formData.address)
            data.append("phone", formData.phone)
            data.append("managerName", formData.managerName)
            data.append("rooms", formData.rooms)
            data.append("role", formData.role)

            formData.amenities.forEach((amenity) => {
                data.append("amenities[]", amenity)
            })

            if (formData.profileImage) data.append("profileImage", formData.profileImage)
            if (formData.businessLicense) data.append("businessLicense", formData.businessLicense)
            if (formData.taxCertificate) data.append("taxCertificate", formData.taxCertificate)
            if (formData.insuranceDocument) data.append("insuranceDocument", formData.insuranceDocument)

            if (formData.hotelImages && formData.hotelImages.length > 0) {
                formData.hotelImages.forEach((image) => {
                    data.append("hotelImages", image.file)
                })
            }

            // This would be your actual API endpoint
            const response = await axiosClient.post("/api/auth/hotel/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            toast.success("Registration successful! Please verify OTP sent to your email.", { id: toastId })
            setOtpDialog(true)
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Registration failed"
            toast.error(message, { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    const cancel = () => {
        setOtpDialog(false)
        setOtp("")
    }

    const verifyOtp = async () => {
        const data = { email: formData.email, otp: otp }
        const res = await VerifyUser(data, dispatch)
        if (res === 200) {
            toast("Email Verified Successfully")
            setOtpDialog(false)
            setOtp("")
            navigate("/hotel/pending-review")
        } else if (res === 400) {
            toast("Invalid OTP")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-3 py-8 bg-gray-50">
            <Card className="w-full max-w-6xl p-6 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Hotel Registration</h1>
                    <p className="text-gray-600">Register your hotel to join our adventure platform</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Column - Basic Information */}
                        <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center">
                                        <Building className="h-4 w-4 mr-2" />
                                        Hotel Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter hotel name"
                                        required
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter hotel email address"
                                        required
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Create a password"
                                            required
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            required
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-red-500 text-sm">
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, State"
                                        required
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter complete address"
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Contact Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Contact number"
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="managerName" className="flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            Manager Name
                                        </Label>
                                        <Input
                                            id="managerName"
                                            name="managerName"
                                            value={formData.managerName}
                                            onChange={handleChange}
                                            placeholder="Hotel manager"
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rooms">Number of Rooms</Label>
                                    <Input
                                        id="rooms"
                                        name="rooms"
                                        type="number"
                                        value={formData.rooms}
                                        onChange={handleChange}
                                        placeholder="Total rooms available"
                                        min="1"
                                        required
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Additional Information */}
                        <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description">Hotel Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe your hotel, its features, and what makes it special..."
                                        className="min-h-32 transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Amenities</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {amenitiesList.map((amenity) => (
                                            <div key={amenity} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`amenity-${amenity}`}
                                                    checked={formData.amenities.includes(amenity)}
                                                    onCheckedChange={() => handleAmenityChange(amenity)}
                                                />
                                                <label
                                                    htmlFor={`amenity-${amenity}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {amenity}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profileImage" className="flex items-center">
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Hotel Logo/Profile Image
                                    </Label>
                                    <Input
                                        id="profileImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                    {formData.profileImage && (
                                        <div className="mt-2 w-24 h-24 relative">
                                            <img
                                                src={URL.createObjectURL(formData.profileImage) || "/placeholder.svg"}
                                                alt="Hotel Logo"
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hotelImages" className="flex items-center">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Hotel Images (Max 6)
                                    </Label>
                                    <Input
                                        id="hotelImages"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleHotelImagesChange}
                                        disabled={formData.hotelImages.length >= 6}
                                        className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.hotelImages.map((img, index) => (
                                            <div key={index} className="relative group w-[31%] h-24">
                                                <img
                                                    src={img.url || "/placeholder.svg"}
                                                    alt={`Hotel ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                    onClick={() => removeHotelImage(index)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium">Required Documents</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessLicense" className="flex items-center">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Business License
                                        </Label>
                                        <Input
                                            id="businessLicense"
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => handleDocumentChange("businessLicense", e)}
                                            required
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                        {formData.businessLicense && (
                                            <p className="text-sm text-green-600">{formData.businessLicense.name} uploaded</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="taxCertificate" className="flex items-center">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Tax Certificate
                                        </Label>
                                        <Input
                                            id="taxCertificate"
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => handleDocumentChange("taxCertificate", e)}
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                        {formData.taxCertificate && (
                                            <p className="text-sm text-green-600">{formData.taxCertificate.name} uploaded</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="insuranceDocument" className="flex items-center">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Insurance Document
                                        </Label>
                                        <Input
                                            id="insuranceDocument"
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => handleDocumentChange("insuranceDocument", e)}
                                            className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                                        />
                                        {formData.insuranceDocument && (
                                            <p className="text-sm text-green-600">{formData.insuranceDocument.name} uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-gray-200">
                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white transition-transform active:scale-95"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Submit Hotel Application"}
                        </Button>
                        <p className="mt-3 text-center text-sm text-gray-500">
                            By submitting, you agree to our terms and conditions. Your application will be reviewed by our team.
                        </p>
                    </div>
                </form>
            </Card>

            <Modal open={otpDialog} footer={null} onCancel={cancel}>
                <div className="space-y-2 flex flex-col items-center gap-4">
                    <h1>Enter One-Time Password sent</h1>
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <button onClick={verifyOtp} className="bg-black text-white rounded-2xl py-2 w-full">
                        Verify OTP
                    </button>
                </div>
            </Modal>
        </div>
    )
}
