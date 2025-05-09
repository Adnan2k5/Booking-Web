"use client"

import { useTranslation } from "react-i18next"
import { MapPin, Star, ClipboardCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { useNavigate } from "react-router-dom"

export const BookingSummary = ({
    user,
    adventure,
    selectedInstructor,
    groupMembers,
    cartItems,
    mockItems,
    selectedHotel,
    mockHotels,
    calculateTotal,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) {
                return "Invalid date"
            }
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        } catch (error) {
            console.error("Date formatting error:", error)
            return "Invalid date"
        }
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
            <div className="flex items-center gap-2 mb-6">
                <ClipboardCheck className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">{t("bookingSummary")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - User and Adventure */}
                <div>
                    {/* User Profile */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourProfile")}</h3>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-white shadow-md bg-gradient-to-r from-blue-600 to-cyan-500">
                                <AvatarFallback>{user?.user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-gray-800">{user?.user?.email}</p>
                                <p className="text-sm text-gray-500">{t("adventureEnthusiast")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Adventure Details */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("adventureDetails")}</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={adventure.medias?.[0] || "/placeholder.svg"}
                                        alt={adventure.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{adventure.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={14} />
                                        <span>{adventure.location[0].name}</span>
                                        <span className="text-gray-300">•</span>
                                        <span>{formatDate(adventure.date)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructor Details (if selected) */}
                    {selectedInstructor && (
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourInstructor")}</h3>
                            <div className="flex items-start gap-3">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                    <AvatarImage src={selectedInstructor.img || "/placeholder.svg"} alt={selectedInstructor.name} />
                                    <AvatarFallback>{selectedInstructor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-800">{selectedInstructor.name}</p>
                                    <p className="text-sm text-gray-500">{selectedInstructor.specialty}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-100">
                                <span className="text-gray-600">{t("instructorFee")}</span>
                                <span className="font-medium">${selectedInstructor.price}</span>
                            </div>
                            {groupMembers.length > 0 && (
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-600">{t("additionalGroupFee")}</span>
                                    <span className="font-medium">${groupMembers.length * 30}</span>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Group Members */}
                    {groupMembers.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("yourGroup")}</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-md bg-gradient-to-r from-blue-600 to-cyan-500">
                                        <AvatarFallback>{user?.user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-gray-800">{user?.user?.email}</p>
                                        <p className="text-sm text-gray-500">{t("groupLeader")}</p>
                                    </div>
                                </div>

                                {groupMembers.map((member) => (
                                    <div key={member.id} className="flex items-start gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-800">{member.name}</p>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-100">
                                    <span className="text-gray-600">{t("groupSize")}</span>
                                    <span className="font-medium">
                                        {groupMembers.length + 1} {t("people")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column - Items, Hotel, and Total */}
                <div>
                    {/* Selected Items */}
                    {cartItems.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("selectedItems")}</h3>
                            <div className="space-y-3">
                                {cartItems.map((cartItem) => {
                                    const item = mockItems.find((i) => i.id === cartItem.id)
                                    const price = cartItem.isRental ? item?.rentalPrice : item?.price
                                    return (
                                        <div
                                            key={`${cartItem.id}-${cartItem.isRental ? "rent" : "buy"}`}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item?.img || "/placeholder.svg"}
                                                    alt={item?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">
                                                    {item?.name}{" "}
                                                    {cartItem.isRental && <span className="text-xs text-green-600">({t("rental")})</span>}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {t("qty")}: {cartItem.quantity}
                                                </p>
                                            </div>
                                            <div className="font-medium text-blue-600">${((price || 0) * cartItem.quantity).toFixed(2)}</div>
                                        </div>
                                    )
                                })}
                                <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                                    <span className="text-gray-600">{t("itemsTotal")}</span>
                                    <span className="font-medium">
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
                        </div>
                    )}

                    {/* Selected Hotel */}
                    {selectedHotel && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("selectedAccommodation")}</h3>
                            <div className="flex items-start gap-3">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={mockHotels.find((h) => h.id === selectedHotel)?.img || "/placeholder.svg"}
                                        alt={mockHotels.find((h) => h.id === selectedHotel)?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{mockHotels.find((h) => h.id === selectedHotel)?.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={14} />
                                        <span>{mockHotels.find((h) => h.id === selectedHotel)?.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        <span className="text-xs ml-1 text-gray-500">
                                            {mockHotels.find((h) => h.id === selectedHotel)?.rating}
                                        </span>
                                    </div>
                                </div>
                                <div className="font-medium text-blue-600">
                                    ${mockHotels.find((h) => h.id === selectedHotel)?.price}
                                    <span className="text-xs font-normal text-gray-500">/night</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-4">{t("paymentSummary")}</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center">
                                <span>{t("adventure")}</span>
                                <span>{t("included")}</span>
                            </div>

                            {cartItems.length > 0 && (
                                <div className="flex justify-between items-center">
                                    <span>
                                        {t("items")} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                                    </span>
                                    <span>
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
                            )}

                            {selectedHotel && (
                                <div className="flex justify-between items-center">
                                    <span>{t("hotel")}</span>
                                    <span>${mockHotels.find((h) => h.id === selectedHotel)?.price}</span>
                                </div>
                            )}

                            {selectedInstructor && (
                                <div className="flex justify-between items-center">
                                    <span>
                                        {t("instructor")} ({groupMembers.length + 1} {t("people")})
                                    </span>
                                    <span>${selectedInstructor.price + groupMembers.length * 30}</span>
                                </div>
                            )}

                            {!selectedInstructor && groupMembers.length > 0 && (
                                <div className="flex justify-between items-center">
                                    <span>
                                        {t("groupFee")} ({groupMembers.length} {t("additionalPeople")})
                                    </span>
                                    <span>${groupMembers.length * 30}</span>
                                </div>
                            )}
                        </div>

                        <Separator className="bg-white/20 my-4" />

                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>{t("total")}</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <Button
                            onClick={() => navigate("/confirmation")}
                            className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50"
                        >
                            {t("proceedToPayment")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
