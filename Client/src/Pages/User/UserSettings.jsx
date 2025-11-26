import React, { useState } from 'react'
import { Separator } from "../../components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useAuth } from '../AuthProvider'
import { toast } from 'sonner'
import { UpdatePassword, VerifyNewEmail, UpdateEmail } from '../../Auth/UserAuth'

export const UserSettings = () => {
    const { user } = useAuth();
    const userProfile = {
        name: user?.user?.name || "John Doe",
        email: user?.user?.email || "",
        level: user?.user?.level || "Beginner",
        joinDate: user?.user?.joinDate || "2023-01-01",
        completedAdventures: user?.user?.completedAdventures || 0,
        experience: user?.user?.experience || 400,
        nextLevel: user?.user?.nextLevel || 1000,
        profilePicture: user?.user?.profilePicture || null,
    }

    // Controlled fields for a more professional and editable form
    const [fullName, setFullName] = useState(userProfile.name);
    const [extpassword, setExtPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState(userProfile.email);
    const [isEmailChanged, setIsEmailChanged] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePassword = async () => {
        if (extpassword === "" || newpassword === "") {
            toast.error("Please fill in all fields.");
            return;
        }
        const res = await UpdatePassword({
            extpassword: extpassword,
            newpassword: newpassword,
        });
        
        if (res.statusCode === 200) {
            toast.success("Password updated successfully.");
            setExtPassword("");
            setNewPassword("");
        }
        else if (res.status === 400) {
            toast.error("Current password is incorrect.");
        }
        else {
            toast.error("Something went wrong. Please try again later.");
        }
    }

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setNewEmail(value);
        setIsEmailChanged(value !== userProfile.email && value !== "");
    }

    const handleEmailUpdate = async () => {
        if (!newEmail || newEmail === userProfile.email) {
            toast.error("Please enter a new email address");
            return;
        }
        setLoading(true);
        try {
            const res = await VerifyNewEmail(newEmail);
            if (res.status === 200) {
                setOtpSent(true);
                toast.success("OTP sent to your new email address");
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            toast.error("An error occurred while verifying email");
        } finally {
            setLoading(false);
        }
    }

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }
        setLoading(true);
        try {
            const data = { email: newEmail, otp: otp };
            const res = await UpdateEmail(data);
            if (res.status === 200) {
                toast.success("Email updated successfully");
                setOtpSent(false);
                setOtp("");
                setNewEmail("");
                setIsEmailChanged(false);
                window.location.reload();
                // Update the user profile in context if needed
            } else if (res === 400) {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("An error occurred while verifying OTP");
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="flex">
            <div className="w-full">
                <Card className="rounded-2xl border-gray-200">
                    <CardHeader>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <CardTitle>Profile & Account</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">Manage your profile, email and security settings</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-3">Personal Information</h4>
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700">
                                        {userProfile.profilePicture ? "" : userProfile.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{userProfile.name}</div>
                                        <div className="text-sm text-gray-500">{new Date(userProfile.joinDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full name</label>
                                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <div className="relative">
                                            <Input
                                                value={newEmail}
                                                onChange={handleEmailChange}
                                                className="rounded-xl pr-24"
                                            />
                                            {!otpSent && isEmailChanged && (
                                                <Button
                                                    onClick={handleEmailUpdate}
                                                    disabled={loading}
                                                    size="sm"
                                                    className="absolute right-2 top-1 h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {loading ? "..." : "Send OTP"}
                                                </Button>
                                            )}
                                            {otpSent && (
                                                <Button
                                                    onClick={verifyOtp}
                                                    disabled={loading || !otp}
                                                    size="sm"
                                                    className="absolute right-2 top-1 h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
                                                >
                                                    {loading ? "..." : "Verify"}
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Update your contact email. We'll verify via an OTP.</p>

                                        {otpSent && (
                                            <div className="mt-2">
                                                <Input
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="rounded-xl text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-medium mb-3">Change password</h4>
                            <p className="text-sm text-gray-500 mb-3">Choose a strong password you haven't used elsewhere.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current password</label>
                                    <Input type="password" placeholder="Enter current password" value={extpassword} onChange={(e) => { setExtPassword(e.target.value) }} className="rounded-xl border py-1 px-3" />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <label className="text-sm font-medium">New password</label>
                                    <Input type="password" placeholder="Choose a new password" value={newpassword} onChange={(e) => { setNewPassword(e.target.value) }} className="rounded-xl border py-1 px-3" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button onClick={() => { handlePassword() }} className="rounded-xl bg-black hover:bg-gray-800 text-white">Save changes</Button>
                            <Button onClick={() => { setFullName(userProfile.name); setNewEmail(userProfile.email); setIsEmailChanged(false); setOtpSent(false); setOtp("") }} variant="ghost" className="rounded-xl">Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
