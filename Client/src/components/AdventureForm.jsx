import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createAdventure, updateAdventure } from "../Api/adventure.api";
import { fetchLocations } from "../Api/location.api";
import { toast } from "sonner";
import { useEffect } from "react";
import MediaPreview from "./MediaPreview";

const AdventureForm = ({ dialogmode, editAdventure, setShowAddAdventure, setDialogMode, setEdit, fetchAdventure }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: editAdventure || {
      name: "",
      location: [],
      description: "",
      exp: "",
      medias: [],
    },
  });

  const [mediaFiles, setMediaFiles] = React.useState([]);
  const [mediaPreviews, setMediaPreviews] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locations, setLocations] = React.useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = React.useState(false);
  const [selectedLocations, setSelectedLocations] = React.useState(editAdventure?.location || []);

  // Generate previews when files are selected or when editing
  useEffect(() => {
    let previews = [];
    // Show existing medias from editAdventure in edit mode
    if (editAdventure && editAdventure.medias && Array.isArray(editAdventure.medias)) {
      previews = editAdventure.medias.map((media, idx) => {
        // Assume media is a URL string or an object with url/type/name
        if (typeof media === 'string') {
          // Guess type from extension
          const ext = media.split('.').pop().toLowerCase();
          let type = '';
          if (["jpg","jpeg","png","gif","webp","bmp"].includes(ext)) type = 'image';
          else if (["mp4","webm","ogg","mov","avi"].includes(ext)) type = 'video';
          else type = 'file';
          return {
            url: media,
            type: type,
            name: media.split('/').pop() || `media-${idx}`,
            isServer: true,
          };
        } else {
          return { ...media, isServer: true };
        }
      });
    }
    // Add previews for newly selected files
    if (mediaFiles.length) {
      const filePreviews = mediaFiles.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        isServer: false,
      }));
      previews = [...previews, ...filePreviews];
    }
    setMediaPreviews(previews);
    // Cleanup only for local files
    return () => {
      if (mediaFiles.length) {
        previews.filter(p => !p.isServer).forEach(p => URL.revokeObjectURL(p.url));
      }
    };
  }, [mediaFiles, editAdventure]);

  // Remove a selected media file (only local files)
  const handleRemoveMedia = (idx) => {
    // Only allow removing local files (after server files)
    const serverCount = (editAdventure && editAdventure.medias && Array.isArray(editAdventure.medias)) ? editAdventure.medias.length : 0;
    if (idx >= serverCount) {
      setMediaFiles(files => files.filter((_, i) => i !== (idx - serverCount)));
    }
    // Optionally, handle server media removal here if backend supports it
  };

  useEffect(() => {
    reset(editAdventure || {
      name: "",
      location: [],
      description: "",
      exp: "",
      medias: [],
    });
  }, [editAdventure, reset]);

  useEffect(() => {
    // Fetch locations for dropdown
    fetchLocations().then(res => {
      if (res && res.data) setLocations(res.data);
    }).catch(() => setLocations([]));
  }, []);

  // Sync selectedLocations with form value
  useEffect(() => {
    setValue("location", selectedLocations);
  }, [selectedLocations, setValue]);

  // When editing, update selectedLocations
  useEffect(() => {
    setSelectedLocations(editAdventure?.location || []);
  }, [editAdventure]);

  const toggleLocation = (locId) => {
    setSelectedLocations((prev) =>
      prev.includes(locId)
        ? prev.filter((id) => id !== locId)
        : [...prev, locId]
    );
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading(dialogmode ? "Updating adventure..." : "Creating adventure...");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      data.location.forEach(locId => formData.append("location", locId));
      formData.append("description", data.description);
      formData.append("exp", data.exp);
      if (editAdventure && editAdventure._id) {
        formData.append("_id", editAdventure._id);
      }
      mediaFiles.forEach((file) => {
        formData.append("medias", file);
      });
      if (dialogmode && editAdventure) {
        await updateAdventure(formData);
        toast.success("Adventure updated successfully", { id: toastId });
      } else {
        await createAdventure(formData);
        toast.success("Adventure created successfully", { id: toastId });
      }
      setShowAddAdventure(false);
      setDialogMode(false);
      setEdit(null);
      fetchAdventure();
    } catch (error) {
      toast.error("Error saving adventure", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Name" disabled={isSubmitting} {...register("name", { required: true })} />
      {errors.name && <span className="text-red-500">Name is required</span>}
      <label className="block relative">Location
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
                  e.stopPropagation();
                  toggleLocation(loc._id);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(loc._id)}
                  readOnly
                  className="mr-2"
                />
                <span>{loc.name}</span>
              </div>
            ))}
          </div>
        )}
      </label>
      {errors.location && <span className="text-red-500">Location is required</span>}
      <Input placeholder="Description" disabled={isSubmitting} {...register("description", { required: true })} />
      {errors.description && <span className="text-red-500">Description is required</span>}
      <Input placeholder="Experience" type="number" disabled={isSubmitting} {...register("exp", { required: true })} />
      {errors.exp && <span className="text-red-500">Experience is required</span>}
      <label className="block">Media (images/videos):
        <Input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={e => setMediaFiles(Array.from(e.target.files))}
          className="block mt-1"
          disabled={isSubmitting}
        />
      </label>
      <MediaPreview mediaPreviews={mediaPreviews} onRemove={handleRemoveMedia} isSubmitting={isSubmitting} />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setShowAddAdventure(false)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>{dialogmode ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
};

export default AdventureForm;
