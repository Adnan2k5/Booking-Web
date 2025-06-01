"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, DollarSign, Info, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Label } from "../../components/ui/label"
import { toast } from "sonner"
import InstructorLayout from "./InstructorLayout"

const adventureTypes = [
    "Mountain Climbing",
    "Wilderness Survival",
    "Rock Climbing",
    "Alpine Hiking",
    "Kayaking",
    "Scuba Diving",
    "Paragliding",
    "Skiing",
]

const locations = [
    "Alpine Heights",
    "Evergreen Forest",
    "Granite Peaks",
    "Mountain Range",
    "Crystal Lake",
    "Coastal Cliffs",
    "Desert Canyon",
    "Snowy Summit",
]

const SessionForm = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        title: "",
        adventure: "",
        location: "",
        price: "",
        duration: "",
        capacity: "",
        description: "",
        dates: [{ date: "", time: "", capacity: "" }],
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateChange = (index, field, value) => {
        const newDates = [...formData.dates]
        newDates[index] = {
            ...newDates[index],
            [field]: value,
        }
        setFormData((prev) => ({
            ...prev,
            dates: newDates,
        }))
    }

    const addDate = () => {
        setFormData((prev) => ({
            ...prev,
            dates: [...prev.dates, { date: "", time: "", capacity: "" }],
        }))
    }

    const removeDate = (index) => {
        const newDates = [...formData.dates]
        newDates.splice(index, 1)
        setFormData((prev) => ({
            ...prev,
            dates: newDates,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (
            !formData.title ||
            !formData.adventure ||
            !formData.location ||
            !formData.price ||
            !formData.duration ||
            !formData.capacity ||
            !formData.description
        ) {
            toast.error(t("instructor.pleaseCompleteAllFields"))
            return
        }

        const validDates = formData.dates.filter((date) => date.date && date.time && date.capacity)
        if (validDates.length === 0) {
            toast.error(t("instructor.pleaseAddAtLeastOneDate"))
            return
        }

        toast.success(t("instructor.sessionCreatedSuccessfully"))
        navigate("/instructor/sessions")
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    }

    return (
        <InstructorLayout>
            <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/instructor/sessions")}
                            className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
                        >
                            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                            <span className="hidden sm:inline">{t("instructor.createNewSession")}</span>
                            <span className="sm:hidden">New Session</span>
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <motion.div className="grid gap-4 sm:gap-6" variants={fadeIn} initial="hidden" animate="visible">
                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-lg sm:text-xl">{t("instructor.sessionDetails")}</CardTitle>
                                <CardDescription className="text-sm sm:text-base">{t("instructor.basicInformation")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm sm:text-base">{t("instructor.sessionTitle")}</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder={t("instructor.sessionTitlePlaceholder")}
                                            className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adventure" className="text-sm sm:text-base">{t("instructor.adventureType")}</Label>
                                        <Select
                                            value={formData.adventure}
                                            onValueChange={(value) => handleSelectChange("adventure", value)}
                                        >
                                            <SelectTrigger id="adventure" className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                                                <SelectValue placeholder={t("instructor.selectAdventureType")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {adventureTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-sm sm:text-base">{t("instructor.location")}</Label>
                                        <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                                            <SelectTrigger id="location" className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                                                <SelectValue placeholder={t("instructor.selectLocation")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem key={location} value={location}>
                                                        {location}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration" className="text-sm sm:text-base">{t("instructor.duration")}</Label>
                                        <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                                            <SelectTrigger id="duration" className="h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                                                <SelectValue placeholder={t("instructor.selectDuration")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2 hours">2 {t("instructor.hours")}</SelectItem>
                                                <SelectItem value="3 hours">3 {t("instructor.hours")}</SelectItem>
                                                <SelectItem value="4 hours">4 {t("instructor.hours")}</SelectItem>
                                                <SelectItem value="5 hours">5 {t("instructor.hours")}</SelectItem>
                                                <SelectItem value="6 hours">6 {t("instructor.hours")}</SelectItem>
                                                <SelectItem value="8 hours">8 {t("instructor.hours")}</SelectItem>
                                                <SelectItem value="Full day">Full day</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-sm sm:text-base">{t("instructor.price")}</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2 sm:top-2.5 lg:top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="pl-9 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="capacity" className="text-sm sm:text-base">{t("instructor.capacity")}</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-2 sm:top-2.5 lg:top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="capacity"
                                                name="capacity"
                                                type="number"
                                                value={formData.capacity}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="pl-9 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm sm:text-base">{t("instructor.description")}</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder={t("instructor.descriptionPlaceholder")}
                                        rows={4}
                                        className="text-sm sm:text-base resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-lg sm:text-xl">{t("instructor.sessionDates")}</CardTitle>
                                <CardDescription className="text-sm sm:text-base">{t("instructor.scheduleDates")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                                {formData.dates.map((date, index) => (
                                    <div key={index} className="p-3 sm:p-4 lg:p-5 border rounded-lg bg-card">
                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <h4 className="font-medium text-sm sm:text-base">
                                                {t("instructor.date")} #{index + 1}
                                            </h4>
                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeDate(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-9"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`date-${index}`} className="text-sm sm:text-base">{t("instructor.date")}</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-2 sm:top-2.5 lg:top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`date-${index}`}
                                                        type="date"
                                                        value={date.date}
                                                        onChange={(e) => handleDateChange(index, "date", e.target.value)}
                                                        className="pl-9 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`time-${index}`} className="text-sm sm:text-base">{t("instructor.time")}</Label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-2 sm:top-2.5 lg:top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`time-${index}`}
                                                        type="time"
                                                        value={date.time}
                                                        onChange={(e) => handleDateChange(index, "time", e.target.value)}
                                                        className="pl-9 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`capacity-${index}`} className="text-sm sm:text-base">{t("instructor.capacity")}</Label>
                                                <div className="relative">
                                                    <Users className="absolute left-3 top-2 sm:top-2.5 lg:top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`capacity-${index}`}
                                                        type="number"
                                                        value={date.capacity}
                                                        onChange={(e) => handleDateChange(index, "capacity", e.target.value)}
                                                        placeholder="0"
                                                        className="pl-9 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addDate}
                                    className="w-full flex items-center justify-center gap-2 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                >
                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">{t("instructor.addAnotherDate")}</span>
                                    <span className="sm:hidden">Add Date</span>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-lg sm:text-xl">{t("instructor.reviewAndSubmit")}</CardTitle>
                                <CardDescription className="text-sm sm:text-base">{t("instructor.reviewBeforeSubmitting")}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-start p-3 sm:p-4 bg-blue-50 rounded-lg">
                                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm lg:text-base text-blue-700 leading-relaxed">{t("instructor.reviewNote")}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2 lg:space-x-3 p-4 sm:p-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/instructor/sessions")}
                                    className="w-full sm:w-auto h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                                >
                                    {t("instructor.cancel")}
                                </Button>
                                <Button type="submit" className="w-full sm:w-auto h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                                    {t("instructor.createSession")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </form>
            </div>
        </InstructorLayout>
    )
}

export default SessionForm
