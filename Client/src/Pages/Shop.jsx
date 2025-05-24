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
import { useBrowse } from "../hooks/useItems"
import { useCategory } from "../hooks/useCategory"


export default function ItemsPage() {
    const { addToCart } = useContext(CartContext)
    const { items, filters, setFilters } = useBrowse()


    const { categories } = useCategory()

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
                            value={filters.search || ""}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
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
                            <DropdownMenuItem onClick={() => setFilters((prev) => ({ ...prev, category: "" }))}>All Categories</DropdownMenuItem>
                            {categories.map((category) => (
                                <DropdownMenuItem key={category._id} onClick={() => setFilters((prev) => ({ ...prev, category: category.name }))}>
                                    {category.name}
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
                        {items.map((item) => (
                            <div key={item._id} className="border rounded-md overflow-hidden group relative">
                                <Link to={`/product/${item._id}`} className="block">
                                    <div className="aspect-square relative overflow-hidden">
                                        <img
                                            src={item.images[0] || "/placeholder.svg"}
                                            alt={item.name}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                </Link>

                                <div className="p-3">
                                    <div className="text-sm text-gray-500 uppercase font-medium">{item.category}</div>
                                    <h3 className="font-medium text-sm mt-1 line-clamp-2">{item.name}</h3>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{item.price.toFixed(2)} €</span>
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
                                    <Link to={`/product/${item._id}`}>
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
                        {items.map((item) => (
                            <div key={item._id} className="border rounded-md overflow-hidden flex">
                                <Link to={`/product/${item._id}`} className="block w-40 h-40">
                                    <div className="w-40 h-40 relative">
                                        <img
                                            src={item.images[0] || "/placeholder.svg"}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />

                                    </div>
                                </Link>

                                <div className="p-4 flex-1">
                                    <div className="text-sm text-gray-500 uppercase font-medium">{item.category}</div>
                                    <h3 className="font-medium mt-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">{item.price.toFixed(2)} €</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                                                <ShoppingBag className="h-4 w-4 mr-2" />
                                                Add to cart
                                            </Button>
                                            <Link to={`/product/${item._id}`}>
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
