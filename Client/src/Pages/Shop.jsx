"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ShoppingBag, Plus, Minus, Star, ArrowLeft, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { toast } from "sonner"

// Mock data for shop items
const shopItems = [
    {
        id: 1,
        name: "Climbing Harness",
        description: "Professional grade climbing harness with adjustable straps",
        price: 45,
        rentalPrice: 12,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both", // can be bought or rented
        rating: 4.8,
        inStock: 15,
    },
    {
        id: 2,
        name: "Hiking Boots",
        description: "Waterproof hiking boots with excellent grip",
        price: 85,
        rentalPrice: null, // cannot be rented
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "footwear",
        type: "buy",
        rating: 4.6,
        inStock: 23,
    },
    {
        id: 3,
        name: "Helmet",
        description: "Safety helmet for climbing and caving adventures",
        price: 30,
        rentalPrice: 8,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both",
        rating: 4.9,
        inStock: 42,
    },
    {
        id: 4,
        name: "Waterproof Jacket",
        description: "Lightweight waterproof jacket for all weather conditions",
        price: 65,
        rentalPrice: 15,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "clothing",
        type: "both",
        rating: 4.7,
        inStock: 18,
    },
    {
        id: 5,
        name: "Trekking Poles",
        description: "Adjustable trekking poles for stability on rough terrain",
        price: 25,
        rentalPrice: 6,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both",
        rating: 4.5,
        inStock: 30,
    },
    {
        id: 6,
        name: "Adventure Camera",
        description: "Waterproof action camera to capture your adventure",
        price: 120,
        rentalPrice: 25,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "electronics",
        type: "both",
        rating: 4.8,
        inStock: 12,
    },
    {
        id: 7,
        name: "Backpack",
        description: "30L backpack with hydration system compatibility",
        price: 55,
        rentalPrice: 10,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both",
        rating: 4.6,
        inStock: 25,
    },
    {
        id: 8,
        name: "Sleeping Bag",
        description: "Compact sleeping bag suitable for various weather conditions",
        price: 40,
        rentalPrice: 12,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both",
        rating: 4.7,
        inStock: 20,
    },
    {
        id: 9,
        name: "Water Bottle",
        description: "Insulated water bottle that keeps drinks cold for 24 hours",
        price: 18,
        rentalPrice: null,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "accessories",
        type: "buy",
        rating: 4.9,
        inStock: 50,
    },
    {
        id: 10,
        name: "Camping Stove",
        description: "Portable camping stove for outdoor cooking",
        price: 35,
        rentalPrice: 8,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both",
        rating: 4.5,
        inStock: 15,
    },
    {
        id: 11,
        name: "Headlamp",
        description: "Bright LED headlamp with adjustable strap",
        price: 22,
        rentalPrice: 5,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "equipment",
        type: "both",
        rating: 4.8,
        inStock: 35,
    },
    {
        id: 12,
        name: "First Aid Kit",
        description: "Comprehensive first aid kit for outdoor adventures",
        price: 28,
        rentalPrice: null,
        image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
        category: "safety",
        type: "buy",
        rating: 4.9,
        inStock: 40,
    },
]

export default function Shop() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all") // all, buy, rent
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)

    // Get unique categories for filter
    const categories = ["all", ...new Set(shopItems.map((item) => item.category))]

    // Filter items based on search, category, and type
    const filteredItems = shopItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

        const matchesType =
            typeFilter === "all" ||
            (typeFilter === "buy" && (item.type === "buy" || item.type === "both")) ||
            (typeFilter === "rent" && (item.type === "rent" || item.type === "both") && item.rentalPrice !== null)

        return matchesSearch && matchesCategory && matchesType
    })

    const addToCart = (item, isRental = false) => {
        setCart((prevCart) => {
            // Check if item already exists in cart with same rental status
            const existingItemIndex = prevCart.findIndex(
                (cartItem) => cartItem.id === item.id && cartItem.isRental === isRental,
            )

            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                const newCart = [...prevCart]
                newCart[existingItemIndex].quantity += 1
                return newCart
            } else {
                // Add new item to cart
                return [
                    ...prevCart,
                    {
                        ...item,
                        quantity: 1,
                        isRental,
                    },
                ]
            }
        })

        toast.success(`${item.name} ${isRental ? "rental" : ""} added to cart`)
    }

    const removeFromCart = (itemId, isRental) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (cartItem) => cartItem.id === itemId && cartItem.isRental === isRental,
            )

            if (existingItemIndex >= 0) {
                const newCart = [...prevCart]
                if (newCart[existingItemIndex].quantity > 1) {
                    // Decrease quantity
                    newCart[existingItemIndex].quantity -= 1
                    return newCart
                } else {
                    // Remove item completely
                    return prevCart.filter((_, index) => index !== existingItemIndex)
                }
            }
            return prevCart
        })
    }

    const clearCart = () => {
        setCart([])
        toast.info("Cart cleared")
    }

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.isRental ? item.rentalPrice : item.price
            return total + price * item.quantity
        }, 0)
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" className="mr-2" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </Button>
                    <h1 className="text-3xl font-bold">Adventure Shop</h1>

                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" className="relative" onClick={() => setShowCart(!showCart)}>
                            <ShoppingCart size={20} />
                            {totalItems > 0 && <Badge className="absolute -top-2 -right-2 bg-blue-600">{totalItems}</Badge>}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar filters */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Search</h3>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            placeholder="Search items..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Category</h3>
                                    <div className="space-y-1">
                                        {categories.map((category) => (
                                            <Button
                                                key={category}
                                                variant={categoryFilter === category ? "default" : "ghost"}
                                                className="w-full justify-start text-left"
                                                onClick={() => setCategoryFilter(category)}
                                            >
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Type</h3>
                                    <div className="space-y-1">
                                        <Button
                                            variant={typeFilter === "all" ? "default" : "ghost"}
                                            className="w-full justify-start text-left"
                                            onClick={() => setTypeFilter("all")}
                                        >
                                            All Items
                                        </Button>
                                        <Button
                                            variant={typeFilter === "buy" ? "default" : "ghost"}
                                            className="w-full justify-start text-left"
                                            onClick={() => setTypeFilter("buy")}
                                        >
                                            Buy Only
                                        </Button>
                                        <Button
                                            variant={typeFilter === "rent" ? "default" : "ghost"}
                                            className="w-full justify-start text-left"
                                            onClick={() => setTypeFilter("rent")}
                                        >
                                            Rent Only
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main content */}
                    <div className="md:col-span-3">
                        {showCart ? (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Your Cart ({totalItems} items)</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setShowCart(false)}>
                                            Continue Shopping
                                        </Button>
                                        {cart.length > 0 && (
                                            <Button variant="outline" onClick={clearCart}>
                                                Clear Cart
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {cart.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                                            <p className="mt-1 text-gray-500">Start adding some items to your cart</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map((item, index) => (
                                                <div
                                                    key={`${item.id}-${item.isRental ? "rental" : "purchase"}`}
                                                    className="flex items-center justify-between border-b pb-4"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            <img
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-medium text-gray-900">
                                                                {item.name}
                                                                {item.isRental && <span className="ml-1 text-sm text-green-600">(Rental)</span>}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                ${item.isRental ? item.rentalPrice : item.price}
                                                                {item.isRental && <span>/day</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="flex items-center border border-gray-300 rounded-md">
                                                            <button
                                                                onClick={() => removeFromCart(item.id, item.isRental)}
                                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                                                            <button
                                                                onClick={() => addToCart(item, item.isRental)}
                                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <p className="text-base font-medium text-gray-900">
                                                                ${((item.isRental ? item.rentalPrice : item.price) * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="border-t pt-4">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>${calculateTotal().toFixed(2)}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                                <div className="mt-6">
                                                    <Button className="w-full">Checkout</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} available
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <Tabs defaultValue="grid" className="w-[200px]">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="grid">Grid</TabsTrigger>
                                                <TabsTrigger value="list">List</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>

                                <Tabs defaultValue="grid" className="w-full">
                                    <TabsContent value="grid" className="mt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredItems.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="h-full"
                                                >
                                                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                        <div className="relative h-48">
                                                            <img
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <Badge className="absolute top-2 right-2 bg-blue-600">{item.inStock} in stock</Badge>
                                                        </div>
                                                        <CardHeader className="pb-2">
                                                            <CardTitle className="text-lg">{item.name}</CardTitle>
                                                            <div className="flex items-center mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                                    />
                                                                ))}
                                                                <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="flex-grow">
                                                            <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                                            <div className="mt-4 space-y-2">
                                                                {(item.type === "buy" || item.type === "both") && (
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-bold text-lg">${item.price}</span>
                                                                        <Button size="sm" onClick={() => addToCart(item, false)}>
                                                                            <Plus size={16} className="mr-1" /> Buy
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                                {item.rentalPrice && (item.type === "rent" || item.type === "both") && (
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-medium text-green-600">
                                                                            ${item.rentalPrice}
                                                                            <span className="text-xs">/day</span>
                                                                        </span>
                                                                        <Button size="sm" variant="outline" onClick={() => addToCart(item, true)}>
                                                                            <Plus size={16} className="mr-1" /> Rent
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="list" className="mt-0">
                                        <div className="space-y-4">
                                            {filteredItems.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Card className="overflow-hidden">
                                                        <div className="flex flex-col sm:flex-row">
                                                            <div className="sm:w-48 h-48 sm:h-auto">
                                                                <img
                                                                    src={item.image || "/placeholder.svg"}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 p-4 flex flex-col">
                                                                <div className="flex justify-between">
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                                                        <div className="flex items-center mt-1">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <Star
                                                                                    key={i}
                                                                                    className={`h-3 w-3 ${i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                                                />
                                                                            ))}
                                                                            <span className="ml-1 text-xs text-gray-600">{item.rating}</span>
                                                                        </div>
                                                                    </div>
                                                                    <Badge className="bg-blue-600">{item.inStock} in stock</Badge>
                                                                </div>

                                                                <p className="text-sm text-gray-500 mt-2 flex-grow">{item.description}</p>

                                                                <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
                                                                    <div className="space-y-1">
                                                                        {(item.type === "buy" || item.type === "both") && (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-bold text-lg">${item.price}</span>
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    Purchase
                                                                                </Badge>
                                                                            </div>
                                                                        )}

                                                                        {item.rentalPrice && (item.type === "rent" || item.type === "both") && (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium text-green-600">
                                                                                    ${item.rentalPrice}
                                                                                    <span className="text-xs">/day</span>
                                                                                </span>
                                                                                <Badge variant="outline" className="text-xs text-green-600">
                                                                                    Rental
                                                                                </Badge>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        {(item.type === "buy" || item.type === "both") && (
                                                                            <Button size="sm" onClick={() => addToCart(item, false)}>
                                                                                <Plus size={16} className="mr-1" /> Buy
                                                                            </Button>
                                                                        )}

                                                                        {item.rentalPrice && (item.type === "rent" || item.type === "both") && (
                                                                            <Button size="sm" variant="outline" onClick={() => addToCart(item, true)}>
                                                                                <Plus size={16} className="mr-1" /> Rent
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                                            <ShoppingBag className="h-full w-full" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                                        <p className="mt-1 text-gray-500">Try adjusting your filters or search term</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
