import React from "react"

const MediaPreview = ({ mediaPreviews, onRemove, isSubmitting }) => (
  <div className="flex flex-wrap gap-3 mt-2">
    {mediaPreviews.map((media, idx) => (
      <div key={idx} className="relative w-28 h-28 border rounded flex items-center justify-center bg-gray-50 overflow-hidden">
        {media.type.startsWith('image') ? (
          <img src={media.url} alt={media.name} className="object-cover w-full h-full" />
        ) : media.type.startsWith('video') ? (
          <video src={media.url} controls className="object-cover w-full h-full" />
        ) : (
          <span className="text-xs">{media.name}</span>
        )}
        <button type="button" onClick={() => onRemove(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-1 text-xs text-red-600 hover:bg-opacity-100" disabled={isSubmitting}>✕</button>
      </div>
    ))}
  </div>
)

export default MediaPreview
