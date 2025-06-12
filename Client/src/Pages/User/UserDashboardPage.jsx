import UserLayout from "./UserLayout"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Calendar,
    Award,
} from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { useAuth } from "../AuthProvider"
import { Separator } from "../../components/ui/separator"
import { Link } from "react-router-dom"

export default function UserDashboardPage() {
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
        <UserLayout>
            <div className="min-h-screen  p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {userProfile.name}</p>
                        </div>

                        <div className="flex px-3 items-center gap-3">
                            <Link to="/browse" variant="outline" className="flex px-3 py-1 text-white bg-black items-center gap-2 rounded-xl  hover:bg-gray-800">
                                <Calendar className="h-4 w-4" />
                                Browse Adventures
                            </Link>

                            <Link to="/shop" className="bg-black px-3 py-1 text-white hover:bg-gray-800 rounded-xl">Shop</Link>
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
                                            <AvatarFallback className="bg-black text-white">{userProfile.level}</AvatarFallback>
                                        </Avatar>

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
                    <div className="stats">
                        <div className="lg:col-span-2">
                            <Card className="rounded-2xl border-gray-200">
                                <CardHeader>
                                    <CardTitle>Adventure Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium mb-3">Experience Progress</h4>
                                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black rounded-full"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-sm">
                                                <span>{userProfile.experience} XP</span>
                                                <span>{userProfile.nextLevel} XP (Next Level)</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-medium mb-3">Achievements</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                                                    <Award className="h-8 w-8 text-black mb-2" />
                                                    <span className="text-sm font-medium">First Adventure</span>
                                                </div>
                                                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                                                    <Award className="h-8 w-8 text-black mb-2" />
                                                    <span className="text-sm font-medium">Adventure Explorer</span>
                                                </div>
                                                <div className="flex flex-col items-center p-3 bg-gray-100 rounded-2xl opacity-50">
                                                    <Award className="h-8 w-8 text-gray-400 mb-2" />
                                                    <span className="text-sm font-medium">Adventure Master</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}
