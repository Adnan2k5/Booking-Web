import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { createAdventure, updateAdventure, getAdventure } from "../../../Api/adventure.api"
import { fetchLocations } from "../../../Api/location.api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import MediaPreview from "../../../components/MediaPreview"
import { ArrowLeft, ImageIcon, Video, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

// Validation helper functions
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_MEDIA_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_MEDIA_COUNT = 10;

const validateFileType = (file, allowedTypes) => {
    if (!file) return true;
    const fileType = file.type.split('/')[0];
    return allowedTypes.includes(fileType);
}

const validateFileSize = (file, maxSize = MAX_FILE_SIZE) => {
    if (!file) return true;
    return file.size <= maxSize;
}

const validateMediaFiles = (files) => {
    if (!files || !files.length) return { valid: true };
    
    // Check number of files
    if (files.length > MAX_MEDIA_COUNT) {
        return { valid: false, message: `Maximum ${MAX_MEDIA_COUNT} files allowed` };
    }
    
    // Check total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_MEDIA_SIZE) {
        return { valid: false, message: `Total file size exceeds ${MAX_TOTAL_MEDIA_SIZE / (1024 * 1024)}MB` };
    }
    
    // Check individual files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split('/')[0];
        
        if (!['image', 'video'].includes(fileType)) {
            return { valid: false, message: `File '${file.name}' is not an image or video` };
        }
        
        if (file.size > MAX_FILE_SIZE) {
            return { valid: false, message: `File '${file.name}' exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
        }
    }
    
    return { valid: true };
}

const AdventureFormPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = !!id

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            name: "",
            location: [],
            description: "",
            exp: "",
            medias: [],
            thumbnail: null,
            previewVideo: null,
        },
        mode: "onBlur" // Validate fields when they lose focus
    })

    const [mediaFiles, setMediaFiles] = useState([])
    const [mediaPreviews, setMediaPreviews] = useState([])
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)
    const [previewVideoFile, setPreviewVideoFile] = useState(null)
    const [previewVideoPreview, setPreviewVideoPreview] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [locations, setLocations] = useState([])
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)
    const [selectedLocations, setSelectedLocations] = useState([])
    const [adventure, setAdventure] = useState(null)
    const [isLoading, setIsLoading] = useState(isEditMode)

    // Fetch adventure data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true)
            getAdventure(id)
                .then((res) => {
                    if (res && res.data) {
                        setAdventure(res.data)
                        reset(res.data)
                        setSelectedLocations(res.data.location || [])
                    }
                })
                .catch((error) => {
                    toast.error("Failed to load adventure data")
                    console.error(error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [id, isEditMode, reset])

    // Generate previews when files are selected or when editing
    useEffect(() => {
        let previews = []
        // Show existing medias from adventure in edit mode
        if (adventure && adventure.medias && Array.isArray(adventure.medias)) {
            previews = adventure.medias.map((media, idx) => {
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
    }, [mediaFiles, adventure])

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
        } else if (adventure?.thumbnail) {
            // Show existing thumbnail from adventure
            setThumbnailPreview({
                url: adventure.thumbnail,
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
    }, [thumbnailFile, adventure])

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
        } else if (adventure?.previewVideo) {
            // Show existing preview video from adventure
            setPreviewVideoPreview({
                url: adventure.previewVideo,
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
    }, [previewVideoFile, adventure])

    // Fetch locations for dropdown
    useEffect(() => {
        fetchLocations()
            .then((res) => {
                if (res && res.data) setLocations(res.data)
            })
            .catch(() => {
                toast.error("Failed to load locations")
                setLocations([])
            })
            
        // Register location field with validation
        register("location", { 
            validate: value => (value && value.length > 0) || "At least one location must be selected" 
        })

        // Register thumbnail field with validation
        register("thumbnail", { 
            validate: value => {
                // If we're in create mode, thumbnail is required
                if (!isEditMode && !value && !adventure?.thumbnail) {
                    return "Thumbnail image is required";
                }
                return true;
            }
        });
        
        // Register preview video field with validation
        register("previewVideo", { 
            validate: value => {
                // Optional field but if provided, validate it's a video
                if (value && !validateFileType(value, ['video'])) {
                    return "Please provide a valid video file";
                }
                return true;
            }
        });
        
        // Register media files field with validation
        register("medias", {
            validate: value => {
                // If editing and there are existing media files, it's optional
                if (isEditMode && adventure && adventure.medias && adventure.medias.length > 0) {
                    return true;
                }
                
                // In create mode, at least one media file is required
                if (!isEditMode && (!value || !value.length)) {
                    return "At least one media file is required";
                }
                
                // If there are files, validate them
                if (value && value.length > 0) {
                    const validation = validateMediaFiles(value);
                    return validation.valid || validation.message;
                }
                
                return true;
            }
        });
    }, [])

    // Sync selectedLocations with form value
    useEffect(() => {
        setValue("location", selectedLocations, { 
            shouldValidate: true, 
            shouldDirty: true 
        })
    }, [selectedLocations, setValue])

    // Remove a selected media file (only local files)
    const handleRemoveMedia = (idx) => {
        // Only allow removing local files (after server files)
        const serverCount =
            adventure && adventure.medias && Array.isArray(adventure.medias) ? adventure.medias.length : 0
        if (idx >= serverCount) {
            setMediaFiles((files) => {
                const updatedFiles = files.filter((_, i) => i !== idx - serverCount);
                setValue('medias', updatedFiles, { shouldValidate: true });
                return updatedFiles;
            });
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

    const toggleLocation = (locId) => {
        setSelectedLocations((prev) => (prev.includes(locId) ? prev.filter((id) => id !== locId) : [...prev, locId]))
    }

    const onSubmit = async (data) => {
        try {
            // Run validation checks before submission
            if (!isEditMode && !thumbnailFile && !adventure?.thumbnail) {
                toast.error("Thumbnail image is required");
                return;
            }
            
            if (!isEditMode && (!mediaFiles.length) && (!adventure?.medias || adventure.medias.length === 0)) {
                toast.error("At least one media file is required");
                return;
            }
            
            // Validate thumbnail if exists
            if (thumbnailFile && (!validateFileType(thumbnailFile, ['image']) || !validateFileSize(thumbnailFile))) {
                toast.error("Invalid thumbnail file. Please check size and format.");
                return;
            }
            
            // Validate preview video if exists
            if (previewVideoFile && !validateFileType(previewVideoFile, ['video'])) {
                toast.error("Invalid preview video. Please check format.");
                return;
            }
            
            // Validate media files if exist
            if (mediaFiles.length > 0) {
                const validation = validateMediaFiles(mediaFiles);
                if (!validation.valid) {
                    toast.error(validation.message);
                    return;
                }
            }
            
            // If all validations pass, proceed with form submission
            setIsSubmitting(true);
            const toastId = toast.loading(isEditMode ? "Updating adventure..." : "Creating adventure...");
            
            const formData = new FormData();
            formData.append("name", data.name);
            data.location.forEach((locId) => formData.append("location", locId));
            formData.append("description", data.description);
            formData.append("exp", data.exp);
            
            if (isEditMode && id) {
                formData.append("_id", id);
            }

            // Add thumbnail if available
            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            // Add preview video if available
            if (previewVideoFile) {
                formData.append("previewVideo", previewVideoFile);
            }

            // Add regular media files
            mediaFiles.forEach((file) => {
                formData.append("medias", file);
            });

            if (isEditMode) {
                await updateAdventure(formData);
                toast.success("Adventure updated successfully", { id: toastId });
            } else {
                await createAdventure(formData);
                toast.success("Adventure created successfully", { id: toastId });
            }
            navigate("/admin/adventures");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving adventure");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/adventures")}
                    className="mr-4 p-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">{isEditMode ? "Edit Adventure" : "Create New Adventure"}</h1>
            </div>

            <Card className="bg-white shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {isEditMode ? "Update adventure details" : "Enter adventure details"}
                        <br />
                        <span className="text-muted-foreground text-sm">Please also add Media to submit the adventure</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="basic" className="text-base py-3">
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger value="media" className="text-base py-3">
                                    Media
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-6 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-base">
                                            Adventure Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter adventure name"
                                            disabled={isSubmitting}
                                            {...register("name", { 
                                                required: "Adventure name is required",
                                                minLength: { value: 3, message: "Name must be at least 3 characters" },
                                                maxLength: { value: 100, message: "Name must be less than 100 characters" }
                                            })}
                                            className={`w-full p-3 ${errors.name ? "border-red-500" : ""}`}
                                        />
                                        {errors.name && (
                                            <div className="flex items-center text-red-500 text-sm mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                <span>{errors.name.message}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="exp" className="text-base">
                                            Experience Points
                                        </Label>
                                        <Input
                                            id="exp"
                                            placeholder="Enter experience points"
                                            type="number"
                                            disabled={isSubmitting}
                                            {...register("exp", { 
                                                required: "Experience points are required",
                                                min: { value: 0, message: "Experience points must be positive" },
                                                max: { value: 10000, message: "Experience points cannot exceed 10,000" },
                                                valueAsNumber: true
                                            })}
                                            className={`w-full p-3 ${errors.exp ? "border-red-500" : ""}`}
                                        />
                                        {errors.exp && (
                                            <div className="flex items-center text-red-500 text-sm mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                <span>{errors.exp.message}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-base">
                                        Location
                                    </Label>
                                    <div
                                        className={`block w-full border ${errors.location ? "border-red-500" : ""} rounded-md p-3 bg-white cursor-pointer select-none`}
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
                                        <div className="absolute z-10 bg-white border rounded-md mt-1 w-full max-w-2xl max-h-60 overflow-auto shadow-lg">
                                            {locations.length === 0 ? (
                                                <div className="px-4 py-3 text-gray-500">No locations available</div>
                                            ) : (
                                                locations.map((loc) => (
                                                    <div
                                                        key={loc._id}
                                                        className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleLocation(loc._id)
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLocations.includes(loc._id)}
                                                            readOnly
                                                            className="mr-3"
                                                        />
                                                        <span>{loc.name}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                    {errors.location && (
                                        <div className="flex items-center text-red-500 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            <span>{errors.location.message}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-base">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        placeholder="Enter adventure description"
                                        disabled={isSubmitting}
                                        {...register("description", { 
                                            required: "Description is required",
                                            minLength: { value: 20, message: "Description must be at least 20 characters" },
                                            maxLength: { value: 500, message: "Description must be less than 500 characters" }
                                        })}
                                        className={`w-full p-3 ${errors.description ? "border-red-500" : ""}`}
                                    />
                                    {errors.description && (
                                        <div className="flex items-center text-red-500 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            <span>{errors.description.message}</span>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-8 pt-4">
                                {/* Thumbnail Image */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-base font-medium">
                                        <ImageIcon size={18} /> Thumbnail Image {!isEditMode && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        id="thumbnail-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Validate file type
                                                if (!validateFileType(file, ['image'])) {
                                                    toast.error('Please select an image file');
                                                    e.target.value = '';
                                                    return;
                                                }
                                                
                                                // Validate file size
                                                if (!validateFileSize(file)) {
                                                    toast.error(`Thumbnail image must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
                                                    e.target.value = '';
                                                    return;
                                                }
                                                
                                                setThumbnailFile(file);
                                                setValue('thumbnail', file, { shouldValidate: true });
                                            }
                                        }}
                                        className={`block w-full p-3 ${errors.thumbnail ? "border-red-500" : ""}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.thumbnail && (
                                        <div className="flex items-center text-red-500 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            <span>{errors.thumbnail.message}</span>
                                        </div>
                                    )}
                                    {thumbnailPreview && (
                                        <div className="relative mt-3 inline-block">
                                            <img
                                                src={thumbnailPreview.url || "/placeholder.svg"}
                                                alt="Thumbnail preview"
                                                className="h-48 w-auto object-cover rounded-md border border-gray-200"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                                                onClick={() => {
                                                    handleRemoveThumbnail();
                                                    setValue('thumbnail', null, { shouldValidate: true });
                                                    document.getElementById('thumbnail-input').value = '';
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Preview Video */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-base font-medium">
                                        <Video size={18} /> Preview Video
                                    </Label>
                                    <Input
                                        id="preview-video-input"
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Validate file type
                                                if (!validateFileType(file, ['video'])) {
                                                    toast.error('Please select a video file');
                                                    e.target.value = '';
                                                    return;
                                                }
                                                
                                                // Validate file size (videos can be larger)
                                                const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
                                                if (file.size > MAX_VIDEO_SIZE) {
                                                    toast.error(`Preview video must be less than ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
                                                    e.target.value = '';
                                                    return;
                                                }
                                                
                                                setPreviewVideoFile(file);
                                                setValue('previewVideo', file, { shouldValidate: true });
                                            }
                                        }}
                                        className={`block w-full p-3 ${errors.previewVideo ? "border-red-500" : ""}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.previewVideo && (
                                        <div className="flex items-center text-red-500 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            <span>{errors.previewVideo.message}</span>
                                        </div>
                                    )}
                                    {previewVideoPreview && (
                                        <div className="relative mt-3 inline-block">
                                            <video
                                                src={previewVideoPreview.url}
                                                controls
                                                className="h-48 w-auto object-cover rounded-md border border-gray-200"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                                                onClick={() => {
                                                    handleRemovePreviewVideo();
                                                    setValue('previewVideo', null);
                                                    document.getElementById('preview-video-input').value = '';
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Regular Media Files */}
                                <div className="space-y-3">
                                    <Label className="text-base font-medium">Additional Media (images/videos) {!isEditMode && <span className="text-red-500">*</span>}</Label>
                                    <Input
                                        id="media-files-input"
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            if (files && files.length > 0) {
                                                // Validate using the helper function
                                                const validation = validateMediaFiles(files);
                                                if (!validation.valid) {
                                                    toast.error(validation.message);
                                                    e.target.value = '';
                                                    return;
                                                }
                                                
                                                setMediaFiles(files);
                                                setValue('medias', files, { shouldValidate: true });
                                            }
                                        }}
                                        className={`block w-full p-3 ${errors.medias ? "border-red-500" : ""}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.medias && (
                                        <div className="flex items-center text-red-500 text-sm mt-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            <span>{errors.medias.message}</span>
                                        </div>
                                    )}
                                    
                                    {/* Display stats about media */}
                                    {mediaFiles.length > 0 && (
                                        <div className="text-sm text-gray-600 mt-2">
                                            {mediaFiles.length} file(s) selected. 
                                            Total size: {(mediaFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(2)}MB
                                        </div>
                                    )}
                                    
                                    <div className="mt-4">
                                        <MediaPreview mediaPreviews={mediaPreviews} onRemove={handleRemoveMedia} isSubmitting={isSubmitting} />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/adventures")}
                                disabled={isSubmitting}
                                className="px-6 py-2.5"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || Object.keys(errors).length > 0}
                                className="px-8 py-2.5 bg-black hover:bg-gray-800 text-white"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                                        {isEditMode ? "Updating..." : "Creating..."}
                                    </span>
                                ) : isEditMode ? (
                                    "Update Adventure"
                                ) : (
                                    "Create Adventure"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdventureFormPage
