"use client"

import { useState } from "react"
import { Upload, X, ImageIcon, Film } from "lucide-react"
import { Label } from "../../../components/ui/label"

export const MediaUpload = ({ files, onChange, onRemove }) => {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).filter(
                (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
            )
            onChange(newFiles)
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).filter(
                (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
            )
            onChange(newFiles)
        }
    }

    const getFilePreview = (file, index) => {
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        return (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <div className="aspect-square w-full h-24 sm:h-28 lg:h-32 bg-gray-100 flex items-center justify-center">
                    {isImage ? (
                        <ImageIcon
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Media ${index}`}
                            className="w-full h-full object-cover"
                        />
                    ) : isVideo ? (
                        <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                            <Film className="text-white w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 opacity-70" />
                            <span className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 text-xs text-white bg-black bg-opacity-50 px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                                Video
                            </span>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-xs sm:text-sm">Unsupported</div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm sm:text-base">Portfolio Media (Images & Videos)</Label>

            <div
                className={`border-2 border-dashed rounded-lg p-3 sm:p-4 lg:p-6 text-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center py-3 sm:py-4 lg:py-6">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-500 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-1">
                        <span className="hidden sm:inline">Drag and drop your media files here</span>
                        <span className="sm:hidden">Drop files here</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Supports: JPG, PNG, GIF, MP4 (max 10MB each)</p>
                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-md transition-colors">
                        <span className="hidden sm:inline">Browse Files</span>
                        <span className="sm:hidden">Browse</span>
                        <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-3 sm:mt-4">
                    <Label className="mb-2 block text-sm sm:text-base">
                        Uploaded Media ({files.length})
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                        {files.map((file, index) => getFilePreview(file, index))}
                    </div>
                </div>
            )}
        </div>
    )
}
