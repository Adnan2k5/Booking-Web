"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

import { Users, Search, UserPlus, UserX, MapPin, Calendar, Compass } from "lucide-react"
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
import { useAdventures } from "../hooks/useAdventure"
import { Nav_Landing } from "../components/Nav_Landing"
import { fadeIn, staggerContainer } from "../assets/Animations"
import { useFriend } from "../hooks/useFriend.jsx"

export default function LandingPage() {
  const Navigate = useNavigate()
  const { user, loading } = useAuth()
  const { t, i18n } = useTranslation()
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")

  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [groupMembers, setGroupMembers] = useState([])
  const [adventure, setadventure] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [showFriendsList, setShowFriendsList] = useState(true)

  const { adventures, loading: adventureLoading } = useAdventures()
  const { 
    friends, 
    searchResult, 
    loading: friendLoading, 
    error, 
    searchUser, 
    sendRequest, 
    clearSearchResult,
    fetchFriends 
  } = useFriend()

  // Fetch friends when component mounts or dialog opens
  useEffect(() => {
    if (showGroupDialog && friends.length === 0) {
      fetchFriends()
    }
  }, [showGroupDialog, fetchFriends, friends.length])

  // Clear search results when dialog closes
  useEffect(() => {
    if (!showGroupDialog) {
      clearSearchResult()
      setSearchEmail("")
    }
  }, [showGroupDialog, clearSearchResult])

  const handleSearchFriends = async (e) => {
    e.preventDefault()
    
    if (!searchEmail.trim()) {
      toast(t("pleaseEnterEmail"), { type: "error", position: "top-right" })
      return
    }

    try {
      console.log("Searching for user:", searchEmail)
      const result = await searchUser(searchEmail)
      if (!result) {
        toast(t("noUsersFound"), { type: "error", position: "top-right" })
      }
    } catch (err) {
      toast(t("searchFailed"), { type: "error", position: "top-right" })
    }
  }
  const addGroupMember = (user) => {
    // Check if user is already in group
    if (groupMembers.some((member) => member._id === user._id)) {
      toast(t("userAlreadyInGroup"), { type: "warning", position: "top-right" })
      return
    }

    setGroupMembers((prev) => [...prev, user])
    clearSearchResult()
    setSearchEmail("")
    toast(t("friendAdded"), { type: "success", position: "top-right" })
  }

  const handleSendFriendRequest = async (userId) => {
    try {
      await sendRequest(userId)
      toast(t("friendRequestSent"), { type: "success", position: "top-right" })
    } catch (err) {
      toast(t("failedToSendRequest"), { type: "error", position: "top-right" })
    }
  }

  const removeGroupMember = (userId) => {
    // Remove from local state
    setGroupMembers((prev) => prev.filter((member) => member._id !== userId))

    // Remove from sessionStorage if present
    try {
      const stored = sessionStorage.getItem("groupMembers")
      if (stored) {
        const sessionMembers = JSON.parse(stored)
        const updatedSessionMembers = sessionMembers.filter((member) => member._id !== userId)
        sessionStorage.setItem("groupMembers", JSON.stringify(updatedSessionMembers))
      }
    } catch { }

    toast(t("friendRemoved"), { type: "success", position: "top-right" })
  }

  const handleNavigate = () => {
    // Check if required fields are filled
    if (!location || !date) {
      toast.error(t("pleaseSelectLocationAndDate") || "Please select location and date")
      return
    }

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
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <video
          src="https://res.cloudinary.com/dygmsxtsd/video/upload/v1747935986/5406499_Coll_wavebreak_Surfing_3840x2160_w7qryc.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <Nav_Landing />
      {/* Main Content - First Section */}
      <section className="flex-1 flex items-center justify-center pt-36 lg:mt-[10rem]">
        <motion.div
          className="bg-white/80 backdrop-blur-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex-col w-[90%] rounded-lg shadow-lg border border-white/50"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t("discoverAdventures")}
          </motion.h1>

          <motion.div
            className="search-bar w-full max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
              {/* Unified search container */}
              <div className="relative flex-1 flex flex-col md:flex-row gap-2">
                {/* Adventure selection */}
                <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="flex items-center pl-3">
                    <Compass className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    onChange={(e) => setadventure(e.target.value)}
                    className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1 bg-transparent"
                  >
                    <option value="all">{t("selectAdventure")}</option>
                    {adventures.map((adventure, index) => (
                      <option key={index} value={adventure.name}>
                        {adventure.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location input */}
                <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1"
                    type="text"
                    placeholder={t("searchLocation")}
                    required
                  />
                </div>

                {/* Date input */}
                <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    placeholder={t("selectDate")}
                    className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1"
                    required
                  />
                </div>

                {/* Group button */}
                <div className="flex-1 md:flex-initial flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <Button
                    onClick={() => setShowGroupDialog(true)}
                    className="w-full h-full px-4 py-6 bg-white hover:bg-gray-50 text-black"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">
                      {groupMembers.length > 0 ? `${t("group")} (${groupMembers.length + 1})` : t("addGroup")}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Search button - separated and bigger */}
              <Button
                onClick={handleNavigate}
                className="w-full md:w-auto mt-2 md:mt-0 py-6 px-8 bg-black hover:bg-gray-800 text-white text-lg font-medium rounded-lg shadow-md"
                disabled={!location || !date}
              >
                <Search className="h-6 w-6 mr-2" />
                <span>{t("search")}</span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Explore Section - Positioned after 100vh */}
      <div className="explore w-full bg-white px-4 sm:px-6 md:px-8 py-16 mt-[calc(100vh-16rem)]">
        <div className="content max-w-7xl mx-auto">
          <motion.div
            className="title text-2xl md:text-3xl mb-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-bold tracking-wider w-fit border-b-2 border-gray-500 pb-2">
              {t("exploreFeaturedAdventures")}
            </h1>
          </motion.div>
          <div className="adventures flex overflow-x-auto md:overflow-visible py-4">
            <motion.div
              className="cards flex flex-nowrap md:flex-wrap md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {/* Placeholder cards */}
              {[1, 2, 3].map((item) => (
                <motion.div
                  className="card p-0 min-w-[280px] md:min-w-0 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="img w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg overflow-hidden">
                    <motion.div
                      className="w-full h-full bg-gray-200"
                      initial={{ scale: 1.2 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <div className="content p-5">
                    <div className="title">
                      <h1 className="text-xl font-semibold text-gray-800">
                        {t("adventure")} {item}
                      </h1>
                    </div>
                    <div className="desp mt-2">
                      <p className="text-gray-600">{t("adventureDescription")}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Group Dialog */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">{t("addFriendsToGroup")}</DialogTitle>
            <DialogDescription>{t("inviteFriendsDescription")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearchFriends} className="flex gap-2 mb-4 mt-4">
            <Input
              type="email"
              placeholder={t("searchByEmail")}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 focus:ring-2 focus:ring-gray-500"
            />            <Button
              type="submit"
              disabled={friendLoading.search || !searchEmail}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
            >
              {friendLoading.search ? t("searching") : t("search")}
              <Search size={16} />
            </Button>
          </form>          {/* Search Results */}
          {searchResult && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t("searchResults")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={searchResult.user?.profilePicture || "/placeholder.svg"} alt={searchResult.user?.name} />
                      <AvatarFallback>{searchResult.user?.name?.charAt(0) || searchResult.user?.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{searchResult.user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{searchResult.user?.email}</p>
                      {searchResult.isAlreadyFriend && (
                        <p className="text-xs text-green-600">{t("alreadyFriends")}</p>
                      )}
                      {searchResult.hasPendingRequest && (
                        <p className="text-xs text-orange-600">
                          {searchResult.requestStatus?.isSentByMe ? t("requestSent") : t("requestReceived")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {searchResult.isAlreadyFriend ? (
                      <Button
                        size="sm"
                        onClick={() => addGroupMember(searchResult.user)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <UserPlus size={14} />
                        {t("add")}
                      </Button>
                    ) : searchResult.hasPendingRequest ? (
                      <Button
                        size="sm"
                        disabled
                        className="flex items-center gap-1 bg-gray-400 text-white cursor-not-allowed"
                      >
                        {searchResult.requestStatus?.isSentByMe ? t("requestSent") : t("requestReceived")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSendFriendRequest(searchResult.user._id)}
                          disabled={friendLoading.action}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          <UserPlus size={14} />
                          {friendLoading.action ? t("sending") : t("sendRequest")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => addGroupMember(searchResult.user)}
                          className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
                        >
                          <UserPlus size={14} />
                          {t("addDirectly")}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show error if search failed */}
          {error.search && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error.search}</p>
            </div>
          )}

          {/* Existing Friends List */}
          {showFriendsList && friends.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">{t("yourFriends")}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowFriendsList(!showFriendsList)}
                  className="text-xs text-gray-600"
                >
                  {showFriendsList ? t("hide") : t("show")}
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {friends
                  .filter(friend => !groupMembers.some(member => member._id === friend._id))
                  .map((friend) => (
                    <div key={friend._id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-gray-100">
                          <AvatarImage src={friend.profilePicture || "/placeholder.svg"} alt={friend.name} />
                          <AvatarFallback className="text-xs">{friend.name?.charAt(0) || friend.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{friend.name || "User"}</p>
                          <p className="text-xs text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addGroupMember(friend)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                      >
                        <UserPlus size={12} />
                        {t("add")}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Loading friends */}
          {friendLoading.friends && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
              <p className="text-gray-600 text-sm">{t("loadingFriends")}</p>
            </div>
          )}

          {/* Group Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                {t("yourGroup")} ({groupMembers.length + 1})
              </h3>
            </div>

            {/* Current User */}
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-100 bg-black">
                  <AvatarFallback className="text-white">
                    {user?.user ? user.user.email.charAt(0).toUpperCase() : "Y"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{user?.user ? user.user.email : "You"}</p>
                  <p className="text-xs text-gray-500">{t("groupLeader")}</p>
                </div>
              </div>
            </div>            <AnimatePresence>
              {groupMembers.map((member) => (
                <motion.div
                  key={member._id}
                  className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-100">
                      <AvatarImage src={member.profilePicture || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name?.charAt(0) || member.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{member.name || "User"}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeGroupMember(member._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <UserX size={14} />
                    {t("remove")}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {groupMembers.length === 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 text-sm">{t("noFriendsYet")}</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setShowGroupDialog(false)} className="bg-black hover:bg-gray-800 text-white">
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
