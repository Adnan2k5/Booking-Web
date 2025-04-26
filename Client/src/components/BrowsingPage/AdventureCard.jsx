import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { MapPin, Star } from "lucide-react"
import { Button } from "../ui/button"

export function AdventureCard({ adventure, formatDate, onBook }) {
  return (
    <Card className="overflow-hidden h-full border-0 bg-white/90 backdrop-blur-sm shadow-lg">
      <div className="relative h-52 overflow-hidden group">
        <img
          src={adventure.img || "/placeholder.svg"}
          alt={adventure.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-md">
            +{adventure.exp} EXP
          </Badge>
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
      <CardFooter className="pt-2 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm font-medium text-gray-900">From $99</div>
          <div className="text-xs text-gray-500">Limited spots</div>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onBook(adventure.id)
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
