"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Calendar,
    Award,
} from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { useAuth } from "../AuthProvider"


export default function UserDashboard() {
    const { user } = useAuth();
    const userProfile = {
        name: user.user.name || "John Doe",
        email: user.user.email || "",
        level: user.user.level || "Beginner",
        joinDate: user.user.joinDate || "2023-01-01",
        completedAdventures: user.user.completedAdventures || 3,
        experience: user.user.experience || 400,
        nextLevel: user.user.nextLevel || 1000,
        upcomingAdventures: user.user.upcomingAdventures || 2,
    }
    const progressPercentage = (userProfile.experience / userProfile.nextLevel) * 100

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {userProfile.name}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="flex items-center gap-2 rounded-xl border-gray-300 hover:bg-gray-50">
                            <Calendar className="h-4 w-4" />
                            Browse Adventures
                        </Button>

                        <Button className="bg-black text-white hover:bg-gray-800 rounded-xl">Shop</Button>
                    </div>
                </div>

                {/* User Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Level Card */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Adventure Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Avatar className="h-16 w-16 border-2 border-black">
                                        <AvatarFallback className="bg-black text-white">{userProfile.level.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Badge className="absolute -bottom-2 -right-2 bg-black text-white rounded-full">Lv.2</Badge>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{userProfile.level}</span>
                                        <span className="text-sm text-gray-500">
                                            {userProfile.experience}/{userProfile.nextLevel} XP
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-black rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {userProfile.nextLevel - userProfile.experience} XP to next level
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed Adventures */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Completed Adventures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Award className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{userProfile.completedAdventures}</p>
                                    <p className="text-sm text-gray-500">Adventures completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Adventures */}
                    <Card className="rounded-2xl border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium">Upcoming Adventures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Calendar className="h-8 w-8 text-black" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">{userProfile.upcomingAdventures}</p>
                                    <p className="text-sm text-gray-500">Adventures scheduled</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
