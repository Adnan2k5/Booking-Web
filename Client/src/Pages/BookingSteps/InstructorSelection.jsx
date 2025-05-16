"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Eye, Check, Plus, Award, Clock, Heart, MessageCircle } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { useTranslation } from "react-i18next"

export const InstructorSelection = ({
    mockInstructors,
    selectedInstructor,
    handleInstructorSelect,
    openInstructorDialog,
    isInstructorDialogOpen,
    setIsInstructorDialogOpen,
    currentInstructor,
    groupMembers,
}) => {
    const { t } = useTranslation()
    const [activeGalleryImage, setActiveGalleryImage] = useState(0)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-8 border border-white/50">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t("selectInstructor")}</h2>
                {groupMembers.length > 0 && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                        {t("groupOf")} {groupMembers.length + 1}
                    </Badge>
                )}
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {mockInstructors.map((instructor) => (
                    <motion.div key={instructor._id} variants={itemVariants}>
                        <Card
                            className={cn(
                                "overflow-hidden h-full transition-all duration-300 border-2",
                                selectedInstructor && selectedInstructor._id === instructor._id
                                    ? "border-blue-500 shadow-md shadow-blue-200"
                                    : "border-transparent hover:border-blue-200",
                            )}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 p-4 flex justify-center items-start">
                                    <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                                        <AvatarImage src={instructor.instructorId?.profilePicture || "/placeholder.svg"} alt={instructor.instructorId?.name} />
                                        <AvatarFallback>{instructor.instructorId?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="md:w-2/3 p-4">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{instructor.instructorId?.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span>{instructor.instructorId?.instructor.description[0]}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            star <= instructor.instructorId?.instructor.avgReview ? (
                                                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ) : null
                                        ))}
                                        <span className="text-xs ml-1 text-gray-500">{instructor.instructorId?.instructor.avgReview}</span>
                                    </div> */}
                                    {/* <p className="text-sm text-gray-600 mb-3 line-clamp-2">{instructor.instructorId?.instructor.description}</p> */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-blue-600">
                                            ${instructor.price + groupMembers.length * 30}
                                            <span className="text-sm font-normal text-gray-500">/session</span>
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1"
                                                onClick={() => openInstructorDialog(instructor)}
                                            >
                                                <Eye size={14} />
                                                {t("view")}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className={cn(
                                                    "flex items-center gap-1",
                                                    selectedInstructor && selectedInstructor._id === instructor._id
                                                        ? "bg-green-600 hover:bg-green-700"
                                                        : "bg-blue-600 hover:bg-blue-700",
                                                )}
                                                onClick={() => (selectedInstructor?._id === instructor._id) ? handleInstructorSelect(null) : handleInstructorSelect(instructor._id)}>
                                                {selectedInstructor && selectedInstructor._id === instructor._id ? (
                                                    <>
                                                        <Check size={14} />
                                                        {t("selected")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={14} />
                                                        {t("select")}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Instructor Dialog */}
            <Dialog open={isInstructorDialogOpen} onOpenChange={setIsInstructorDialogOpen}>
                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white rounded-xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">{currentInstructor?.instructorId?.name}</DialogTitle>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left side - Photo and Gallery */}
                            <div className="md:w-1/2">
                                <Tabs defaultValue="profile" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
                                        <TabsTrigger value="gallery">{t("gallery")}</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="profile" className="mt-4">
                                        <div className="rounded-xl overflow-hidden">
                                            <img
                                                src={currentInstructor?.instructorId.profilePicture || "/placeholder.svg"}
                                                alt={currentInstructor?.instructorId.name}
                                                className="w-full aspect-[3/4] object-cover rounded-xl"
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="gallery" className="mt-4">
                                        <div className="space-y-4">
                                            <div className="rounded-xl overflow-hidden">
                                                <img
                                                    src={currentInstructor?.instructorId.instructor.portfolioMedias && currentInstructor?.instructorId.instructor.portfolioMedias.length > 0 && currentInstructor?.instructorId.instructor?.portfolioMedias[0] || "/placeholder.svg"}
                                                    alt={`${currentInstructor?.instructorId.name} gallery`}
                                                    className="w-full aspect-[3/4] object-cover rounded-xl"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {currentInstructor?.instructorId.instructor.portfolioMedias?.map((img, index) => (
                                                    <div
                                                        key={index}
                                                        className={`rounded-lg overflow-hidden cursor-pointer border-2 ${activeGalleryImage === index ? "border-blue-500" : "border-transparent"}`}
                                                        onClick={() => setActiveGalleryImage(index)}
                                                    >
                                                        <img src={img || "/placeholder.svg"} alt="" className="w-full h-16 object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="mt-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">{t("about")}</h3>
                                    <p className="text-gray-600">{currentInstructor?.instructorId.instructor.description[0]}</p>
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">{t("languages")}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentInstructor?.languages?.map((language, index) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50">
                                                {language}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Details */}
                            <div className="md:w-1/2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                                            <span>{currentInstructor?.specialty}</span>
                                            <span className="text-gray-300">•</span>
                                            <div className="flex w-full items-center gap-1">
                                                <Clock size={14} />
                                                <span>{currentInstructor?.experience}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 md:mr-8 bg-blue-50 px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold">{currentInstructor?.instructorId.instructor.avgReview}</span>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{t("achievements")}</h3>
                                        <ul className="space-y-2">
                                            {currentInstructor?.achievements?.map((achievement, index) => (
                                                <li key={index} className="text-sm flex items-start gap-2">
                                                    <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                                                    <span>{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{t("certificates")}</h3>
                                        <ul className="space-y-2">
                                            {currentInstructor?.certificates?.map((certificate, index) => (
                                                <li key={index} className="text-sm flex items-start gap-2">
                                                    <Award size={14} className="text-blue-500 mt-1 flex-shrink-0" />
                                                    <span>{certificate}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{t("contactInstructor")}</h3>
                                        <Button className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                                            <MessageCircle size={16} />
                                            {t("sendMessage")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-5 md:gap-0 md:flex-row justify-between items-center">
                                    <div className="font-bold text-blue-600 text-xl">
                                        ${currentInstructor?.price + groupMembers.length * 30}
                                        <span className="text-sm font-normal text-gray-500">/session</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            className={cn(
                                                "flex items-center gap-1 bg-gradient-to-r",
                                                selectedInstructor && selectedInstructor._id === currentInstructor?._id
                                                    ? "from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                                                    : "from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600",
                                            )}
                                            onClick={() => {
                                                handleInstructorSelect(currentInstructor?._id)
                                            }}
                                        >
                                            {selectedInstructor && selectedInstructor._id === currentInstructor?._id ? (
                                                <>
                                                    <Check size={14} />
                                                    {t("selected")}
                                                </>
                                            ) : (
                                                <>
                                                    <Heart size={14} />
                                                    {t("selectInstructor")}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
