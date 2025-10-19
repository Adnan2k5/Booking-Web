import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Star } from 'lucide-react'
import { postReview, updateReview, deleteReview } from '../../Api/reviews.api'

export default function ReviewForm({ selectedBooking, existingReview, onSuccess, onCancel }) {
  const [rating, setRating] = useState(existingReview?.rating || 5)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setRating(existingReview?.rating || 5)
    setComment(existingReview?.comment || '')
  }, [existingReview])

  const buildPayload = () => {
    const payload = { rating, comment }
    if (selectedBooking?.session?.instructorId) {
      payload.instructorId = selectedBooking.session.instructorId._id || selectedBooking.session.instructorId
    }
    if (selectedBooking?.hotel) {
      payload.hotelId = selectedBooking.hotel._id || selectedBooking.hotel
    }
    return payload
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const payload = buildPayload()
      if (existingReview && existingReview._id) {
        await updateReview(existingReview._id, payload)
      } else {
        await postReview(payload)
      }
      setSubmitting(false)
      onSuccess && onSuccess()
    } catch (err) {
      console.error('Failed to submit review', err)
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!existingReview || !existingReview._id) return
    try {
      setDeleting(true)
      await deleteReview(existingReview._id)
      setDeleting(false)
      onSuccess && onSuccess()
    } catch (err) {
      console.error('Failed to delete review', err)
      setDeleting(false)
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">{existingReview ? 'Your Review' : 'Leave a Review'}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rating:</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className={`p-2 rounded ${rating >= i ? 'bg-yellow-400 text-white' : 'bg-gray-100'}`}>
              <Star className="h-4 w-4" />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a short review (optional)"
          className="w-full p-2 border rounded-md h-24"
        />

        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : existingReview ? 'Save Changes' : 'Submit Review'}
          </Button>
          {existingReview ? (
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Review'}</Button>
          ) : (
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          )}
        </div>
      </div>
    </div>
  )
}
