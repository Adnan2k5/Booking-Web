import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LayoutDashboard, Calendar, Settings, LogOut, Menu, Bell, User, LifeBuoy, MessageCircle } from "lucide-react"
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
import { MdMoney } from "react-icons/md"




const InstructorLayout = ({ children, onOpenChat }) => {
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
            icon: <MdMoney className="h-5 w-5" />,
            label: t("instructor.payout"),
            path: "/instructor/payout",
        },
        {
            icon: <Settings className="h-5 w-5" />,
            label: t("instructor.settings"),
            path: "/instructor/settings",
        },
    ]


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 md:h-20 items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            {/* Mobile menu button */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-10 w-10 hover:bg-slate-100 rounded-xl">
                                        <Menu className="h-5 w-5 text-slate-700" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-0 bg-white">
                                    <div className="flex flex-col h-full">
                                        <div className="p-6 flex items-center border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800">
                                            <Link to="/" className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                                    <Calendar className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="font-bold text-lg text-white">{t("instructor.instructorPortal")}</span>
                                            </Link>
                                        </div>
                                        <nav className="flex-1 p-4 overflow-y-auto">
                                            <ul className="space-y-2">
                                                {navItems.map((item) => (
                                                    <li key={item.path}>
                                                        <Link
                                                            to={item.path}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 font-medium"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <span className="shrink-0">{item.icon}</span>
                                                            <span>{item.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                        <div className="p-4 border-t border-slate-200">
                                            <Button
                                                variant="outline"
                                                className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl font-medium"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-5 w-5" />
                                                <span>{t("instructor.logout")}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-3 min-w-0">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shadow-md">
                                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                </div>
                                <span className="font-bold text-lg md:text-xl hidden sm:inline-block text-slate-900">{t("instructor.instructorPortal")}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            {/* Language Selector */}
                            <div className="hidden sm:block">
                                <LanguageSelector variant="minimal" />
                            </div>

                            {/* Messages Button */}
                            {onOpenChat && (
                                <Button
                                    onClick={onOpenChat}
                                    variant="ghost"
                                    className="relative group hover:bg-slate-100 rounded-xl"
                                    size="sm"
                                >
                                    <div className="relative flex items-center gap-2">
                                        <div className="relative">
                                            <MessageCircle className="h-5 w-5 text-slate-700 group-hover:text-slate-900" />
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                                3
                                            </div>
                                        </div>
                                        <span className="hidden lg:inline text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                            Messages
                                        </span>
                                    </div>
                                </Button>
                            )}

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 rounded-xl hover:bg-slate-100">
                                        <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-slate-200">
                                            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-semibold">
                                                {user?.user?.email?.[0]?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[280px] rounded-xl border-slate-200 shadow-lg">
                                    <DropdownMenuLabel className="font-normal px-4 py-3">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold text-slate-900">{user?.user?.email || "Instructor"}</p>
                                            <p className="text-xs text-slate-500">Instructor Portal</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="sm:hidden px-2 py-1">
                                        <DropdownMenuItem>
                                            <LanguageSelector variant="minimal" />
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </div>
                                    {navItems.map((item) => (
                                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className="cursor-pointer px-4 py-2 hover:bg-slate-100 rounded-lg mx-2 my-0.5">
                                            <span className="mr-3">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer px-4 py-2 rounded-lg mx-2 my-0.5 font-medium">
                                        <LogOut className="h-4 w-4 mr-3" />
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
                <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 pt-16 md:pt-20 bg-white border-r border-slate-200 z-30 shadow-sm">
                    <div className="flex flex-col h-full">
                        <nav className="flex-1 px-3 xl:px-4 py-6 overflow-y-auto">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 font-medium group"
                                        >
                                            <span className="shrink-0 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 xl:p-6 border-t border-slate-200">
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl font-medium"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5" />
                                <span>{t("instructor.logout")}</span>
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 xl:ml-72 pt-16 md:pt-20 min-h-screen">
                    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-8">
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
