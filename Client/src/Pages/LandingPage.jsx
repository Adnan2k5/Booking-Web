"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MdLanguage, MdMenu, MdClose } from "react-icons/md"
import { IoIosLogIn } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { Loader } from "../components/Loader"
import { Users, Search, UserPlus, UserX, ChevronDown, Settings, LogOut, User, TicketIcon } from 'lucide-react'
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useAdventures } from "../hooks/useAdventure"

export default function LandingPage() {
  const Navigate = useNavigate()
  const { user, loading } = useAuth()
  const { t, i18n } = useTranslation()

  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [openLaguage, setOpenLanguage] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [adventure, setadventure] = useState("all")

  const { adventures, loading: adventureLoading } = useAdventures();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
  ]

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setOpenLanguage(false)
  }

  // Mock data for registered users
  const mockUsers = [
    {
      id: 1,
      email: "john.doe@example.com",
      name: "John Doe",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      email: "sarah.smith@example.com",
      name: "Sarah Smith",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      email: "mike.johnson@example.com",
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      email: "emily.brown@example.com",
      name: "Emily Brown",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const handleSearchFriends = (e) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const results = mockUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
          !groupMembers.some((member) => member.id === user.id),
      )
      setSearchResults(results)
      setIsSearching(false)

      if (results.length === 0) {
        toast(t("noUsersFound"), { type: "error", position: "top-right" })
      }
    }, 800)
  }

  const addGroupMember = (user) => {
    setGroupMembers((prev) => [...prev, user])
    setSearchResults([])
    setSearchEmail("")
    toast(t("friendAdded"), { type: "success", position: "top-right" })
  }

  const removeGroupMember = (userId) => {
    setGroupMembers((prev) => prev.filter((member) => member.id !== userId))
    toast(t("friendRemoved"), { type: "success", position: "top-right" })
  }

  const handleNavigate = () => {
    // Store group members in sessionStorage to access in booking page
    if (groupMembers.length > 0) {
      sessionStorage.setItem("groupMembers", JSON.stringify(groupMembers))
    }
    Navigate(`/browse?adventure=${adventure}&location=${location}&date=${date}`)
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Video - Fixed at 100vh */}
      <div className="bg absolute top-0 left-0 w-full h-screen overflow-hidden -z-50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <video
          src="https://res.cloudinary.com/dygmsxtsd/video/upload/v1740640091/skydiving_oh0ees.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {/* Responsive Navigation */}
      <nav className="w-full fixed h-fit z-50">
        <motion.div
          className="bg-black/80 backdrop-blur-md w-[90%] m-auto mt-5 text-white px-3 py-3 rounded-xl border border-white/10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <motion.h1
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
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
              <div className="language-selector relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-white">
                      <MdLanguage className="text-xl" />
                      <span>{languages.find(lang => lang.code === i18n.language)?.name || 'English'}</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map((language) => (
                      <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={i18n.language === language.code ? "bg-blue-50 text-blue-600" : ""}
                      >
                        {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ul className="flex space-x-5 items-center text-lg">
                <motion.li
                  className="cursor-pointer hover:text-cyan-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("explore")}
                </motion.li>
                <motion.li
                  className="cursor-pointer hover:text-cyan-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="/shop">{t("shop")}</a>
                </motion.li>
                <motion.li
                  className="cursor-pointer hover:text-cyan-400 transition-colors"
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
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{user?.user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.user?.email}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {t("level")}: Explorer
                            </p>
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
                    <motion.a
                      href="/login"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                        className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center rounded-full"
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

      {/* Main Content - First Section */}
      <section className="flex-1 flex items-center justify-center pt-36 lg:mt-[10rem]">
        <motion.div
          className="bg-white/90 backdrop-blur-md mx-auto px-4 sm:px-6 md:px-8 py-6 flex-col w-[90%] rounded-3xl shadow-lg border border-white/50"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t("discoverAdventures")}
          </motion.h1>

          <motion.div
            className="search-bar flex flex-col sm:flex-row gap-4 flex-wrap items-center justify-around w-full"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="location w-full sm:w-[45%] md:w-fit" variants={fadeIn}>
              <Input
                onChange={(e) => {
                  setLocation(e.target.value)
                }}
                className="bg-white text-black p-2 rounded-xl border border-gray-300 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                type="text"
                placeholder={t("searchLocation")}
              />
            </motion.div>
            <motion.div className="adventure w-full sm:w-[45%] md:w-fit" variants={fadeIn}>
              <select
                onChange={(e) => {
                  setadventure(e.target.value)
                }}
                className="bg-white text-black p-2 rounded-xl border border-gray-300 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">{t("selectAdventure")}</option>
                {adventures.map((adventure, index) => (
                  <option key={index} value={adventure.name}>
                    {adventure.name}
                  </option>
                ))}
              </select>
            </motion.div>
            <motion.div className="date w-full sm:w-[45%] md:w-fit" variants={fadeIn}>
              <Input
                type="date"
                placeholder={t("selectDate")}
                onChange={(e) => {
                  setDate(e.target.value)
                }}
                className="bg-white text-black p-2 rounded-xl border border-gray-300 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>
            <motion.div className="group w-full sm:w-[45%] md:w-fit" variants={fadeIn}>
              <Button
                onClick={() => setShowGroupDialog(true)}
                className="bg-white text-black p-2 rounded-xl border border-gray-300 w-full flex justify-between items-center hover:bg-gray-100 transition-all"
              >
                <span className="text-gray-500">
                  {groupMembers.length > 0 ? `${t("group")} (${groupMembers.length + 1})` : t("addGroup")}
                </span>
                <Users className="h-4 w-4 text-gray-500" />
              </Button>
            </motion.div>
            <motion.div className="search w-full sm:w-[45%] md:w-fit" variants={fadeIn}>
              <Button
                onClick={handleNavigate}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white cursor-pointer p-2 rounded-xl w-full hover:shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                {t("beginAdventure")}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Explore Section - Positioned after 100vh */}
      <div className="explore w-full bg-white px-4 sm:px-6 md:px-8 py-8 mt-[calc(100vh-16rem)]">
        <div className="content">
          <motion.div
            className="title text-2xl md:text-3xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-bold tracking-widest w-fit border-b-2 border-blue-500 pb-2">
              {t("exploreFeaturedAdventures")}
            </h1>
          </motion.div>
          <div className="adventures flex overflow-x-auto md:overflow-visible py-4">
            <motion.div
              className="cards flex flex-nowrap md:flex-wrap md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {/* Placeholder cards */}
              {[1, 2, 3].map((item) => (
                <motion.div
                  className="card p-4 min-w-[280px] md:min-w-0 bg-white rounded-lg shadow-md hover:shadow-xl transition-all"
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="img w-full h-48 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg overflow-hidden">
                    <motion.div
                      className="w-full h-full bg-gray-200"
                      initial={{ scale: 1.2 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <div className="title mt-2">
                    <h1 className="text-xl font-semibold">{t("adventure")} {item}</h1>
                  </div>
                  <div className="desp mt-1">
                    <p className="text-gray-600">
                      {t("adventureDescription")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Group Dialog */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border border-blue-100">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-600">{t("addFriendsToGroup")}</DialogTitle>
            <DialogDescription>
              {t("inviteFriendsDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearchFriends} className="flex gap-2 mb-4 mt-4">
            <Input
              type="email"
              placeholder={t("searchByEmail")}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={isSearching || !searchEmail}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              {isSearching ? t("searching") : t("search")}
              <Search size={16} />
            </Button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t("searchResults")}</h3>
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-blue-100">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addGroupMember(user)}
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <UserPlus size={14} />
                      {t("add")}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">{t("yourGroup")} ({groupMembers.length + 1})</h3>
            </div>

            {/* Current User */}
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-500">
                  <AvatarFallback>{user?.user ? user.user.email.charAt(0).toUpperCase() : "Y"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{user?.user ? user.user.email : "You"}</p>
                  <p className="text-xs text-gray-500">{t("groupLeader")}</p>
                </div>
              </div>
            </div>

            {/* Added Group Members */}
            <AnimatePresence>
              {groupMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-blue-100">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeGroupMember(member.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <UserX size={14} />
                    {t("remove")}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {groupMembers.length === 0 && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">
                  {t("noFriendsYet")}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={() => setShowGroupDialog(false)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
