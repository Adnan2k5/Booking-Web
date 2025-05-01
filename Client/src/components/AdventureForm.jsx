import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createAdventure, updateAdventure } from "../Api/adventure.api";
import { toast } from "sonner";
import { useEffect } from "react";

const AdventureForm = ({ dialogmode, editAdventure, setShowAddAdventure, setDialogMode, setEdit, fetchAdventure }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: editAdventure || {
      name: "",
      location: "",
      description: "",
      exp: "",
      medias: [],
    },
  });
  const [mediaFiles, setMediaFiles] = React.useState([]);
  const [mediaPreviews, setMediaPreviews] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Generate previews when files are selected
  useEffect(() => {
    if (!mediaFiles.length) {
      setMediaPreviews([]);
      return;
    }
    const previews = mediaFiles.map(file => {
      return {
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
      };
    });
    setMediaPreviews(previews);
    // Cleanup
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
  }, [mediaFiles]);

  // Remove a selected media file
  const handleRemoveMedia = (idx) => {
    setMediaFiles(files => files.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    reset(editAdventure || {
      name: "",
      location: "",
      description: "",
      exp: "",
      medias: [],
    });
  }, [editAdventure, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading(dialogmode ? "Updating adventure..." : "Creating adventure...");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("location", data.location);
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
      toast.error("Error saving adventure");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Name" disabled={isSubmitting} {...register("name", { required: true })} />
      {errors.name && <span className="text-red-500">Name is required</span>}
      <Input placeholder="Location" disabled={isSubmitting} {...register("location", { required: true })} />
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
      {/* Enhanced media preview UI */}
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
            <button type="button" onClick={() => handleRemoveMedia(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-1 text-xs text-red-600 hover:bg-opacity-100" disabled={isSubmitting}>✕</button>
          </div>
        ))}
      </div>
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
