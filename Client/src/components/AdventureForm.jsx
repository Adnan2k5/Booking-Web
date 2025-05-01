import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createAdventure, updateAdventure } from "../../../Api/adventure.api";
import { toast } from "sonner";

const AdventureForm = ({ dialogmode, editAdventure, setShowAddAdventure, setDialogMode, setEdit, fetchAdventure }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editAdventure || {
      name: "",
      location: "",
      description: "",
      exp: "",
      medias: [],
    },
  });

  React.useEffect(() => {
    reset(editAdventure || {
      name: "",
      location: "",
      description: "",
      exp: "",
      medias: [],
    });
  }, [editAdventure, reset]);

  const onSubmit = async (data) => {
    toast.loading(dialogmode ? "Updating adventure..." : "Creating adventure...");
    try {
      if (dialogmode && editAdventure) {
        await updateAdventure(editAdventure._id, data);
        toast.success("Adventure updated successfully");
      } else {
        await createAdventure(data);
        toast.success("Adventure created successfully");
      }
      setShowAddAdventure(false);
      setDialogMode(false);
      setEdit(null);
      fetchAdventure();
    } catch (error) {
      toast.error("Error saving adventure");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Name" {...register("name", { required: true })} />
      {errors.name && <span className="text-red-500">Name is required</span>}
      <Input placeholder="Location" {...register("location", { required: true })} />
      {errors.location && <span className="text-red-500">Location is required</span>}
      <Input placeholder="Description" {...register("description", { required: true })} />
      {errors.description && <span className="text-red-500">Description is required</span>}
      <Input placeholder="Experience" {...register("exp", { required: true })} />
      {errors.exp && <span className="text-red-500">Experience is required</span>}
      {/* Add media upload if needed */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setShowAddAdventure(false)}>
          Cancel
        </Button>
        <Button type="submit">{dialogmode ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
};

export default AdventureForm;
