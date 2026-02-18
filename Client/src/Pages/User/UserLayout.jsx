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
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-50 bg-white border-b border-black/10">
                <div className="w-full px-3 sm:px-4 lg:px-6">
                    <div className="flex h-14 sm:h-16 items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            {/* Mobile menu button */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8 sm:h-9 sm:w-9 hover:bg-neutral-100">
                                        <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-white border-r border-black/10">
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 sm:p-6 flex items-center border-b border-black/10">
                                            <Link to="/" className="flex items-center gap-2 sm:gap-3">
                                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black flex items-center justify-center text-white">
                                                    <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </div>
                                                <span className="font-bold text-base sm:text-lg truncate text-black">{t("userDashboard")}</span>
                                            </Link>
                                        </div>
                                        <nav className="flex-1 p-4 sm:p-6 overflow-y-auto">
                                            <ul className="space-y-1">
                                                {navItems.map((item) => (
                                                    <li key={item.path}>
                                                        <Link
                                                            to={item.path}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive(item.path)
                                                                ? "bg-black text-white"
                                                                : "text-black hover:bg-neutral-100"
                                                                }`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <span className="shrink-0">{item.icon}</span>
                                                            <span className="truncate font-medium">{item.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <div className="p-4 sm:p-6 border-t border-black/10">
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center gap-2 text-black border-black/20 hover:bg-black hover:text-white transition-colors rounded-lg font-medium text-sm"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>{t("logout")}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 group">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105">
                                    <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                                <span className="font-bold text-base sm:text-lg lg:text-xl hidden sm:inline-block truncate text-black">{t("userDashboard")}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
                            {/* Language Selector */}
                            <div className="hidden sm:block">
                                <LanguageSelector variant="minimal" />
                            </div>

                            {onOpenChat && (
                                <Button
                                    onClick={onOpenChat}
                                    variant="ghost"
                                    className="relative group hover:bg-neutral-100 transition-colors"
                                    size="sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5 text-black transition-colors" />
                                        <span className="hidden lg:inline text-sm font-semibold text-black">
                                            Messages
                                        </span>
                                    </div>
                                </Button>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-neutral-100 transition-colors">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-black/10">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                            <AvatarFallback className="bg-black text-white text-sm sm:text-base font-bold">
                                                {user?.user?.email?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px] sm:w-[280px] bg-white border border-black/10">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none truncate text-black">{user?.user?.email || "User"}</p>
                                            <p className="text-xs leading-none text-neutral-600">{t("level")}: Explorer</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-black/10" />
                                    <div className="sm:hidden">
                                        <DropdownMenuItem>
                                            <LanguageSelector variant="minimal" />
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-black/10" />
                                    </div>
                                    {navItems.map((item) => (
                                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className="cursor-pointer text-black hover:bg-neutral-100">
                                            <span className="mr-2">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator className="bg-black/10" />
                                    <DropdownMenuItem onClick={handleLogout} className="text-black hover:bg-neutral-100 cursor-pointer font-medium">
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
                <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 pt-14 sm:pt-16 bg-white border-r border-black/10 z-30">
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 px-4 xl:px-6 py-6 overflow-y-auto">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                                ? "bg-black text-white"
                                                : "text-black hover:bg-neutral-100"
                                                }`}
                                        >
                                            <span className="shrink-0">{item.icon}</span>
                                            <span className="truncate font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 xl:p-6 border-t border-black/10">
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2 text-black border-black/20 hover:bg-black hover:text-white transition-colors rounded-lg font-medium"
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
