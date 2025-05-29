"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Plus, Minus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { useTranslation } from "react-i18next"
import { containerVariants, itemVariants } from "../../assets/Animations"

export const ShopSelection = ({ mockItems, cartItems, handleAddToCart, handleRemoveFromCart }) => {
    const { t } = useTranslation()
    console.log("ShopSelection rendered with items:", mockItems)
    return (
        <div className="bg-black/5 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t("shopItems")}</h2>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {mockItems.map((item) => {
                    const rentCartItem = cartItems.find((ci) => ci._id === item._id && ci.rent)
                    return (
                        <motion.div key={item._id} variants={itemVariants}>
                            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
                                <div className="relative h-40 overflow-hidden">
                                    <img src={item.images[0] || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold text-gray-800">{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="flex items-center gap-1 mb-2">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(item.totalReviews || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                        <span className="text-xs ml-1 text-gray-500">{item.totalReviews}</span>
                                        <span className="text-xs ml-1 text-gray-500">{item.category}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-600">${item.price}</span>
                                            {cartItems.find(ci => ci._id === item._id && !ci.rent)?.quantity > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full"
                                                        onClick={() => handleRemoveFromCart(item._id, false)}
                                                    >
                                                        <Minus size={12} />
                                                    </Button>
                                                    <span className="w-5 text-center font-medium">{cartItems.find(ci => ci._id === item._id && !ci.rent)?.quantity || 0}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full"
                                                        onClick={() => handleAddToCart(item._id, false)}
                                                    >
                                                        <Plus size={12} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1"
                                                    onClick={() => handleAddToCart(item._id, false)}
                                                >
                                                    <Plus size={12} />
                                                    {t("buy")}
                                                </Button>
                                            )}
                                        </div>

                                        {item.rent && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-green-600">
                                                    ${item.price} <span className="text-xs">/day</span>
                                                </span>
                                                {cartItems.find(ci => ci._id === item._id && ci.rent)?.quantity > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-full"
                                                            onClick={() => handleRemoveFromCart(item._id, true)}
                                                        >
                                                            <Minus size={12} />
                                                        </Button>
                                                        <span className="w-5 text-center font-medium">{cartItems.find(ci => ci._id === item._id && ci.rent)?.quantity || 0}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-full"
                                                            onClick={() => handleAddToCart(item._id, true)}
                                                        >
                                                            <Plus size={12} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                        onClick={() => handleAddToCart(item._id, true)}
                                                    >
                                                        <Plus size={12} />
                                                        {t("rent")}
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
                <motion.div
                    className="mt-8 bg-blue-50 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourCart")}</h3>
                    <div className="space-y-3">
                        {cartItems.map((cartItem) => {
                            const item = mockItems.find((i) => i._id === cartItem._id)
                            const price = cartItem.rent ? item?.rent : item?.price
                            return (
                                <div
                                    key={`${cartItem._id}`}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                                            <img
                                                src={item?.images[0] || "/placeholder.svg"}
                                                alt={item?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {item?.name}{" "}
                                                {cartItem.rent && <span className="text-xs text-green-600">({t("rental")})</span>}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {t("qty")}: {cartItem.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-blue-600">${((price || 0) * cartItem.quantity).toFixed(2)}</div>
                                </div>
                            )
                        })}
                        <div className="pt-3 border-t border-blue-200 flex justify-between items-center font-bold">
                            <span>{t("cartTotal")}</span>
                            <span className="text-blue-600">
                                $
                                {cartItems
                                    .reduce((sum, item) => {
                                        const itemData = mockItems.find((i) => i._id === item._id)
                                        const price = item.rent ? itemData?.price : itemData?.price
                                        return sum + (price || 0) * item.quantity
                                    }, 0)
                                    .toFixed(2)}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
