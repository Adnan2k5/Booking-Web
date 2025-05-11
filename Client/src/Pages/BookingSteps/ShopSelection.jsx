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
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
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
                    const buyCartItem = cartItems.find((ci) => ci.id === item.id && !ci.isRental)
                    const rentCartItem = cartItems.find((ci) => ci.id === item.id && ci.isRental)
                    const buyQuantity = buyCartItem ? buyCartItem.quantity : 0
                    const rentQuantity = rentCartItem ? rentCartItem.quantity : 0

                    return (
                        <motion.div key={item.id} variants={itemVariants}>
                            <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
                                <div className="relative h-40 overflow-hidden">
                                    <img src={item.img || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                                    {(buyQuantity > 0 || rentQuantity > 0) && (
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            {buyQuantity > 0 && (
                                                <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    {t("buy")}: {buyQuantity}
                                                </div>
                                            )}
                                            {rentQuantity > 0 && (
                                                <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    {t("rent")}: {rentQuantity}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold text-gray-800">{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-xs ml-1 text-gray-500">{item.rating}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-600">${item.price}</span>
                                            {buyQuantity > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full"
                                                        onClick={() => handleRemoveFromCart(item.id, false)}
                                                    >
                                                        <Minus size={12} />
                                                    </Button>
                                                    <span className="w-5 text-center font-medium">{buyQuantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full"
                                                        onClick={() => handleAddToCart(item.id, false)}
                                                    >
                                                        <Plus size={12} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1"
                                                    onClick={() => handleAddToCart(item.id, false)}
                                                >
                                                    <Plus size={12} />
                                                    {t("buy")}
                                                </Button>
                                            )}
                                        </div>

                                        {item.canRent && (
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-green-600">
                                                    ${item.rentalPrice} <span className="text-xs">/day</span>
                                                </span>
                                                {rentQuantity > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-full"
                                                            onClick={() => handleRemoveFromCart(item.id, true)}
                                                        >
                                                            <Minus size={12} />
                                                        </Button>
                                                        <span className="w-5 text-center font-medium">{rentQuantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-7 w-7 rounded-full"
                                                            onClick={() => handleAddToCart(item.id, true)}
                                                        >
                                                            <Plus size={12} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                        onClick={() => handleAddToCart(item.id, true)}
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
                            const item = mockItems.find((i) => i.id === cartItem.id)
                            const price = cartItem.isRental ? item?.rentalPrice : item?.price
                            return (
                                <div
                                    key={`${cartItem.id}-${cartItem.isRental ? "rent" : "buy"}`}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                                            <img
                                                src={item?.img || "/placeholder.svg"}
                                                alt={item?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {item?.name}{" "}
                                                {cartItem.isRental && <span className="text-xs text-green-600">({t("rental")})</span>}
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
                                        const itemData = mockItems.find((i) => i.id === item.id)
                                        const price = item.isRental ? itemData?.rentalPrice : itemData?.price
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
