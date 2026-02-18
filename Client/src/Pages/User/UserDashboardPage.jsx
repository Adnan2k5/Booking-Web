import UserLayout from "./UserLayout"
import AdventureExperienceCard from "../../components/AdventureExperienceCard"
import { ChatLayout } from "../Chat/ChatLayout"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
    Calendar,
    Award,
    Target,
    MessageCircle,
    X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { useAuth } from "../AuthProvider"
import { Separator } from "../../components/ui/separator"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCurrentUserSessionBookings } from "../../Api/booking.api"
import { getUserAdventureExperiences, getUserAdventures, getUserAchievements, evaluateMyAchievements } from "../../Api/user.api"
import HintTooltip from "../../components/HintTooltip";

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
    const [chatOpen, setChatOpen] = useState(false);

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
        <UserLayout onOpenChat={() => setChatOpen(true)}>
            <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-black tracking-tight mb-1">Dashboard</h1>
                            <p className="text-sm text-neutral-600">Welcome back, <span className="font-medium text-black">{userProfile.name}</span></p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link to="/browse" className="flex px-4 py-2 text-white bg-black items-center gap-2 rounded-lg hover:bg-neutral-800 transition-colors duration-200 font-medium text-sm">
                                <Calendar className="h-4 w-4" />
                                Browse Adventures
                            </Link>

                            <Link to="/shop" className="bg-white border border-black px-4 py-2 text-black hover:bg-black hover:text-white rounded-lg transition-colors duration-200 font-medium text-sm">Shop</Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <Card className="border border-black/10 hover:border-black/30 transition-colors duration-200 bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
                                    Overall Level
                                    <HintTooltip content="Your overall level based on total experience points earned across all adventures." />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 border-2 border-black">
                                            <AvatarFallback className="bg-black text-white text-xl font-bold">
                                                {userProfile.level}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 bg-white border border-black rounded-full p-1">
                                            <Award className="h-2.5 w-2.5 text-black" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="font-bold text-lg text-black">Level {userProfile.level}</span>
                                            <span className="text-xs text-neutral-600 font-medium">
                                                {userProfile.experience}/{userProfile.nextLevel} XP
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-black rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                        <div className="flex justify-between mt-1.5">
                                            <p className="text-xs text-neutral-500">
                                                {userProfile.nextLevel - userProfile.experience} XP to next
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {userProfile.adventureCount} adventures
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-black/10 hover:border-black/30 transition-colors duration-200 bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
                                    Completed Adventures
                                    <HintTooltip content="Total number of adventure sessions you have completed." />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded border border-black/10 bg-neutral-50 flex items-center justify-center">
                                        <Award className="h-8 w-8 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-black">
                                            {loading ? "..." : error ? "0" : userProfile.completedAdventures}
                                        </p>
                                        <p className="text-xs text-neutral-600 font-medium">Completed</p>
                                        {error && (
                                            <p className="text-xs text-red-500 mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-black/10 hover:border-black/30 transition-colors duration-200 bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
                                    Upcoming Adventures
                                    <HintTooltip content="Number of adventure sessions you have scheduled for the future." />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded border border-black/10 bg-neutral-50 flex items-center justify-center">
                                        <Calendar className="h-8 w-8 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-black">
                                            {loading ? "..." : error ? "0" : userProfile.upcomingAdventures}
                                        </p>
                                        <p className="text-xs text-neutral-600 font-medium">Scheduled</p>
                                        {error && (
                                            <p className="text-xs text-red-500 mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="stats">
                        <div className="lg:col-span-2">
                            <Card className="border border-black/10 bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-black">
                                        Level Overview
                                        <HintTooltip content="Your progression summary showing experience points, level, and achievements earned." />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-3 text-sm text-black">Overall Experience Progress</h4>
                                            <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-xs text-neutral-600">
                                                <span>{userProfile.experience} XP</span>
                                                <span>{userProfile.nextLevel} XP (Next Level)</span>
                                            </div>
                                        </div>

                                        <Separator className="bg-black/10" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="text-center p-4 border border-black/10 bg-neutral-50 rounded">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Award className="h-6 w-6 text-black" />
                                                </div>
                                                <p className="text-2xl font-bold text-black">{userProfile.level}</p>
                                                <p className="text-xs text-neutral-600">Overall Level</p>
                                            </div>
                                            <div className="text-center p-4 border border-black/10 bg-neutral-50 rounded">
                                                <div className="flex items-center justify-center mb-2">
                                                    <Target className="h-6 w-6 text-black" />
                                                </div>
                                                <p className="text-2xl font-bold text-black">{userProfile.adventureCount}</p>
                                                <p className="text-xs text-neutral-600">Adventures Tried</p>
                                            </div>
                                        </div>

                                        <Separator className="bg-black/10" />
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-black">Achievements</h4>
                                            <button
                                                onClick={handleRefreshAchievements}
                                                disabled={refreshing}
                                                className="text-xs px-3 py-1.5 rounded border border-black text-black hover:bg-black hover:text-white disabled:opacity-50 transition-colors duration-200"
                                            >
                                                {refreshing ? 'Refreshing...' : 'Refresh'}
                                            </button>
                                        </div>

                                        {achievementsLoading ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-14 bg-neutral-200 rounded animate-pulse" />
                                                ))}
                                            </div>
                                        ) : userAchievements ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                                <div className="p-4 rounded border border-black/10 bg-neutral-50">
                                                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                                                        Total Completed Adventures
                                                        <HintTooltip content="Total number of adventure sessions you have successfully completed." />
                                                    </div>
                                                    <div className="text-xl font-bold text-black">{userAchievements.totalCompletedAdventures || 0}</div>
                                                </div>
                                                <div className="p-4 rounded border border-black/10 bg-neutral-50">
                                                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                                                        Overall Level
                                                        <HintTooltip content="Your current level calculated from total experience points (100 XP per level)." />
                                                    </div>
                                                    <div className="text-xl font-bold text-black">{normalizedLevel}</div>
                                                </div>
                                                <div className="p-4 rounded border border-black/10 bg-neutral-50">
                                                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                                                        Total XP
                                                        <HintTooltip content="Total experience points earned across all your adventures." />
                                                    </div>
                                                    <div className="text-xl font-bold text-black">{totalXP}</div>
                                                </div>
                                                <div className="p-4 rounded border border-black/10 bg-neutral-50">
                                                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                                                        Unique Categories
                                                        <HintTooltip content="Number of different adventure categories you have tried." />
                                                    </div>
                                                    <div className="text-xl font-bold text-black">{userAchievements?.adventureStats?.uniqueCategories || 0}</div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {userAchievements?.achievements?.length > 0 && (
                                            <div className="mb-8">
                                                <h5 className="font-semibold mb-3 text-sm text-black">Your earned badges</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {Object.entries(
                                                        userAchievements.achievements.reduce((acc, a) => {
                                                            const cat = a.category || 'General';
                                                            acc[cat] = acc[cat] || [];
                                                            acc[cat].push(a);
                                                            return acc;
                                                        }, {})
                                                    ).map(([cat, list]) => (
                                                        <div key={cat} className="p-4 rounded border border-black/10 bg-neutral-50">
                                                            <div className="font-semibold text-black mb-2 text-sm">{cat}</div>
                                                            <div className="flex flex-col gap-2">
                                                                {list.map((a, idx) => (
                                                                    <div key={idx} className="flex items-center gap-3">
                                                                        <Award className="h-4 w-4 text-black flex-shrink-0" />
                                                                        <div>
                                                                            <div className="text-xs font-medium text-black">{a.name}</div>
                                                                            {a.description && (
                                                                                <div className="text-xs text-neutral-600">{a.description}</div>
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
                                                    <h4 className="text-sm font-semibold mb-3 text-black">{section.category}</h4>
                                                    <div className="flex flex-col gap-3">
                                                        {section.achievements.map((item, i) => {
                                                            let isEarned = false;

                                                            if (i === 0 && totalSessions >= 1) isEarned = true;
                                                            if (i === 1 && totalSessions >= 5) isEarned = true;
                                                            if (i === 2 && totalSessions >= 10) isEarned = true;
                                                            if (i === 3 && totalSessions >= 20) isEarned = true;

                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className={`flex items-center gap-4 p-3 rounded border ${isEarned ? "border-black/20 bg-neutral-50 opacity-100" : "border-black/10 bg-white opacity-40"
                                                                        }`}
                                                                >
                                                                    <Award
                                                                        className={`h-6 w-6 ${isEarned ? "text-black" : "text-neutral-400"}`}
                                                                    />
                                                                    <div>
                                                                        <span className="text-xs font-semibold text-black">{item.title}</span>
                                                                        <p className="text-xs text-neutral-600">{item.description}</p>
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

                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-8 pt-8">
                            <div>
                                <h2 className="text-2xl font-bold text-black">Adventure Experience</h2>
                                <p className="text-sm text-neutral-600 mt-1">
                                    {adventureExperiences.length > 0
                                        ? `Your progress in ${adventureExperiences.length} adventure${adventureExperiences.length !== 1 ? 's' : ''}`
                                        : "Your progress in each adventure"
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white border border-black/10 px-3 py-2 rounded">
                                <Target className="h-4 w-4 text-black" />
                                <span className="text-xs text-black font-semibold">
                                    {userProfile.adventureCount} Adventure{userProfile.adventureCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {experienceLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 bg-neutral-200 rounded animate-pulse"></div>
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
                            <Card className="border border-dashed border-black/20">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="w-16 h-16 bg-neutral-50 border border-black/10 rounded-full flex items-center justify-center mb-6">
                                        <Award className="h-8 w-8 text-black" />
                                    </div>
                                    <h3 className="text-lg font-bold text-black mb-2">No Adventure Experience Yet</h3>
                                    <p className="text-sm text-neutral-600 text-center mb-8 max-w-md">
                                        Start your adventure journey by booking your first session and gain experience points to level up!
                                    </p>
                                    <Link
                                        to="/browse"
                                        className="bg-black text-white px-6 py-2.5 rounded hover:bg-neutral-800 transition-colors font-medium text-sm"
                                    >
                                        Browse Adventures
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {chatOpen && (
                <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg border border-black/10 overflow-hidden">
                        <button
                            onClick={() => setChatOpen(false)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white border border-black/10 hover:bg-neutral-50 rounded-full flex items-center justify-center transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="h-5 w-5 text-black" />
                        </button>
                        <ChatLayout />
                    </div>
                </div>
            )}
        </UserLayout>
    )
}
