import React from 'react'
import { Separator } from "../../components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useAuth } from '../AuthProvider'

export const UserSettings = () => {
    const { user } = useAuth();
    const userProfile = {
        name: user.user.name || "John Doe",
        email: user.user.email || "",
        level: user.user.level || "Beginner",
        joinDate: user.user.joinDate || "2023-01-01",
        completedAdventures: user.user.completedAdventures || 0,
        experience: user.user.experience || 400,
        nextLevel: user.user.nextLevel || 1000,
    }
    return (
        <div className="flex">
            <div className="w-full">
                <Card className="rounded-2xl border-gray-200">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-3">Personal Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input defaultValue={userProfile.name} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input defaultValue={userProfile.email} className="rounded-xl" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-medium mb-3">Change Password</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Password</label>
                                    <Input type="password" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Password</label>
                                    <Input type="password" className="rounded-xl" />
                                </div>
                            </div>
                        </div>

                        <Button className="bg-black text-white hover:bg-gray-800 rounded-xl">Save Changes</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
