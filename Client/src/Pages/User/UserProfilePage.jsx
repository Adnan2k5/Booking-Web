import UserLayout from "./UserLayout"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from '../../components/ui/separator'
import { Award } from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { useAuth } from '../AuthProvider'
import { useEffect, useState } from 'react'

export default function UserProfilePage() {
    const { user, token } = useAuth();
    const [achievements, setAchievements] = useState([])
    const [loadingAchievements, setLoadingAchievements] = useState(true)
    const [achievementsError, setAchievementsError] = useState(null)

    useEffect(() => {
        let ignore = false
        async function fetchAchievements() {
            if (!token) return
            try {
                setLoadingAchievements(true)
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/users/getUserAchievements`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                })
                if (!res.ok) {
                    throw new Error(`Failed to load achievements (${res.status})`)
                }
                const data = await res.json()
                if (!ignore) {
                    // Expecting data.data to be the userAchievement document
                    const list = data?.data?.achievements || data?.data?.achievementList || []
                    setAchievements(Array.isArray(list) ? list : [])
                }
            } catch (err) {
                if (!ignore) setAchievementsError(err.message)
            } finally {
                if (!ignore) setLoadingAchievements(false)
            }
        }
        fetchAchievements()
        return () => { ignore = true }
    }, [token])
    const userProfile = {
        name: user.user.name || "John Doe",
        email: user.user.email || "",
        level: user.user.level || "Beginner",
        joinDate: user.user.updatedAt
            ? new Date(user.user.updatedAt).toLocaleDateString()
            : "2023-01-01",
        completedAdventures: user.user.completedAdventures || 0,
        experience: user.user.level || 400,
        nextLevel: user.user.nextLevel || Math.floor(user.user.level / 100) * 100 + 100, // Example calculation for next level
    }
    const progressPercentage = (userProfile.experience / userProfile.nextLevel) * 100
    return (
        <UserLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-2">Profile</h1>
                            <p className="text-gray-600 text-lg">Manage your personal information and achievements</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <Card className="rounded-2xl border-0 shadow-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-white">Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-28 w-28 mb-4 border-4 border-white/30 shadow-2xl">
                                            <AvatarFallback className="bg-white text-purple-600 text-3xl font-bold">
                                                {userProfile.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-2xl font-bold text-white">{userProfile.name}</h3>
                                        <p className="text-white/80 mt-1">{userProfile.email}</p>
                                        <div className="mt-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                            <span className="text-white font-bold text-lg">Level {Math.floor(userProfile.level / 100)}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/20"></div>

                                    <div>
                                        <h4 className="font-semibold mb-3 text-white text-lg">Account Details</h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                                <span className="text-white/80">Member since</span>
                                                <span className="text-white font-medium">{userProfile.joinDate}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                                <span className="text-white/80">Completed Adventures</span>
                                                <span className="text-white font-medium">{userProfile.completedAdventures}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                                <span className="text-white/80">Experience Points</span>
                                                <span className="text-white font-medium">{userProfile.experience} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="rounded-2xl border-0 shadow-xl bg-white">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Adventure Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="font-semibold mb-4 text-lg">Experience Progress</h4>
                                            <div className="w-full h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-500 shadow-lg relative"
                                                    style={{ width: `${progressPercentage}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-3 text-sm font-medium">
                                                <span className="text-purple-600">{userProfile.experience} XP</span>
                                                <span className="text-gray-500">{userProfile.nextLevel} XP (Next Level)</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="font-semibold mb-4 text-lg">Achievements</h4>
                                            {loadingAchievements && (
                                                <div className="text-sm text-gray-500">Loading achievements...</div>
                                            )}
                                            {achievementsError && (
                                                <div className="text-sm text-red-500">{achievementsError}</div>
                                            )}
                                            {!loadingAchievements && !achievementsError && (
                                                achievements.length > 0 ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        {achievements.map((a, idx) => {
                                                            const unlocked = a.unlocked ?? a.isUnlocked ?? a.completed ?? false
                                                            const title = a.title || a.name || a.code || `Achievement ${idx + 1}`
                                                            return (
                                                                <div key={idx} className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${unlocked
                                                                    ? 'bg-gradient-to-br from-purple-100 to-pink-100 shadow-md hover:shadow-lg hover:scale-105'
                                                                    : 'bg-gray-100 opacity-60'
                                                                    }`}>
                                                                    <Award className={`h-10 w-10 mb-3 ${unlocked ? 'text-purple-600' : 'text-gray-400'
                                                                        }`} />
                                                                    <span className={`text-sm font-semibold text-center ${unlocked ? 'text-gray-900' : 'text-gray-500'
                                                                        }`}>{title}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-500">No achievements yet.</div>
                                                )
                                            )}
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
