import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'

// Mock data for shop items
const shopItems = [
  {
    id: 1,
    name: "Climbing Harness",
    description: "Professional grade climbing harness with adjustable straps",
    price: 45,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "equipment",
    type: "rent",
  },
  {
    id: 2,
    name: "Hiking Boots",
    description: "Waterproof hiking boots with excellent grip",
    price: 85,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "footwear",
    type: "buy",
  },
  {
    id: 3,
    name: "Helmet",
    description: "Safety helmet for climbing and caving adventures",
    price: 30,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "equipment",
    type: "rent",
  },
  {
    id: 4,
    name: "Waterproof Jacket",
    description: "Lightweight waterproof jacket for all weather conditions",
    price: 65,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "clothing",
    type: "buy",
  },
  {
    id: 5,
    name: "Trekking Poles",
    description: "Adjustable trekking poles for stability on rough terrain",
    price: 25,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "equipment",
    type: "rent",
  },
  {
    id: 6,
    name: "Adventure Camera",
    description: "Waterproof action camera to capture your adventure",
    price: 120,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "electronics",
    type: "buy",
  },
  {
    id: 7,
    name: "Backpack",
    description: "30L backpack with hydration system compatibility",
    price: 55,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "equipment",
    type: "buy",
  },
  {
    id: 8,
    name: "Sleeping Bag",
    description: "Compact sleeping bag suitable for various weather conditions",
    price: 40,
    image: "https://m.media-amazon.com/images/I/7142a2LvzvL.jpg",
    category: "equipment",
    type: "rent",
  },
]

const ItemCard = ({ item, selectedItems, onAddItem, onUpdateQuantity, onRemoveItem }) => {
  const selectedItem = selectedItems.find(selected => selected.id === item.id);
  const quantity = selectedItem ? selectedItem.quantity : 0;

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
          {item.type === "rent" ? "Rent" : "Buy"}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        <div className="mt-auto">
          <div className="font-bold text-blue-600 text-lg mb-3">${item.price}</div>

          {quantity > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddItem({ ...item, quantity: 1 })}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export const ShopSelection = ({ selectedItems, onAddItem, onRemoveItem }) => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeType, setActiveType] = useState("all")

  const categories = ["all", "equipment", "clothing", "footwear", "electronics"]
  const types = ["all", "rent", "buy"]

  const filteredItems = shopItems.filter((item) => {
    const categoryMatch = activeCategory === "all" || item.category === activeCategory
    const typeMatch = activeType === "all" || item.type === activeType
    return categoryMatch && typeMatch
  })

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      onRemoveItem(itemId);
      return;
    }
    const item = selectedItems.find(item => item.id === itemId);
    if (item) {
      const updatedItem = { ...item, quantity: newQuantity };
      onRemoveItem(itemId); // Remove the old item
      onAddItem(updatedItem); // Add the updated item
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" /> Adventure Shop
        </h2>

        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${activeCategory === category ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Type</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-3 py-1 rounded-full text-sm ${activeType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto self-end text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {selectedItems.reduce((total, item) => total + item.quantity, 0)} item(s) selected
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-3">Your Cart</h3>
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                <div className="flex items-center gap-3">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price} × {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-1 border-x border-gray-300 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-medium text-blue-800 pt-2 border-t border-blue-100">
              <span>Total:</span>
              <span>${selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            selectedItems={selectedItems}
            onAddItem={onAddItem}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-10 text-gray-500">No items found matching your filters.</div>
      )}
    </motion.div>
  )
}
