import UserLayout from "./UserLayout"
import AdventureExperienceCard from "../../components/AdventureExperienceCard"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Calendar,
    Award,
    Target,
} from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { useAuth } from "../AuthProvider"
import { Separator } from "../../components/ui/separator"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCurrentUserSessionBookings } from "../../Api/booking.api"
import { getUserAdventureExperiences, getUserAdventures, getUserAchievements, evaluateMyAchievements } from "../../Api/user.api"

export default function UserDashboardPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [adventureExperiences, setAdventureExperiences] = useState([]);
    const [levelData, setLevelData] = useState({
        overallLevel: 0,
        totalExperience: 0,
        averageLevel: 0,
        adventureCount: 0
    });
    const [adventureStats, setAdventureStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [experienceLoading, setExperienceLoading] = useState(true);
    const [error, setError] = useState(null);
    const [achievementsLoading, setAchievementsLoading] = useState(true);
    const [userAchievements, setUserAchievements] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch bookings and adventure experiences on component mount
    useEffect(() => {
        const fetchUserAdventures = async () => {
            try {
                const response = await getUserAdventures();
                if (response.success) {
                    const adventures = response.data.adventures || [];
                    const stats = adventures.map((adv) => ({
                        name: adv.name,
                        totalSessions: adv.totalSessions || 0,
                    }));

                    setAdventureStats(stats);
                }

            } catch (error) {
                console.error("Error fetching user adventures:", error);
            }
        };
        fetchUserAdventures();

        const fetchData = async () => {
            try {
                setLoading(true);
                setExperienceLoading(true);
                setAchievementsLoading(true);
                setError(null);

                // Fetch bookings
                const bookingResponse = await getCurrentUserSessionBookings({
                    page: 1,
                    limit: 100, // Get all bookings for stats calculation
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                });
                const bookingData = bookingResponse.data.data || bookingResponse.data;
                setBookings(bookingData.bookings || []);

                // Fetch adventure experiences
                const experienceResponse = await getUserAdventureExperiences();
                if (experienceResponse.success) {
                    setAdventureExperiences(experienceResponse.data.adventureExperiences || []);
                    setLevelData(experienceResponse.data.levelData || {
                        overallLevel: 0,
                        totalExperience: 0,
                        averageLevel: 0,
                        adventureCount: 0
                    });
                }

                // First, evaluate achievements based on latest data
                try {
                    await evaluateMyAchievements();
                } catch (err) {
                    console.warn('Achievement evaluation skipped:', err?.response?.data?.message || err.message);
                }

                // Fetch user achievements (levels, badges, stats) after evaluation
                try {
                    const achievementsResponse = await getUserAchievements();
                    if (achievementsResponse?.success) {
                        setUserAchievements(achievementsResponse.data);
                    }
                } catch (err) {
                    console.warn('Could not load achievements:', err?.response?.data?.message || err.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load dashboard data");
                setBookings([]);
                setAdventureExperiences([]);
            } finally {
                setLoading(false);
                setExperienceLoading(false);
                setAchievementsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRefreshAchievements = async () => {
        try {
            setRefreshing(true);
            await evaluateMyAchievements();
            const achievementsResponse = await getUserAchievements();
            if (achievementsResponse?.success) {
                setUserAchievements(achievementsResponse.data);
            }
        } catch (err) {
            console.warn('Refresh achievements failed:', err?.response?.data?.message || err.message);
        } finally {
            setRefreshing(false);
        }
    };

    // Process bookings to get adventure statistics
    const processBookingStats = () => {
        const currentDate = new Date();
        let completedAdventures = 0;
        let upcomingAdventures = 0;

        bookings.forEach(booking => {
            // Only count non-cancelled bookings
            if (booking.status !== 'cancelled' && booking.session?.startTime) {
                const sessionStartTime = new Date(booking.session.startTime);

                if (sessionStartTime < currentDate) {
                    // Adventure has already happened
                    completedAdventures++;
                } else {
                    // Adventure is upcoming
                    upcomingAdventures++;
                }
            }
        });

        return { completedAdventures, upcomingAdventures };
    };

    const { completedAdventures, upcomingAdventures } = processBookingStats();

    // Dynamic grid classes based on number of adventures
    const getGridClasses = (count) => {
        if (count === 1) {
            return "grid grid-cols-1 gap-6"; // Full width for 1 card
        } else if (count === 2) {
            return "grid grid-cols-1 md:grid-cols-2 gap-6"; // Half width for 2 cards
        } else if (count === 3) {
            return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"; // Third width for 3 cards
        } else {
            return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"; // Max 3 per row for 4+ cards
        }
    };
    console.log(user);

    // Normalize experience/level from the most authoritative source available
    const xpFromAchievements = Number.isFinite(userAchievements?.totalExperiencePoints)
        ? userAchievements.totalExperiencePoints
        : 0;
    const xpFromLevelData = Number.isFinite(levelData?.totalExperience)
        ? levelData.totalExperience
        : 0;
    // Prefer the highest known XP to avoid stale zeros overriding real values
    const totalXP = Math.max(xpFromAchievements, xpFromLevelData);
    const levelFromXP = Math.floor(totalXP / 100);
    const apiLevel = Number.isFinite(userAchievements?.level) ? userAchievements.level : null;
    const normalizedLevel = apiLevel !== null ? Math.max(apiLevel, levelFromXP) : levelFromXP;
    const nextLevelXP = (normalizedLevel + 1) * 100;
    const adventureCountNormalized = Math.max(
        Number.isFinite(levelData?.adventureCount) ? levelData.adventureCount : 0,
        Array.isArray(adventureExperiences) ? adventureExperiences.length : 0
    );

    const userProfile = {
        name: user.user.name || "John Doe",
        email: user.user.email || "",
        level: normalizedLevel,
        joinDate: user.user.joinDate || "2023-01-01",
        completedAdventures,
        experience: totalXP,
        nextLevel: nextLevelXP, // Next 100 XP milestone
        upcomingAdventures,
        adventureCount: adventureCountNormalized,
    }
    const progressPercentage = totalXP > 0 ? ((totalXP % 100) / 100) * 100 : 0;

    // Static achievement templates retained for UI, will be enhanced by backend data when present
    const achievementData = [
        {
            category: "Wakeboarding",
            achievements: [
                { title: "First Adventure", description: "First Ride" },
                { title: "Adventure Explorer", description: "Complete 10 Sessions" },
                { title: "Adventure Master", description: "Master a Difficult Trick" },
                { title: "Adventure Legend", description: "Competition Rider" },
            ],
        },
        {
            category: "Powered Paragliding",
            achievements: [
                { title: "First Adventure", description: "First Powered Flight" },
                { title: "Adventure Explorer", description: "Complete 5 Flights" },
                { title: "Adventure Master", description: "Fly in Tough Weather" },
                { title: "Adventure Legend", description: "Instructor’s Choice" },
            ],
        },
        {
            category: "Drone Operator Training",
            achievements: [
                { title: "First Adventure", description: "First Training" },
                { title: "Adventure Explorer", description: "Complete 5 Trainings" },
                { title: "Adventure Master", description: "Master Action Filming" },
                { title: "Adventure Legend", description: "Certified Drone Operator" },
            ],
        },

    ];

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        {/* Level Card */}
                        <Card className="rounded-2xl border-gray-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">Overall Adventure Level</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 border-2 border-black">
                                            <AvatarFallback className="bg-black text-white text-lg font-bold">
                                                {userProfile.level}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium">Level {userProfile.level}</span>
                                            <span className="text-sm text-gray-500">
                                                {userProfile.experience}/{userProfile.nextLevel} XP
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-black rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <p className="text-xs text-gray-500">
                                                {userProfile.nextLevel - userProfile.experience} XP to next milestone
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {userProfile.adventureCount} adventures
                                            </p>
                                        </div>
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
                                        <p className="text-3xl font-bold">
                                            {loading ? "..." : error ? "0" : userProfile.completedAdventures}
                                        </p>
                                        <p className="text-sm text-gray-500">Adventures completed</p>
                                        {error && (
                                            <p className="text-xs text-red-500 mt-1">{error}</p>
                                        )}
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
                                        <p className="text-3xl font-bold">
                                            {loading ? "..." : error ? "0" : userProfile.upcomingAdventures}
                                        </p>
                                        <p className="text-sm text-gray-500">Adventures scheduled</p>
                                        {error && (
                                            <p className="text-xs text-red-500 mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Adventure Experiences Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Adventure Experience</h2>
                                <p className="text-gray-600">
                                    {adventureExperiences.length > 0
                                        ? `Your progress in ${adventureExperiences.length} adventure${adventureExperiences.length !== 1 ? 's' : ''}`
                                        : "Your progress in each adventure"
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                    {userProfile.adventureCount} Adventure{userProfile.adventureCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {experienceLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : adventureExperiences.length > 0 ? (
                            <div className={getGridClasses(adventureExperiences.length)}>
                                {adventureExperiences.map((adventureExp, index) => (
                                    <AdventureExperienceCard
                                        key={adventureExp._id}
                                        adventureExp={adventureExp}
                                        isFullWidth={adventureExperiences.length === 1}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="rounded-2xl border-gray-200 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <Award className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Adventure Experience Yet</h3>
                                    <p className="text-gray-600 text-center mb-8 max-w-md">
                                        Start your adventure journey by booking your first session and gain experience points to level up!
                                    </p>
                                    <Link
                                        to="/browse"
                                        className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                                    >
                                        Browse Adventures
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="stats">
                        <div className="lg:col-span-2">
                            <Card className="rounded-2xl border-gray-200">
                                <CardHeader>
                                    <CardTitle>Level Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium mb-3">Overall Experience Progress</h4>
                                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-sm">
                                                <span>{userProfile.experience} XP</span>
                                                <span>{userProfile.nextLevel} XP (Next Level)</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Award className="h-8 w-8 text-blue-500" />
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900">{userProfile.level}</p>
                                                <p className="text-sm text-gray-600">Overall Level</p>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Target className="h-8 w-8 text-purple-500" />
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900">{userProfile.adventureCount}</p>
                                                <p className="text-sm text-gray-600">Adventures Tried</p>
                                            </div>
                                        </div>

                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-medium">Achievements</h4>
                                            <button
                                                onClick={handleRefreshAchievements}
                                                disabled={refreshing}
                                                className="text-sm px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                {refreshing ? 'Refreshing...' : 'Refresh'}
                                            </button>
                                        </div>

                                        {/* Backend achievements summary (badges and stats) */}
                                        {achievementsLoading ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />
                                                ))}
                                            </div>
                                        ) : userAchievements ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="p-4 rounded-xl bg-gray-50">
                                                    <div className="text-sm text-gray-600">Total Completed Adventures</div>
                                                    <div className="text-2xl font-semibold text-gray-900">{userAchievements.totalCompletedAdventures || 0}</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-gray-50">
                                                    <div className="text-sm text-gray-600">Overall Level</div>
                                                    <div className="text-2xl font-semibold text-gray-900">{normalizedLevel}</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-gray-50">
                                                    <div className="text-sm text-gray-600">Total XP</div>
                                                    <div className="text-2xl font-semibold text-gray-900">{totalXP}</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-gray-50">
                                                    <div className="text-sm text-gray-600">Unique Categories</div>
                                                    <div className="text-2xl font-semibold text-gray-900">{userAchievements?.adventureStats?.uniqueCategories || 0}</div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* Dynamic earned achievements from backend */}
                                        {userAchievements?.achievements?.length > 0 && (
                                            <div className="mb-8">
                                                <h5 className="font-semibold mb-3">Your earned badges</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(
                                                        userAchievements.achievements.reduce((acc, a) => {
                                                            const cat = a.category || 'General';
                                                            acc[cat] = acc[cat] || [];
                                                            acc[cat].push(a);
                                                            return acc;
                                                        }, {})
                                                    ).map(([cat, list]) => (
                                                        <div key={cat} className="p-4 rounded-xl bg-gray-50">
                                                            <div className="font-medium text-gray-900 mb-2">{cat}</div>
                                                            <div className="flex flex-col gap-2">
                                                                {list.map((a, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3">
                                                                        <Award className="h-5 w-5 text-gray-800" />
                                                                        <div>
                                                                            <div className="text-sm font-medium text-gray-800">{a.name}</div>
                                                                            {a.description && (
                                                                                <div className="text-xs text-gray-500">{a.description}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fallback/static templates if no backend achievements yet */}
                                        {(!userAchievements?.achievements || userAchievements.achievements.length === 0) && achievementData.map((section, index) => {
                                            const matchedAdventure = adventureStats.find(
                                                (adv) => adv.name.toLowerCase() === section.category.toLowerCase()
                                            );

                                            const totalSessions = matchedAdventure?.totalSessions || 0;

                                            return (
                                                <div key={index} className="mb-6">
                                                    <h4 className="text-lg font-medium mb-3">{section.category}</h4>
                                                    <div className="flex flex-col gap-4">
                                                        {section.achievements.map((item, i) => {
                                                            let isEarned = false;

                                                            if (i === 0 && totalSessions >= 1) isEarned = true;
                                                            if (i === 1 && totalSessions >= 5) isEarned = true;
                                                            if (i === 2 && totalSessions >= 10) isEarned = true;
                                                            if (i === 3 && totalSessions >= 20) isEarned = true;

                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className={`flex items-center gap-4 p-4 rounded-2xl bg-gray-100 ${isEarned ? "opacity-100" : "opacity-50"
                                                                        }`}
                                                                >
                                                                    <Award
                                                                        className={`h-8 w-8 ${isEarned ? "text-gray-800 opacity-100" : "text-gray-800 opacity-50"}`}
                                                                    />
                                                                    <div>
                                                                        <span className="text-sm font-medium text-gray-600">{item.title}</span>
                                                                        <p className="text-xs text-gray-400">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
