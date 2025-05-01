import { useEffect, useState } from "react";
import {
  Download,
  Plus,
  Search,
  Trash2,
  Edit,
  MapPin,
  UsersIcon,
  X,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { useForm } from "react-hook-form";
import { createAdventure, deleteAdventure, fetchAllAdventures, updateAdventure } from "../../../Api/adventure.api";
import { toast } from "sonner";

export default function AdventuresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [adventures, setAdventures] = useState([]);
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      location: "",
      description: "",
      exp: "",
      medias: [],
    },
  });

  const [showAddAdventure, setShowAddAdventure] = useState(false);
  const [dialogmode, setDialogMode] = useState(false);
  const [editAdventure, setEdit] = useState(null);
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 4) {
      alert("You can upload up to 4 images only.");
      return;
    }

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Filter adventures based on search term and status
  const filteredAdventures = adventures.filter((adventure) => {
    const matchesSearch =
      adventure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adventure.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("date", data.date);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("exp", data.exp);
    images.forEach((image) => {
      formData.append("medias", image.file);
    });
    setLoading(true);
    if (dialogmode) {
      try {
        toast.loading("Updating adventure...");
        formData.append("_id", editAdventure._id);
        const res = await updateAdventure(formData);
        if (res.status === 200) {
          toast.success("Adventure updated successfully");
          setShowAddAdventure(false);
          setImages([]);
        }
      }
      catch (error) {
        toast.error("Error updating adventure");
      }
      finally {
        setLoading(false);
        window.location.reload();
      }
    }
    else {
      try {
        toast.loading("Creating adventure...");
        const res = await createAdventure(formData);
        if (res.status === 201) {
          toast.success("Adventure created successfully");
          setShowAddAdventure(false);
          setImages([]);
        }
      } catch (error) {
        toast.error("Error creating adventure");
      } finally {
        setLoading(false);
        window.location.reload();
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this adventure?")) {
      return;
    }
    toast.loading("Deleting adventure...");
    try {
      const res = await deleteAdventure(id);
      if (res.status === 200) {
        toast.success("Adventure deleted successfully");
      }
    }
    catch (error) {
      toast.error("Error deleting adventure");
      console.log(error)
    }
  }


  const fetchAdventure = async () => {
    try {
      const res = await fetchAllAdventures();
      if (res.status === 200) {
        setAdventures(res.data);
      }
    } catch (error) {
      console.error("Error fetching adventures:", error);
    }
  };

  useEffect(() => {
    fetchAdventure();
  }, []);
  useEffect(() => {
    if (dialogmode && editAdventure) {
      setValue("name", editAdventure.name || "");
      setValue("location", editAdventure.location || "");
      setValue("description", editAdventure.description || "");
      setValue("exp", editAdventure.exp || "");
      setValue("medias", editAdventure.medias || []);
    } else {
      reset({
        name: "",
        location: "",
        description: "",
        exp: "",
        medias: [],
      });
    }
  }, [dialogmode, editAdventure, setValue, reset]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Adventures</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setShowAddAdventure(true);
              setDialogMode(false);
              setEdit(null);
              reset({
                name: "",
                location: "",
                description: "",
                exp: "",
                medias: [],
              });
              setImages([]);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Adventure
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search adventures..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Instructors</TableHead>
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdventures.map((adventure, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {adventure.name}
                      </TableCell>
                      <TableCell>{adventure.location}</TableCell>
                      <TableCell>{adventure.enrolled.length}</TableCell>
                      <TableCell>{adventure.instructors || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-start space-x-2">
                          <Button
                            onClick={() => {
                              setDialogMode(true);
                              setEdit(adventure);
                              setShowAddAdventure(true);
                            }}
                            variant="ghost"
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => { handleDelete(adventure._id) }} variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdventures.map((adventure, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={
                      adventure.medias[0]
                    }
                    alt={adventure.name}
                    className="h-[300px] w-[500px]"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{adventure.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {adventure.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <UsersIcon className="h-3 w-3 mr-1" />
                      <span>{adventure.enrolled.length} bookings</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {adventure.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setDialogMode(true);
                        setEdit(adventure);
                        setShowAddAdventure(true);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button onClick={() => { deleteAdventure(adventure._id) }} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddAdventure} onOpenChange={setShowAddAdventure}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogmode ? `Edit Adventure` : `Create Adventure`}
            </DialogTitle>
            <DialogDescription>
              {dialogmode
                ? `Edit adventure experience `
                : `Create a new adventure experience for your customers.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="name">Adventure Name</Label>
                  <input
                    className="py-1 px-1 border rounded-md placeholder:text-sm"
                    {...register("name")}
                    id="name"
                    placeholder="Enter adventure name"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="location">Location</Label>
                  <input
                    className="py-1 px-1 border rounded-md placeholder:text-sm"
                    {...register("location")}
                    id="location"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4"></div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="description">Description</Label>
                <textarea
                  className="px-2 py-2 border rounded-md placeholder:text-sm"
                  {...register("description")}
                  id="description"
                  placeholder="Describe the adventure experience"
                />
              </div>
              <div className="flex gap-8">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="status">Experience Points</Label>
                  <input
                    className="py-1 px-1 border rounded-md placeholder:text-sm"
                    {...register("exp")}
                    id="experience"
                    placeholder="Enter experience"
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="image">Upload Images & Videos (Max 4)</Label>
                <input
                  className="py-1 px-1 border rounded-md placeholder:text-sm"
                  id="image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={images.length >= 4}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {dialogmode &&
                    editAdventure?.medias?.map((img, index) => (
                      <div
                        key={index}
                        className="relative group w-[22%] h-24"
                      >
                        <img
                          src={img}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  {images?.map((img, index) => (
                    <div key={index} className="relative group w-[22%] h-24">
                      <img
                        src={img.url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddAdventure(false)}
              >
                Cancel
              </Button>
              {loading ? (
                <Button>Posting...</Button>
              ) : (
                <Button>{dialogmode ? `Update` : `Create Adventure`}</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
