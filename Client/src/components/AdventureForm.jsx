"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { createAdventure, updateAdventure } from "../Api/adventure.api"
import { fetchLocations } from "../Api/location.api"
import { toast } from "sonner"
import { useEffect } from "react"
import MediaPreview from "./MediaPreview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Label } from "./ui/label"
import { Video, ImageIcon } from "lucide-react"

const AdventureForm = ({ dialogmode, editAdventure, setShowAddAdventure, setDialogMode, setEdit, fetchAdventure }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: editAdventure || {
      name: "",
      location: [],
      description: "",
      exp: "",
      medias: [],
      thumbnail: null,
      previewVideo: null,
    },
  })

  const [mediaFiles, setMediaFiles] = React.useState([])
  const [mediaPreviews, setMediaPreviews] = React.useState([])
  const [thumbnailFile, setThumbnailFile] = React.useState(null)
  const [thumbnailPreview, setThumbnailPreview] = React.useState(null)
  const [previewVideoFile, setPreviewVideoFile] = React.useState(null)
  const [previewVideoPreview, setPreviewVideoPreview] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [locations, setLocations] = React.useState([])
  const [showLocationDropdown, setShowLocationDropdown] = React.useState(false)
  const [selectedLocations, setSelectedLocations] = React.useState(editAdventure?.location || [])

  // Generate previews when files are selected or when editing
  useEffect(() => {
    let previews = []
    // Show existing medias from editAdventure in edit mode
    if (editAdventure && editAdventure.medias && Array.isArray(editAdventure.medias)) {
      previews = editAdventure.medias.map((media, idx) => {
        // Assume media is a URL string or an object with url/type/name
        if (typeof media === "string") {
          // Guess type from extension
          const ext = media.split(".").pop().toLowerCase()
          let type = ""
          if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext)) type = "image"
          else if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext)) type = "video"
          else type = "file"
          return {
            url: media,
            type: type,
            name: media.split("/").pop() || `media-${idx}`,
            isServer: true,
          }
        } else {
          return { ...media, isServer: true }
        }
      })
    }
    // Add previews for newly selected files
    if (mediaFiles.length) {
      const filePreviews = mediaFiles.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file",
        name: file.name,
        isServer: false,
      }))
      previews = [...previews, ...filePreviews]
    }
    setMediaPreviews(previews)
    // Cleanup only for local files
    return () => {
      if (mediaFiles.length) {
        previews.filter((p) => !p.isServer).forEach((p) => URL.revokeObjectURL(p.url))
      }
    }
  }, [mediaFiles, editAdventure])

  // Handle thumbnail preview
  useEffect(() => {
    // Clear previous preview
    if (thumbnailPreview && !thumbnailPreview.isServer) {
      URL.revokeObjectURL(thumbnailPreview.url)
    }

    // Create preview for new thumbnail
    if (thumbnailFile) {
      setThumbnailPreview({
        url: URL.createObjectURL(thumbnailFile),
        type: "image",
        name: thumbnailFile.name,
        isServer: false,
      })
    } else if (editAdventure?.thumbnail) {
      // Show existing thumbnail from editAdventure
      setThumbnailPreview({
        url: editAdventure.thumbnail,
        type: "image",
        name: "thumbnail",
        isServer: true,
      })
    } else {
      setThumbnailPreview(null)
    }

    return () => {
      if (thumbnailPreview && !thumbnailPreview.isServer) {
        URL.revokeObjectURL(thumbnailPreview.url)
      }
    }
  }, [thumbnailFile, editAdventure])

  // Handle preview video
  useEffect(() => {
    // Clear previous preview
    if (previewVideoPreview && !previewVideoPreview.isServer) {
      URL.revokeObjectURL(previewVideoPreview.url)
    }

    // Create preview for new video
    if (previewVideoFile) {
      setPreviewVideoPreview({
        url: URL.createObjectURL(previewVideoFile),
        type: "video",
        name: previewVideoFile.name,
        isServer: false,
      })
    } else if (editAdventure?.previewVideo) {
      // Show existing preview video from editAdventure
      setPreviewVideoPreview({
        url: editAdventure.previewVideo,
        type: "video",
        name: "preview-video",
        isServer: true,
      })
    } else {
      setPreviewVideoPreview(null)
    }

    return () => {
      if (previewVideoPreview && !previewVideoPreview.isServer) {
        URL.revokeObjectURL(previewVideoPreview.url)
      }
    }
  }, [previewVideoFile, editAdventure])

  // Remove a selected media file (only local files)
  const handleRemoveMedia = (idx) => {
    // Only allow removing local files (after server files)
    const serverCount =
      editAdventure && editAdventure.medias && Array.isArray(editAdventure.medias) ? editAdventure.medias.length : 0
    if (idx >= serverCount) {
      setMediaFiles((files) => files.filter((_, i) => i !== idx - serverCount))
    }
    // Optionally, handle server media removal here if backend supports it
  }

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
  }

  const handleRemovePreviewVideo = () => {
    setPreviewVideoFile(null)
    setPreviewVideoPreview(null)
  }

  useEffect(() => {
    reset(
      editAdventure || {
        name: "",
        location: [],
        description: "",
        exp: "",
        medias: [],
        thumbnail: null,
        previewVideo: null,
      },
    )
  }, [editAdventure, reset])

  useEffect(() => {
    // Fetch locations for dropdown
    fetchLocations()
      .then((res) => {
        if (res && res.data) setLocations(res.data)
      })
      .catch(() => setLocations([]))
  }, [])

  // Sync selectedLocations with form value
  useEffect(() => {
    setValue("location", selectedLocations)
  }, [selectedLocations, setValue])

  // When editing, update selectedLocations
  useEffect(() => {
    setSelectedLocations(editAdventure?.location || [])
  }, [editAdventure])

  const toggleLocation = (locId) => {
    setSelectedLocations((prev) => (prev.includes(locId) ? prev.filter((id) => id !== locId) : [...prev, locId]))
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const toastId = toast.loading(dialogmode ? "Updating adventure..." : "Creating adventure...")
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      data.location.forEach((locId) => formData.append("location", locId))
      formData.append("description", data.description)
      formData.append("exp", data.exp)
      if (editAdventure && editAdventure._id) {
        formData.append("_id", editAdventure._id)
      }

      // Add thumbnail if available
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile)
      }

      // Add preview video if available
      if (previewVideoFile) {
        formData.append("previewVideo", previewVideoFile)
      }

      // Add regular media files
      mediaFiles.forEach((file) => {
        formData.append("medias", file)
      })

      if (dialogmode && editAdventure) {
        await updateAdventure(formData)
        toast.success("Adventure updated successfully", { id: toastId })
      } else {
        await createAdventure(formData)
        toast.success("Adventure created successfully", { id: toastId })
      }
      setShowAddAdventure(false)
      setDialogMode(false)
      setEdit(null)
      fetchAdventure()
    } catch (error) {
      toast.error("Error saving adventure", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <Input placeholder="Name" disabled={isSubmitting} {...register("name", { required: true })} />
          {errors.name && <span className="text-red-500">Name is required</span>}

          <label className="block relative">
            Location
            <div
              className="block w-full mt-1 border rounded-md p-2 bg-white cursor-pointer select-none"
              onClick={() => setShowLocationDropdown((v) => !v)}
            >
              {selectedLocations.length === 0
                ? "Select location(s)"
                : locations
                  .filter((loc) => selectedLocations.includes(loc._id))
                  .map((loc) => loc.name)
                  .join(", ")}
            </div>
            {showLocationDropdown && (
              <div className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-48 overflow-auto shadow-lg">
                {locations.map((loc) => (
                  <div
                    key={loc._id}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLocation(loc._id)
                    }}
                  >
                    <input type="checkbox" checked={selectedLocations.includes(loc._id)} readOnly className="mr-2" />
                    <span>{loc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </label>
          {errors.location && <span className="text-red-500">Location is required</span>}

          <Input placeholder="Description" disabled={isSubmitting} {...register("description", { required: true })} />
          {errors.description && <span className="text-red-500">Description is required</span>}

          <Input
            placeholder="Experience"
            type="number"
            disabled={isSubmitting}
            {...register("exp", { required: true })}
          />
          {errors.exp && <span className="text-red-500">Experience is required</span>}
        </TabsContent>

        <TabsContent value="media" className="space-y-6 pt-4">
          {/* Thumbnail Image */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon size={16} /> Thumbnail Image
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && setThumbnailFile(e.target.files[0])}
              className="block mt-1"
              disabled={isSubmitting}
            />
            {thumbnailPreview && (
              <div className="relative mt-2 inline-block">
                <img
                  src={thumbnailPreview.url || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  className="h-32 w-auto object-cover rounded-md border border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={handleRemoveThumbnail}
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          {/* Preview Video */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Video size={16} /> Preview Video
            </Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => e.target.files[0] && setPreviewVideoFile(e.target.files[0])}
              className="block mt-1"
              disabled={isSubmitting}
            />
            {previewVideoPreview && (
              <div className="relative mt-2 inline-block">
                <video
                  src={previewVideoPreview.url}
                  controls
                  className="h-32 w-auto object-cover rounded-md border border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={handleRemovePreviewVideo}
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          {/* Regular Media Files */}
          <div className="space-y-2">
            <Label>Additional Media (images/videos)</Label>
            <Input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setMediaFiles(Array.from(e.target.files))}
              className="block mt-1"
              disabled={isSubmitting}
            />
            <MediaPreview mediaPreviews={mediaPreviews} onRemove={handleRemoveMedia} isSubmitting={isSubmitting} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setShowAddAdventure(false)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {dialogmode ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}

export default AdventureForm
