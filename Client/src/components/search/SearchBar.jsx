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
    className="search-bar w-full max-w-5xl mx-auto px-4 md:px-0"
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
  >
    <div className="flex rounded-3xl flex-wrap md:flex-nowrap items-center justify-center">
      {/* Unified search container */}
      <div className="relative w-full flex-1 items-center flex flex-col md:flex-row md:bg-white md:shadow-xl md:rounded-full md:overflow-hidden gap-3 md:gap-0">
        {/* Adventure selection */}
        <div className="w-full md:flex-1 flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
          <div className="flex items-center pl-6">
            <Compass className="h-5 w-5 text-gray-900" />
          </div>
          <div className="flex-1">
            <LocationAutocomplete
              locations={(adventures || []).map((a) => a.name || a)}
              value={adventure}
              onChange={onAdventureChange}
              placeholder={t("selectAdventure")}
              className="pl-3 py-4 text-base border-0 focus:ring-0 flex-1 bg-transparent h-full placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Location input with autocomplete */}
        <div className="w-full md:flex-1 flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none md:border-l md:border-gray-100">
          <div className="flex items-center pl-6">
            <MapPin className="h-5 w-5 text-gray-900" />
          </div>
          <div className="flex-1">
            <LocationAutocomplete
              locations={locationsList || []}
              value={location}
              onChange={onLocationChange}
              placeholder={t("searchLocation")}
              className="pl-3 py-4 text-base border-0 focus:ring-0 flex-1 bg-transparent h-full placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Date input */}
        <div className="w-full md:flex-1 flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none md:border-l md:border-gray-100">
          <div className="flex items-center pl-6">
            <Calendar className="h-5 w-5 text-gray-900" />
          </div>
          <Input
            onChange={(e) => onDateChange?.(e.target.value)}
            type="date"
            placeholder={t("selectDate")}
            className="pl-3 py-4 text-base border-0 focus:ring-0 flex-1 h-full placeholder:text-gray-400 font-medium"
            value={date}
            required
            onFocus={e => e.target.showPicker && e.target.showPicker()}
          />
        </div>

        {/* Group button */}
        <div className="w-full md:w-auto flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none md:border-l md:border-gray-100">
          <Button
            onClick={() => onShowGroupDialog?.(true)}
            className="w-full h-full px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 border-0 justify-center md:justify-start font-medium"
          >
            <Users className="h-5 w-5 mr-3 text-gray-900" />
            <span className="text-sm md:text-base">
              {groupMembers.length > 0 ? `${t("group")} (${groupMembers.length + 1})` : t("addGroup")}
            </span>
          </Button>
        </div>

        {/* Search button - full width on mobile, auto width on desktop */}
        <div className="w-full md:w-auto flex items-center h-14 md:h-16 rounded-2xl md:rounded-none shadow-md md:shadow-none border border-gray-100 md:border-0 md:bg-white md:p-2">
          <Button
            onClick={onNavigate}
            className="w-full h-full md:rounded-full px-8 py-4 bg-black hover:bg-gray-800 text-white border-0 justify-center font-semibold transition-all duration-300"
            disabled={!location || !date}
          >
            <Search className="h-5 w-5" />
            <span className="ml-2 md:hidden text-base">{t("search") || "Search"}</span>
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
))

SearchBar.displayName = 'SearchBar'

export default SearchBar