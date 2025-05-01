"use client"

import { useState, useEffect } from "react"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Camera, Eye } from "lucide-react"
import { UserRegister, VerifyUser } from "../../Auth/UserAuth"
import { Modal } from "antd"
import { InputOTPSlot, InputOTP, InputOTPGroup } from "../../components/ui/input-otp"
import { toast } from "sonner"
import { useDispatch } from "react-redux"

export const InstructorRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "instructor",
    })

    const [error, seterror] = useState("")
    const [OtpDialog, setOtpDialog] = useState(false)
    const [otp, setOtp] = useState("")
    const dispatch = useDispatch();



    const passValidation = () => {
        if (formData.password && formData.confirmPassword && formData.password.length > 0 && formData.confirmPassword.length > 0) {
            if (formData.password !== formData.confirmPassword) {
                seterror("Passwords do not match")
            }
            else {
                seterror("")
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


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (error) {
            toast.error(error)
            return
        }
        const res = await UserRegister(formData)
        if (res === 201) {
            toast.success("Otp sent to your email")
            setOtpDialog(true)
        }
    }

    const getInitial = () => {
        return formData.name ? formData.name.charAt(0).toUpperCase() : "Hii"
    }

    const cancel = () => {
        setOtpDialog(false);
        setOtp("");
    };

    const verifyOtp = async () => {
        const data = { email: formData.email, otp: otp };
        const res = await VerifyUser(data, dispatch);
        if (res === 200) {
            toast("Email Verified Successfully");
            setOtpDialog(false);
            setOtp("");
        } else if (res === 400) {
            toast("Invalid Otp");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-3 py-8 bg-gray-50">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <div
                            className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer group">
                            <span className="text-3xl font-bold text-gray-600">{getInitial()}</span>
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                required
                                className="transition-all focus:ring-2 focus:ring-black focus:scale-[1.01]"
                            />
                        </div>

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
                        {error && (
                            <div className="text-red-500 text-sm">
                                <p>{error}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white transition-transform active:scale-95"
                    >
                        Register as Instructor
                    </Button>
                </form>
            </Card>
            <Modal open={OtpDialog} footer={null} onCancel={() => { cancel }}>
                <div className="space-y-2 flex flex-col items-center gap-4">
                    <h1>
                        Enter One-Time Password sent
                    </h1>
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <button
                        onClick={verifyOtp}
                        className="bg-black text-white rounded-2xl py-2 w-full"
                    >
                        Verify OTP
                    </button>
                </div>
            </Modal>
        </div>
    )
}
