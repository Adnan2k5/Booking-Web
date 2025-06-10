import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Menu, Bell, User, LifeBuoy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import LanguageSelector from "../../components/LanguageSelector"
import { useAuth } from "../AuthProvider"




const InstructorLayout = ({ children }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/login")
    }


    const navItems = [
        {
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: t("instructor.dashboard"),
            path: "/instructor/dashboard",
        },
        {
            icon: <Users className="h-5 w-5" />,
            label: t("instructor.bookings"),
            path: "/instructor/bookings",
        },
        {
            icon: <Calendar className="h-5 w-5" />,
            label: t("instructor.sessions"),
            path: "/instructor/sessions",
        },
        {
            icon: <User className="h-5 w-5" />,
            label: t("instructor.profile"),
            path: "/instructor/profile",
        },
        {
            icon: <LifeBuoy className="h-5 w-5" />,
            label: t("instructor.support"),
            path: "/instructor/support",
        },
        {
            icon: <Settings className="h-5 w-5" />,
            label: t("instructor.settings"),
            path: "/instructor/settings",
        },
    ]

    // Mock notifications
    const notifications = [
        {
            id: 1,
            title: "New booking",
            message: "You have a new booking for Mountain Climbing on April 20",
            time: "10 minutes ago",
            unread: true,
        },
        {
            id: 2,
            title: "Session reminder",
            message: "Your Wilderness Survival session is scheduled for tomorrow",
            time: "2 hours ago",
            unread: true,
        },
        {
            id: 3,
            title: "Review received",
            message: "You received a 5-star review from John Doe",
            time: "Yesterday",
            unread: false,
        },
    ]


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="w-full px-3 sm:px-4 lg:px-6">
                    <div className="flex h-14 sm:h-16 items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            {/* Mobile menu button */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                                        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 sm:p-6 flex items-center border-b border-gray-200 dark:border-gray-700">
                                            <Link to="/" className="flex items-center gap-2 sm:gap-3">
                                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </div>
                                                <span className="font-bold text-base sm:text-lg truncate">{t("instructor.instructorPortal")}</span>
                                            </Link>
                                        </div>
                                        <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
                                            <ul className="space-y-1 sm:space-y-2">
                                                {navItems.map((item) => (
                                                    <li key={item.path}>
                                                        <Link
                                                            to={item.path}
                                                            className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-md text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <span className="shrink-0">{item.icon}</span>
                                                            <span className="truncate">{item.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm sm:text-base"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>{t("instructor.logout")}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                                <span className="font-bold text-base sm:text-lg lg:text-xl hidden sm:inline-block truncate">{t("instructor.instructorPortal")}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
                            {/* Language Selector */}
                            <div className="hidden sm:block">
                                <LanguageSelector variant="minimal" />
                            </div>



                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm sm:text-base">
                                                {user?.user?.email?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px] sm:w-[280px]">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none truncate">{user?.user?.email || "Instructor"}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="sm:hidden">
                                        <DropdownMenuItem>
                                            <LanguageSelector variant="minimal" />
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </div>
                                    {navItems.map((item) => (
                                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className="cursor-pointer">
                                            <span className="mr-2">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 cursor-pointer">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        {t("instructor.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 pt-14 sm:pt-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 px-4 xl:px-6 py-6 overflow-y-auto">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <span className="shrink-0">{item.icon}</span>
                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 xl:p-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t("instructor.logout")}</span>
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 xl:ml-72 pt-14 sm:pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
                    <div className="w-full max-w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default InstructorLayout
