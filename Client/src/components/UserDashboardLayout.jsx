"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LayoutDashboard, Calendar, TicketIcon, User, Settings, LogOut, Menu, Bell, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import LanguageSelector from "./LanguageSelector"
import { useAuth } from "../Pages/AuthProvider"

const UserDashboardLayout = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
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
            label: t("dashboard"),
            path: "/dashboard",
        },
        {
            icon: <Calendar className="h-5 w-5" />,
            label: t("myBookings"),
            path: "/dashboard/bookings",
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

    // Mock notifications
    const notifications = [
        {
            id: 1,
            title: "Booking confirmed",
            message: "Your Mountain Climbing adventure has been confirmed",
            time: "10 minutes ago",
            unread: true,
        },
        {
            id: 2,
            title: "Upcoming adventure",
            message: "Your Paragliding adventure is in 3 days",
            time: "2 hours ago",
            unread: true,
        },
        {
            id: 3,
            title: "Special offer",
            message: "Get 20% off on your next booking with code ADVENTURE20",
            time: "Yesterday",
            unread: false,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden mr-2">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                                    <div className="flex flex-col h-full">
                                        <div className="py-4 flex items-center">
                                            <Link to="/" className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                                    <LayoutDashboard className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-lg">{t("userDashboard")}</span>
                                            </Link>
                                        </div>
                                        <Separator />
                                        <nav className="flex-1 py-4">
                                            <ul className="space-y-2">
                                                {navItems.map((item) => (
                                                    <li key={item.path}>
                                                        <Link
                                                            to={item.path}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive(item.path)
                                                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                }`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {item.icon}
                                                            <span>{item.label}</span>
                                                            {isActive(item.path) && <ChevronRight className="ml-auto h-4 w-4" />}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <div className="py-4">
                                            <Separator className="mb-4" />
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
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
                            <Link to="/" className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    <LayoutDashboard className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-lg hidden sm:inline-block">{t("userDashboard")}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Language Selector */}
                            <LanguageSelector variant="minimal" />

                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="h-5 w-5" />
                                        {notifications.some((n) => n.unread) && (
                                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[300px]">
                                    <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.map((notification) => (
                                        <DropdownMenuItem key={notification.id} className="cursor-pointer p-0">
                                            <div className={`p-3 w-full ${notification.unread ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
                                                <div className="flex justify-between items-start">
                                                    <div className="font-medium">{notification.title}</div>
                                                    {notification.unread && (
                                                        <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                                                            New
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <div className="text-center w-full py-1 text-blue-600 dark:text-blue-400">
                                            {t("viewAllNotifications")}
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                                                {user?.user?.email?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.user?.email || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{t("level")}: Explorer</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {navItems.map((item) => (
                                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                                            {item.icon}
                                            <span className="ml-2">{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600">
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
            <div className="flex">
                {/* Sidebar - Desktop only */}
                <aside className="hidden md:block w-64 fixed inset-y-0 pt-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 px-4 py-6">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive(item.path)
                                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                            {isActive(item.path) && <ChevronRight className="ml-auto h-4 w-4" />}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4">
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>{t("logout")}</span>
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 pt-16 min-h-screen">
                    <div className="container mx-auto px-4 py-6">{children}</div>
                </main>
            </div>
        </div>
    )
}

export default UserDashboardLayout
