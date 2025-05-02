"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Separator } from "../../components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { AlertCircle, Bell, Globe, Lock, Moon, Shield, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import InstructorLayout from "./InstructorLayout"

const InstructorSettings = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)

    const [settings, setSettings] = useState({
        email: "alex.johnson@example.com",
        newEmail: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        language: "en",
        darkMode: false,
        emailNotifications: {
            bookings: true,
            reviews: true,
            messages: true,
            promotions: false,
        },
        pushNotifications: {
            bookings: true,
            reviews: true,
            messages: true,
            promotions: false,
        },
        twoFactorAuth: false,
    })

    const handleSettingChange = (section, field, value) => {
        if (section) {
            setSettings((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }))
        } else {
            setSettings((prev) => ({
                ...prev,
                [field]: value,
            }))
        }
    }

    const handleEmailUpdate = (e) => {
        e.preventDefault()
        if (!settings.newEmail) {
            toast.error(t("instructor.pleaseEnterNewEmail"))
            return
        }

        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setSettings((prev) => ({
                ...prev,
                email: settings.newEmail,
                newEmail: "",
            }))
            setLoading(false)
            toast.success(t("instructor.emailUpdatedSuccessfully"))
        }, 1000)
    }

    const handlePasswordUpdate = (e) => {
        e.preventDefault()

        if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
            toast.error(t("instructor.pleaseCompleteAllFields"))
            return
        }

        if (settings.newPassword !== settings.confirmPassword) {
            toast.error(t("instructor.passwordsDoNotMatch"))
            return
        }

        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setSettings((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }))
            setLoading(false)
            toast.success(t("instructor.passwordUpdatedSuccessfully"))
        }, 1000)
    }

    const toggleTwoFactorAuth = () => {
        // In a real app, this would open a 2FA setup flow
        setSettings((prev) => ({
            ...prev,
            twoFactorAuth: !prev.twoFactorAuth,
        }))

        toast.success(settings.twoFactorAuth ? t("instructor.twoFactorAuthDisabled") : t("instructor.twoFactorAuthEnabled"))
    }

    return (
        <InstructorLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t("instructor.settings")}</h2>
                    <p className="text-muted-foreground">{t("instructor.manageYourAccountSettings")}</p>
                </div>

                <div className="gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <section id="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("instructor.accountSettings")}</CardTitle>
                                    <CardDescription>{t("instructor.manageYourAccountInformation")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium">{t("instructor.emailAddress")}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {t("instructor.currentEmail")}: {settings.email}
                                        </p>

                                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="newEmail">{t("instructor.newEmail")}</Label>
                                                <Input
                                                    id="newEmail"
                                                    type="email"
                                                    value={settings.newEmail}
                                                    onChange={(e) => handleSettingChange(null, "newEmail", e.target.value)}
                                                    placeholder="new.email@example.com"
                                                />
                                            </div>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? t("instructor.updating") : t("instructor.updateEmail")}
                                            </Button>
                                        </form>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-lg font-medium">{t("instructor.language")}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{t("instructor.selectYourPreferredLanguage")}</p>

                                        <div className="flex items-center space-x-4">
                                            <Globe className="h-5 w-5 text-muted-foreground" />
                                            <Select
                                                value={settings.language}
                                                onValueChange={(value) => handleSettingChange(null, "language", value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder={t("instructor.selectLanguage")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Español</SelectItem>
                                                    <SelectItem value="fr">Français</SelectItem>
                                                    <SelectItem value="de">Deutsch</SelectItem>
                                                    <SelectItem value="it">Italiano</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        <section id="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("instructor.securitySettings")}</CardTitle>
                                    <CardDescription>{t("instructor.manageYourSecurityPreferences")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium">{t("instructor.changePassword")}</h3>
                                        <p className="text-sm text-muted-foreground mb-4">{t("instructor.updateYourPassword")}</p>

                                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="currentPassword">{t("instructor.currentPassword")}</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={settings.currentPassword}
                                                        onChange={(e) => handleSettingChange(null, "currentPassword", e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="newPassword">{t("instructor.newPassword")}</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="newPassword"
                                                        type="password"
                                                        value={settings.newPassword}
                                                        onChange={(e) => handleSettingChange(null, "newPassword", e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="confirmPassword">{t("instructor.confirmPassword")}</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        value={settings.confirmPassword}
                                                        onChange={(e) => handleSettingChange(null, "confirmPassword", e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? t("instructor.updating") : t("instructor.updatePassword")}
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    )
}

export default InstructorSettings
