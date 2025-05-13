import React, { useState } from 'react'
import { Loader } from "../components/Loader"
import {
    Settings,
    LogOut,
    User,
    TicketIcon,
} from "lucide-react"
import { AnimatePresence, motion } from 'framer-motion'
import { MdLanguage, MdMenu, MdClose } from "react-icons/md"
import { IoIosLogIn } from "react-icons/io"
import { useTranslation } from 'react-i18next'
import { useAuth } from "../Pages/AuthProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
export const Nav_Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { t, i18n } = useTranslation()
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    return (
        <nav className="w-full fixed h-fit z-50" >
            <motion.div
                className="bg-black/80 backdrop-blur-md w-[90%] m-auto mt-5 text-white px-3 py-3 rounded-xl border border-white/10"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <motion.h1
                        className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        Adventure
                    </motion.h1>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                            {mobileMenuOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex links gap-10 items-center">
                        <ul className="flex space-x-5 items-center text-lg">
                            <motion.li
                                className="cursor-pointer hover:text-emerald-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t("explore")}
                            </motion.li>
                            <motion.li
                                className="cursor-pointer hover:text-emerald-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a href="/shop">{t("shop")}</a>
                            </motion.li>
                            <motion.li
                                className="cursor-pointer hover:text-emerald-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t("mission")}
                            </motion.li>
                            <li>
                                {loading ? (
                                    <Loader />
                                ) : user.user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="relative h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-0"
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>{user?.user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{user?.user?.email}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{t("level")}: Explorer</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => Navigate("/dashboard")}>
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>{t("profile")}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => Navigate("/dashboard/tickets")}>
                                                    <TicketIcon className="mr-2 h-4 w-4" />
                                                    <span>{t("tickets")}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => Navigate("/dashboard/settings")}>
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>{t("settings")}</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>{t("logout")}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <motion.a href="/login" whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                        <IoIosLogIn className="text-3xl" />
                                    </motion.a>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="md:hidden mt-4 pb-2"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul className="flex flex-col space-y-3">
                                <li className="cursor-pointer hover:text-gray-300">{t("explore")}</li>
                                <li className="cursor-pointer hover:text-gray-300">
                                    <a href="/shop">{t("shop")}</a>
                                </li>
                                <li className="cursor-pointer hover:text-gray-300">{t("mission")}</li>
                                <li className="flex items-center">
                                    <MdLanguage className="text-white text-xl mr-2" />
                                    <select
                                        className="bg-black text-white"
                                        value={i18n.language}
                                        onChange={(e) => changeLanguage(e.target.value)}
                                    >
                                        {languages.map((language) => (
                                            <option key={language.code} value={language.code}>
                                                {language.name}
                                            </option>
                                        ))}
                                    </select>
                                </li>
                                <li>
                                    {loading ? (
                                        <Loader />
                                    ) : user.user ? (
                                        <div
                                            className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center rounded-full"
                                            onClick={() => Navigate("/dashboard")}
                                        >
                                            {user?.user?.email.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <a href="/login">
                                            <IoIosLogIn className="text-3xl" />
                                        </a>
                                    )}
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </nav>
    )
}
