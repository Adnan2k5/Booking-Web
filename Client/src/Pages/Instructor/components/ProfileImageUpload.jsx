"use client"

import { useState } from "react"
import { Camera } from "lucide-react"

export const ProfileImageUpload = ({ initialImage, onChange, getInitial }) => {
    const [previewUrl, setPreviewUrl] = useState(initialImage ? URL.createObjectURL(initialImage) : null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
            onChange(file)
        }
    }

    return (
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden cursor-pointer group shadow-md border-2 border-white">
            {previewUrl ? (
                <img src={previewUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <span className="text-4xl font-bold text-blue-500">{getInitial()}</span>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" />
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}
