import { memo } from "react"
import { motion } from "framer-motion"
import { Compass, MapPin, Calendar, Users, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { staggerContainer } from "../../assets/Animations"

const SearchBar = memo(({
  adventures,
  adventure,
  onAdventureChange,
  location,
  onLocationChange,
  date,
  onDateChange,
  groupMembers,
  onShowGroupDialog,
  onNavigate,
  t
}) => (
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
            onChange={(e) => onAdventureChange?.(e.target.value)}
            className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1 bg-transparent"
            value={adventure}
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
            onChange={(e) => onLocationChange?.(e.target.value)}
            className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1"
            type="text"
            placeholder={t("searchLocation")}
            value={location}
            required
          />
        </div>

        {/* Date input */}
        <div className="flex-1 flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="flex items-center pl-3">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            onChange={(e) => onDateChange?.(e.target.value)}
            type="date"
            placeholder={t("selectDate")}
            className="pl-2 py-6 text-base border-0 focus:ring-0 flex-1"
            value={date}
            required
          />
        </div>

        {/* Group button */}
        <div className="flex-1 md:flex-initial flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <Button
            onClick={() => onShowGroupDialog?.(true)}
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
        onClick={onNavigate}
        className="w-full md:w-auto mt-2 md:mt-0 py-6 px-8 bg-black hover:bg-gray-800 text-white text-lg font-medium rounded-lg shadow-md"
        disabled={!location || !date}
      >
        <Search className="h-6 w-6 mr-2" />
        <span>{t("search")}</span>
      </Button>
    </div>
  </motion.div>
))

SearchBar.displayName = 'SearchBar'

export default SearchBar