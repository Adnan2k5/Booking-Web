"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LayoutDashboard, Calendar, TicketIcon, User, Settings, LogOut, Menu, Bell, ChevronRight, Users, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
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
import { userLogout } from "../../Auth/UserAuth.js"
import { useDispatch } from "react-redux"
import { toast } from "sonner"

const UserLayout = ({ children, onOpenChat }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await userLogout(dispatch).then(() => {
            window.location.reload();
        }).catch((error) => {
            toast.error("Logout error:", error);
        });
    }

    const navItems = [
        {
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: t("dashboard.title"),
            path: "/dashboard",
        },
        {
            icon: <Calendar className="h-5 w-5" />,
            label: t("myBookings"),
            path: "/dashboard/bookings",
        },
        {
            icon: <Users className="h-5 w-5" />,
            label: t("friends"),
            path: "/dashboard/friends",
        },
        {
            icon: <TicketIcon className="h-5 w-5" />,
            label: t("tickets"),
            path: "/dashboard/tickets",
        },
        {
            icon: <User className="h-5 w-5" />,
            label: t("profile"),
            path: "/dashboard/profile",
        },
        {
            icon: <Settings className="h-5 w-5" />,
            label: t("settings"),
            path: "/dashboard/settings",
        },
    ]

    // Check if the current path matches the nav item path
    const isActive = (path) => {
        return location.pathname === path || (path === "/dashboard" && location.pathname === "/dashboard")
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 dark:bg-gray-800 shadow-md border-b border-gray-200/50 dark:border-gray-700 backdrop-blur-sm">
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
                                                    <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </div>
                                                <span className="font-bold text-base sm:text-lg truncate">{t("userDashboard")}</span>
                                            </Link>
                                        </div>
                                        <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
                                            <ul className="space-y-1 sm:space-y-2">
                                                {navItems.map((item) => (
                                                    <li key={item.path}>
                                                        <Link
                                                            to={item.path}
                                                            className={`flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-all duration-300 ${isActive(item.path)
                                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                                                : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                                                                }`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <span className="shrink-0">{item.icon}</span>
                                                            <span className="truncate font-medium">{item.label}</span>
                                                            {isActive(item.path) && <ChevronRight className="ml-auto h-4 w-4" />}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center gap-2 text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 border-red-200 hover:border-transparent transition-all duration-300 rounded-xl shadow-md hover:shadow-lg font-medium text-sm sm:text-base"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>{t("logout")}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 group">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                    <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                                <span className="font-bold text-base sm:text-lg lg:text-xl hidden sm:inline-block truncate bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">{t("userDashboard")}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
                            {/* Language Selector */}
                            <div className="hidden sm:block">
                                <LanguageSelector variant="minimal" />
                            </div>

                            {/* Messages Button */}
                            {onOpenChat && (
                                <Button
                                    onClick={onOpenChat}
                                    variant="ghost"
                                    className="relative group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                                    size="sm"
                                >
                                    <div className="relative flex items-center gap-2">
                                        <div className="relative">
                                            <MessageCircle className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
                                            {/* Notification badge */}
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-lg animate-pulse">
                                                3
                                            </div>
                                        </div>
                                        <span className="hidden lg:inline text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            Messages
                                        </span>
                                    </div>
                                </Button>
                            )}

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110 transition-transform duration-300">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-purple-200 hover:ring-purple-400 transition-all duration-300">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-sm sm:text-base font-bold">
                                                {user?.user?.email?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px] sm:w-[280px]">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none truncate">{user?.user?.email || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{t("level")}: Explorer</p>
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
                                        {t("logout")}
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
                <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 pt-14 sm:pt-16 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20 dark:bg-gray-800 border-r border-gray-200/50 dark:border-gray-700 z-30 shadow-lg">
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 px-4 xl:px-6 py-6 overflow-y-auto">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive(item.path)
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-102"
                                                }`}
                                        >
                                            <span className="shrink-0">{item.icon}</span>
                                            <span className="truncate font-medium">{item.label}</span>
                                            {isActive(item.path) && <ChevronRight className="ml-auto h-4 w-4" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 xl:p-6 border-t border-gray-200/50 dark:border-gray-700">
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2 text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 border-red-200 hover:border-transparent transition-all duration-300 rounded-xl shadow-md hover:shadow-lg font-medium"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t("logout")}</span>
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 xl:ml-72 pt-14 sm:pt-16 min-h-screen">
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

export default UserLayout
