import { Search, X, MapPin, CalendarIcon, Filter } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "antd"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { cn } from "../../lib/utils"

export function SearchFilterBar({ adventure, setAdventure, loc, setLoc, date, setDate, clearFilter, handleDateChange, wrapperStyle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder={adventure ? adventure.charAt(0).toUpperCase() + adventure.slice(1) : "Search adventures..."}
          value={adventure}
          onChange={(e) => setAdventure(e.target.value.toLowerCase())}
          className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl"
        />
        {adventure && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-600 hover:bg-gray-700 rounded-full"
            onClick={() => clearFilter("adventure")}
          >
            <X size={14} className="text-white" />
          </Button>
        )}
      </div>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder={loc ? loc.charAt(0).toUpperCase() + loc.slice(1) : "All locations"}
          value={loc}
          onChange={(e) => setLoc(e.target.value.toLowerCase())}
          className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl"
        />
        {loc && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-600 hover:bg-gray-700 rounded-full"
            onClick={() => clearFilter("location")}
          >
            <X size={14} className="text-white" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal border-gray-200 rounded-xl flex-1",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div style={wrapperStyle}>
              <Calendar fullscreen={false} onSelect={handleDateChange} />
            </div>
            {date && (
              <div className="p-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-blue-500"
                  onClick={() => clearFilter("date")}
                >
                  Clear date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="border-gray-200 rounded-xl">
              <Filter size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => clearFilter("all")}>Clear all filters</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
