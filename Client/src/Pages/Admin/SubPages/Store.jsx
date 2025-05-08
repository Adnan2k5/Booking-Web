import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, ChevronDown, Eye, Edit, Trash2, Plus, ShoppingBag, Tag, Package, X } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
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
import { Badge } from "../../../components/ui/badge";
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
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useForm, Controller } from "react-hook-form";

// Mock data for items/products
const mockItems = [
  {
    id: 1,
    name: "Hiking Backpack",
    description: "Durable 40L backpack perfect for multi-day hikes",
    category: "Equipment",
    price: 129.99,
    stock: 45,
    status: "in-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Climbing Harness",
    description: "Professional-grade climbing harness with adjustable leg loops",
    category: "Safety Gear",
    price: 89.99,
    stock: 32,
    status: "in-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Waterproof Tent",
    description: "3-person tent with rainfly and waterproof floor",
    category: "Equipment",
    price: 199.99,
    stock: 18,
    status: "in-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Trekking Poles",
    description: "Adjustable aluminum trekking poles with cork grips",
    category: "Equipment",
    price: 49.99,
    stock: 60,
    status: "in-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Adventure First Aid Kit",
    description: "Comprehensive first aid kit for outdoor adventures",
    category: "Safety Gear",
    price: 34.99,
    stock: 75,
    status: "in-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Insulated Water Bottle",
    description: "1L vacuum insulated stainless steel water bottle",
    category: "Accessories",
    price: 29.99,
    stock: 0,
    status: "out-of-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 7,
    name: "Headlamp",
    description: "300-lumen LED headlamp with adjustable brightness",
    category: "Equipment",
    price: 45.99,
    stock: 28,
    status: "in-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Climbing Rope",
    description: "60m dynamic climbing rope with middle mark",
    category: "Safety Gear",
    price: 159.99,
    stock: 12,
    status: "low-stock",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      status: ""
    }
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddItem, setShowAddItem] = useState(false);
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

  // Filter items based on search term and category
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
    console.log("Images:", images);
    // Here you would typically send the data to your API
    setShowAddItem(false);
    reset();
    setImages([]);
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(mockItems.map(item => item.category))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Items</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddItem(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
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
                placeholder="Search items..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Category
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "in-stock"
                              ? "default"
                              : item.status === "low-stock"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {item.status === "in-stock"
                            ? "In Stock"
                            : item.status === "low-stock"
                              ? "Low Stock"
                              : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={
                      item.status === "in-stock"
                        ? "default"
                        : item.status === "low-stock"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {item.status === "in-stock"
                      ? "In Stock"
                      : item.status === "low-stock"
                        ? "Low Stock"
                        : "Out of Stock"}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" /> {item.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      <span>{item.stock} in stock</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="font-bold">${item.price.toFixed(2)}</div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter item name"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">Add New Category</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price", { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...register("stock", { required: true, min: 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item"
                  {...register("description", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Upload Images (Max 4)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={images.length >= 4}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {images?.map((img, index) => (
                    <div key={index} className="relative group w-[22%] h-24">
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
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
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddItem(false);
                  reset();
                  setImages([]);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
