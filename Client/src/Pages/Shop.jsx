"use client"

import { useState, useContext } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, Eye, Heart, ShoppingBag } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { CartContext } from "./Cart/CartContext"
import { Link } from "react-router-dom"

// Mock data for items/products
const mockItems = [
    {
        id: 1,
        name: "Hiking Backpack",
        description: "Durable 40L backpack perfect for multi-day hikes",
        category: "Equipment",
        brand: "OSPREY",
        price: 129.99,
        originalPrice: 149.99,
        stock: 45,
        status: "in-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 2,
        name: "Climbing Harness",
        description: "Professional-grade climbing harness with adjustable leg loops",
        category: "Safety Gear",
        brand: "BLACK DIAMOND",
        price: 89.99,
        originalPrice: 89.99,
        stock: 32,
        status: "in-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 3,
        name: "Waterproof Tent",
        description: "3-person tent with rainfly and waterproof floor",
        category: "Equipment",
        brand: "BIG AGNES",
        price: 199.99,
        originalPrice: 249.99,
        stock: 18,
        status: "in-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 4,
        name: "Trekking Poles",
        description: "Adjustable aluminum trekking poles with cork grips",
        category: "Equipment",
        brand: "BLACK DIAMOND",
        price: 49.99,
        originalPrice: 49.99,
        stock: 60,
        status: "in-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 5,
        name: "Adventure First Aid Kit",
        description: "Comprehensive first aid kit for outdoor adventures",
        category: "Safety Gear",
        brand: "ADVENTURE MEDICAL",
        price: 34.99,
        originalPrice: 34.99,
        stock: 75,
        status: "in-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 6,
        name: "Insulated Water Bottle",
        description: "1L vacuum insulated stainless steel water bottle",
        category: "Accessories",
        brand: "HYDRO FLASK",
        price: 29.99,
        originalPrice: 39.99,
        stock: 0,
        status: "out-of-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 7,
        name: "Headlamp",
        description: "300-lumen LED headlamp with adjustable brightness",
        category: "Equipment",
        brand: "PETZL",
        price: 45.99,
        originalPrice: 45.99,
        stock: 28,
        status: "in-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
    {
        id: 8,
        name: "Climbing Rope",
        description: "60m dynamic climbing rope with middle mark",
        category: "Safety Gear",
        brand: "MAMMUT",
        price: 159.99,
        originalPrice: 189.99,
        stock: 12,
        status: "low-stock",
        image: "/placeholder.svg?height=400&width=400",
        images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
        ],
    },
]

export default function ItemsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const { addToCart } = useContext(CartContext)

    // Filter items based on search term and category
    const filteredItems = mockItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase()
        return matchesSearch && matchesCategory
    })

    // Get unique categories for filter dropdown
    const categories = [...new Set(mockItems.map((item) => item.category))]

    return (

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-7xl mx-auto px-4 py-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
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
                            <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                            {categories.map((category) => (
                                <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                                    {category}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs defaultValue="grid" className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="grid">Grid View</TabsTrigger>
                        <TabsTrigger value="list">List View</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="grid" className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="border rounded-md overflow-hidden group relative">
                                <Link to={`/product/${item.id}`} className="block">
                                    <div className="aspect-square relative overflow-hidden">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {item.originalPrice > item.price && (
                                            <Badge className="absolute top-2 right-2 bg-red-500">
                                                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                            </Badge>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-3">
                                    <div className="text-sm text-gray-500 uppercase font-medium">{item.brand}</div>
                                    <h3 className="font-medium text-sm mt-1 line-clamp-2">{item.name}</h3>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            {item.originalPrice > item.price ? (
                                                <>
                                                    <span className="text-gray-400 line-through text-sm">{item.originalPrice.toFixed(2)} €</span>
                                                    <span className="font-bold text-red-500">{item.price.toFixed(2)} €</span>
                                                </>
                                            ) : (
                                                <span className="font-bold">{item.price.toFixed(2)} €</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            addToCart(item)
                                        }}
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                    </Button>
                                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white hover:bg-gray-100">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Link to={`/product/${item.id}`}>
                                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white hover:bg-gray-100">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="border rounded-md overflow-hidden flex">
                                <Link to={`/product/${item.id}`} className="block w-40 h-40">
                                    <div className="w-40 h-40 relative">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                        {item.originalPrice > item.price && (
                                            <Badge className="absolute top-2 right-2 bg-red-500">
                                                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                            </Badge>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-4 flex-1">
                                    <div className="text-sm text-gray-500 uppercase font-medium">{item.brand}</div>
                                    <h3 className="font-medium mt-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            {item.originalPrice > item.price ? (
                                                <>
                                                    <span className="text-gray-400 line-through">{item.originalPrice.toFixed(2)} €</span>
                                                    <span className="font-bold text-red-500 text-lg">{item.price.toFixed(2)} €</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-lg">{item.price.toFixed(2)} €</span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                                                <ShoppingBag className="h-4 w-4 mr-2" />
                                                Add to cart
                                            </Button>
                                            <Link to={`/product/${item.id}`}>
                                                <Button variant="default" size="sm">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}
