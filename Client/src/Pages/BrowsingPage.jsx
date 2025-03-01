import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mock_adventure from "../Data/mock_adventure.json";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { MapPin, Star, Delete, User } from "lucide-react";
import { getAdventure } from "../Api/adventure";

export default function BrowsingPage() {
  const [fetchedAdventures, setFetchedAdventures] = useState([]);
  useEffect(() => {
    getAdventure().then((data) => {
      if (data != null) {
        setFetchedAdventures(data);
      }
    });
  }, []);

  const adv = [...mock_adventure, ...fetchedAdventures];

  const location = useLocation();
  const query = new URLSearchParams(location?.search);
  const [adventure, setAdventure] = useState(
    query.get("adventure")?.toLowerCase()
  );
  const [loc, setLoc] = useState(query.get("location")?.toLowerCase());
  const [date, setDate] = useState(query.get("date")?.toLowerCase());
  const filteredAdventures = adv.filter((adventureItem) => {
    const matchesAdventure =
      !adventure ||
      adventure === "all" ||
      adventureItem.name.toLowerCase().includes(adventure);
    const matchesLoc =
      !loc ||
      loc === "all" ||
      adventureItem.location.toLowerCase().includes(loc);
    const matchesDate =
      !date ||
      format(new Date(adventureItem.date), "yyyy/MM/dd") ===
        format(new Date(date), "yyyy/MM/dd");
    return (
      (adventure ? matchesAdventure : true) &&
      (loc ? matchesLoc : true) &&
      (date ? matchesDate : true)
    );
  });
  const Navigate = useNavigate();
  const onBook = (id) => {
    Navigate(`/booking/?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-black bg-grid backdrop-blur-xl glow text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute  -top-32 -left-32 w-96 h-96 bg-purple-700 rounded-full opacity-50 blur-[100px] animate-glowing-1"></div>
        <div className="absolute  -bottom-32 -right-32 w-96 h-96 bg-cyan-500 rounded-full opacity-50 blur-3xl animate-glowing-2"></div>
      </div>

      <div className="relative z-10">
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-md px-4 py-3 rounded-lg flex-1">
            <input
              type="text"
              placeholder={
                adventure?.charAt(0).toUpperCase() + adventure?.slice(1) ||
                "All Adventure"
              }
              onChange={(e) => {
                setAdventure(e.target.value.toLowerCase());
              }}
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
            />
            <Delete
              className="text-gray-400 cursor-pointer"
              size={20}
              onClick={() => {
                setAdventure("");
              }}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-md px-4 py-3 rounded-lg flex-1">
            <MapPin className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder={
                loc?.charAt(0).toUpperCase() + loc?.slice(1) || "All Location"
              }
              onChange={(e) => {
                setLoc(e.target.value.toLowerCase());
              }}
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
            />
            <Delete
              className="text-gray-400 cursor-pointer"
              size={20}
              onClick={() => {
                setLoc("");
              }}
            />
          </div>
          <div className="date flex items-center gap-2 bg-gray-800/50 backdrop-blur-md px-3 rounded-lg w-fit">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "yyyy/MM/dd") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Delete
              className="text-gray-400 cursor-pointer"
              size={20}
              onClick={() => {
                setDate("");
              }}
            />
          </div>
          <div className="user flex items-center">
            <User className="text-gray-400" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-400">
                {filteredAdventures.length} results found
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {filteredAdventures.map((adventure) => (
                <div
                  key={adventure._id}
                  className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <img
                    src={adventure.img}
                    alt={adventure.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <span>{adventure.location}</span>
                      <span>•</span>
                      <span>
                        {adventure.date
                          ? format(new Date(adventure.date), "MM/dd/yyyy")
                          : "20/2/25"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-2xl mb-2 text-white">
                      {adventure.name}
                    </h3>
                    <div className="flex items-center justify-between gap-1 mb-4">
                      <div className="review flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-sm ml-1 text-gray-400">4.8</span>
                      </div>
                      <div className="book">
                        <span
                          onClick={() => {
                            onBook(adventure.id);
                          }}
                          className="text-white bg-gradient-to-tr px-3 py-2 cursor-pointer rounded-lg from-[#37035C] to-[#005768]"
                        >
                          Book Now
                        </span>
                      </div>
                    </div>
                      <div className="text-green-400 text-right">+{adventure.exp} EXP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
