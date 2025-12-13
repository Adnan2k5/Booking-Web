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
      <div className="relative w-full flex-1 items-center flex flex-col md:flex-row md:border md:border-gray-200 md:shadow-md md:rounded-3xl md:overflow-hidden gap-3 md:gap-0">
        {/* Adventure selection */}
        <div className="w-full md:flex-1 flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-200 md:border-b-0 md:border-l-0 md:border-t-0 md:border-r border-gray-200">
          <div className="flex items-center pl-4">
            <Compass className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <LocationAutocomplete
              locations={(adventures || []).map((a) => a.name || a)}
              value={adventure}
              onChange={onAdventureChange}
              placeholder={t("selectAdventure")}
              className="pl-3 py-4 text-base border-0 focus:ring-0 flex-1 bg-transparent h-full"
            />
          </div>
        </div>

        {/* Location input with autocomplete */}
        <div className="w-full md:flex-1 flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-200 md:border-b-0 md:border-l-0 md:border-t-0 md:border-r border-gray-200">
          <div className="flex items-center pl-4">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <LocationAutocomplete
              locations={locationsList || []}
              value={location}
              onChange={onLocationChange}
              placeholder={t("searchLocation")}
              className="pl-3 py-4 text-base border-0 focus:ring-0 flex-1 bg-transparent h-full"
            />
          </div>
        </div>

        {/* Date input */}
        <div className="w-full md:flex-1 flex items-center bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-200 md:border-b-0 md:border-l-0 md:border-t-0 md:border-r border-gray-200">
          <div className="flex items-center pl-4">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            onChange={(e) => onDateChange?.(e.target.value)}
            type="date"
            placeholder={t("selectDate")}
            className="pl-3 py-4 text-base border-0 focus:ring-0 flex-1 h-full"
            value={date}
            required
            onFocus={e => e.target.showPicker && e.target.showPicker()}
          />
        </div>

        {/* Group button */}
        <div className="w-full md:w-auto flex items-center md:bg-white h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-200 md:border-b-0 md:border-l-0 md:border-t-0 md:border-r border-gray-200">
          <Button
            onClick={() => onShowGroupDialog?.(true)}
            className="w-full h-full px-4 py-4 bg-white hover:bg-gray-50 text-gray-800 border-0 justify-center md:justify-start font-medium"
          >
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            <span className="text-sm md:text-base">
              {groupMembers.length > 0 ? `${t("group")} (${groupMembers.length + 1})` : t("addGroup")}
            </span>
          </Button>
        </div>
        {/* Search button - full width on mobile, auto width on desktop */}
        <div className="w-full md:w-auto flex items-center h-14 md:h-16 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-200 md:border-0 md:bg-white">
          <Button
            onClick={onNavigate}
            className="w-full h-full px-6 py-4 bg-blue-600 hover:bg-blue-700 md:bg-white md:hover:bg-gray-50 text-white md:text-black border-0 justify-center font-semibold md:font-normal"
            disabled={!location || !date}
          >
            <Search className="h-5 w-5 md:h-6 md:w-6" />
            <span className="ml-2 md:hidden text-base">{t("search") || "Search"}</span>
          </Button>
        </div>
      </div>


    </div>
  </motion.div>
))

SearchBar.displayName = 'SearchBar'

export default SearchBar