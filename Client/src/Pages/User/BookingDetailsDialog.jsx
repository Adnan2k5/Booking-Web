import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { Star } from 'lucide-react'
import ReviewForm from './ReviewForm'

export default function BookingDetailsDialog({ isOpen, onOpenChange, selectedBooking, onReviewSuccess }) {
  if (!selectedBooking) return null

  const getStatusBadgeClass = (date) => {
    if (date && new Date(date) > new Date()) return 'bg-red-500 text-white'
    return 'bg-green-500 text-white'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selectedBooking.session?.adventureId?.name || 'Booking Details'}
          </DialogTitle>
          <DialogDescription>Booking ID: {selectedBooking._id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src={selectedBooking.session?.adventureId?.medias?.[0] || selectedBooking.session?.adventureId?.thumbnail || '/placeholder.svg?height=200&width=400'}
              alt={selectedBooking.session?.adventureId?.name || 'Adventure'}
              className="w-full h-full object-cover"
            />
            <Badge className={`absolute top-4 right-4 ${getStatusBadgeClass(selectedBooking.status)}`}>
              {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1) || 'Pending'}
            </Badge>
          </div>

          {/* condensed details - parent can render other info if needed */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name</p>
                <p className="text-sm text-gray-600">{selectedBooking.user?.name}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">{selectedBooking.user?.email}</p>
              </div>
            </div>
          </div>

          {selectedBooking.rating ? (
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Rating</h3>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{selectedBooking.rating}/5</span>
              </div>
            </div>
          ) : (
            selectedBooking.status === 'completed' && (
              <ReviewForm selectedBooking={selectedBooking} onSuccess={onReviewSuccess} onCancel={() => onOpenChange(false)} />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
