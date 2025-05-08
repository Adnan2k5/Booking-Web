import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { MapPin } from 'lucide-react'
import { Button } from "../ui/button"
import StarRating from "../StarRating"

export function AdventureCard({ adventure, formatDate, onBook }) {
  // Add a check to ensure adventure data exists
  if (!adventure) return null;

  // Safely access media URL
  const mediaUrl = adventure.medias && adventure.medias.length > 0
    ? adventure.medias[0]
    : "/placeholder.svg?height=200&width=300";

  // Safely access location
  const locationName = adventure.location && adventure.location.length > 0
    ? adventure.location[0].name
    : "Unknown Location";

  return (
    <Card className="overflow-hidden h-full border-0 bg-white/90 backdrop-blur-sm shadow-lg">
      <div className="relative h-52 overflow-hidden group">
        <img
          src={mediaUrl || "/placeholder.svg"}
          alt={adventure.name || "Adventure"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=300";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-md">
            +{adventure.exp || 0} EXP
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <MapPin size={14} />
          <span>{locationName}</span>
          <span className="text-gray-300">•</span>
          <span>{formatDate(adventure.createdAt)}</span>
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">{adventure.name || "Adventure"}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <StarRating rating={4.8} />
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm font-medium text-gray-900">From $99</div>
          <div className="text-xs text-gray-500">Limited spots</div>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onBook(adventure._id);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
