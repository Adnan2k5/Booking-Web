import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarIcon, MapPin, Star, X, User, Search, Filter, ArrowLeft } from 'lucide-react';
import { cn } from "../lib/utils.js";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "antd";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Skeleton } from "../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import mock_adventure from "../Data/mock_adventure";
import { useAuth } from "./AuthProvider.jsx";
import { Loader } from "../components/Loader.jsx";
import { useSelector } from "react-redux";

export default function BrowsingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location?.search);
  const [isLoading, setIsLoading] = useState(true);
  const [adventure, setAdventure] = useState(
    query.get("adventure")?.toLowerCase() || ""
  );
  const [loc, setLoc] = useState(query.get("location")?.toLowerCase() || "");
  const [date, setDate] = useState(() => {
    const queryDate = query.get("date");
    return queryDate ? new Date(queryDate) : undefined;
  });

  const onPanelChange = (value) => {
    console.log(value.format('YYYY-MM-DD'));
  };
  
  const wrapperStyle = {
    width: 300,
    border: `1px solid #e2e8f0`,
    borderRadius: '0.375rem',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const adv = mock_adventure;

  const filteredAdventures = adv.filter((adventureItem) => {
    const matchesAdventure =
      !adventure ||
      adventure === "all" ||
      adventureItem.name.toLowerCase().includes(adventure);
    const matchesLoc =
      !loc ||
      loc === "all" ||
      adventureItem.location.toLowerCase().includes(loc);
    
    // Safe date comparison
    let matchesDate = true;
    if (date && date instanceof Date && !isNaN(date)) {
      const advDate = new Date(adventureItem.date);
      if (advDate instanceof Date && !isNaN(advDate)) {
        matchesDate = format(advDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      }
    }

    return matchesAdventure && matchesLoc && matchesDate;
  });

  const onBook = (id) => {
    navigate(`/booking?id=${id}`);
  };

  const clearFilter = (type) => {
    switch (type) {
      case "adventure":
        setAdventure("");
        break;
      case "location":
        setLoc("");
        break;
      case "date":
        setDate(undefined);
        break;
      case "all":
        setAdventure("");
        setLoc("");
        setDate(undefined);
        break;
      default:
        break;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const handleDateChange = (value) => {
    if (value) {
      // Ensure we're working with a proper Date object
      const selectedDate = new Date(value.format('YYYY-MM-DD'));
      setDate(selectedDate);
    } else {
      setDate(undefined);
    }
  };

  const formatDate = (dateString) => {
    try {
      // Safely parse the date string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };
  const {user , loading} = useAuth();
  useEffect(() => {
    if(user === null && !loading){
      navigate('/login');
    }
  }, [user, loading]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100 p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200 rounded-full opacity-30 blur-[100px]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto">
        <div className="flex md:fixed m-auto z-20 md:w-[97%] flex-col md:flex-row gap-4 mb-8 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder={
                adventure
                  ? adventure.charAt(0).toUpperCase() + adventure.slice(1)
                  : "Search adventures..."
              }
              value={adventure}
              onChange={(e) => setAdventure(e.target.value.toLowerCase())}
              className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            {adventure && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-600 hover:bg-gray-700"
                onClick={() => clearFilter("adventure")}
              >
                <X size={14} className="text-white" />
              </Button>
            )}
          </div>

          <div className="relative flex-1">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder={
                loc
                  ? loc.charAt(0).toUpperCase() + loc.slice(1)
                  : "All locations"
              }
              value={loc}
              onChange={(e) => setLoc(e.target.value.toLowerCase())}
              className="pl-10 border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            {loc && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-gray-600 hover:bg-gray-700"
                onClick={() => clearFilter("location")}
              >
                <X size={14} className="text-white" />
              </Button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal border-gray-200",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date && !isNaN(date.getTime()) 
                  ? format(date, "PPP") 
                  : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div style={wrapperStyle}>
                <Calendar 
                  fullscreen={false} 
                  onPanelChange={onPanelChange} 
                  onSelect={handleDateChange}
                />
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
              <Button variant="outline" size="icon" className="border-gray-200">
                <Filter size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => clearFilter("all")}>
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="ml-auto w-10 h-10 bg-blue-100 flex  items-center justify-center rounded-2xl">
          {loading ? <Loader/> : <p className="">{user?.user?.email.charAt(0).toUpperCase()}</p>}
          </div>
        </div>
        <div className="mb-6 flex justify-between items-center">
          <div className="flex md:mt-24 items-center gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="cursor-pointer p-2 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Adventures</h2>
            <Badge variant="outline" className="text-gray-500 bg-white">
              {filteredAdventures.length} results
            </Badge>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading 
              ? Array(6).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              ))
              : filteredAdventures.map((adventure) => (
                <motion.div key={adventure.id} variants={itemVariants} layout className="h-full">
                  <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={adventure.img || "/placeholder.svg"}
                        alt={adventure.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 hover:bg-green-600">+{adventure.exp} EXP</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <MapPin size={14} />
                        <span>{adventure.location}</span>
                        <span className="text-gray-300">•</span>
                        <span>{formatDate(adventure.date)}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">{adventure.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm ml-1 text-gray-500">4.8</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button
                        onClick={() => onBook(adventure.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            }
          </motion.div>
        </AnimatePresence>
        {filteredAdventures.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white p-8 rounded-xl shadow-sm inline-block">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No adventures found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters
              </p>
              <Button onClick={() => clearFilter("all")}>
                Clear all filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
