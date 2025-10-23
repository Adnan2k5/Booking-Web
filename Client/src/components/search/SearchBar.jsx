import { memo } from "react"
import { motion } from "framer-motion"
import { Compass, MapPin, Calendar, Users, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import LocationAutocomplete from "../ui/LocationAutocomplete"
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
  t,
  locationsList,
  locationsLoading
}) => (
  <motion.div
    className="search-bar w-full max-w-5xl mx-auto"
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
  >
    <div className="flex rounded-3xl flex-wrap md:flex-nowrap items-center justify-center">
      {/* Unified search container */}
      <div className="relative rounded-3xl  flex-1 items-center flex flex-col md:flex-row border border-gray-200 shadow-md overflow-hidden">
        {/* Adventure selection */}
        <div className="flex-1 flex items-center bg-white h-16">
          <div className="flex items-center pl-3">
            <Compass className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <LocationAutocomplete
              locations={(adventures || []).map((a) => a.name || a)}
              value={adventure}
              onChange={onAdventureChange}
              placeholder={t("selectAdventure")}
              className="pl-2 py-4 text-base border-0 focus:ring-0 flex-1 bg-transparent h-full"
            />
          </div>
        </div>

        {/* Location input with autocomplete */}
        <div className="flex-1 flex items-center bg-white h-16">
          <div className="flex items-center pl-3">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <LocationAutocomplete
              locations={locationsList || []}
              value={location}
              onChange={onLocationChange}
              placeholder={t("searchLocation")}
              className="pl-2 py-4 text-base border-0 focus:ring-0 flex-1 bg-transparent h-full"
            />
          </div>
        </div>

        {/* Date input */}
        <div className="flex-1 flex items-center bg-white h-16  border-gray-200">
          <div className="flex items-center pl-3">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            onChange={(e) => onDateChange?.(e.target.value)}
            type="date"
            placeholder={t("selectDate")}
            className="pl-2 py-4 text-base border-0 focus:ring-0 flex-1 h-full"
            value={date}
            required
          />
        </div>

        {/* Group button */}
        <div className="flex-1 flex items-center bg-white h-16  border-gray-200">
          <Button
            onClick={() => onShowGroupDialog?.(true)}
            className="w-full h-full px-4 py-4 bg-white hover:bg-gray-50 text-black border-0"
          >
            <Users className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">
              {groupMembers.length > 0 ? `${t("group")} (${groupMembers.length + 1})` : t("addGroup")}
            </span>
          </Button>
        </div>
        {/* Search button - icon only with white background */}
        <div className="flex-1 md:flex-initial flex items-center bg-white h-16">
          <Button
            onClick={onNavigate}
            className="w-full h-full px-6 py-4 bg-white hover:bg-gray-50 text-black border-0"
            disabled={!location || !date}
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </div>


    </div>
  </motion.div>
))

SearchBar.displayName = 'SearchBar'

export default SearchBar