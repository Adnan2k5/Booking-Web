import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Globe, Lock } from 'lucide-react'
import InstructorLayout from "./InstructorLayout"
import { UpdateEmail, UpdatePassword, VerifyNewEmail, VerifyUser } from "../../Auth/UserAuth"
import { useAuth } from "../AuthProvider"
import { Modal } from "antd"
import { InputOTPSlot, InputOTP, InputOTPGroup } from "../../components/ui/input-otp"
import { updateLanguageHeaders } from "../../Api/language.api.js"

const InstructorSettings = () => {
    const { t, i18n } = useTranslation()
    const [loading, setLoading] = useState(false)
    const { user } = useAuth();
    const [newEmail, setNewEmail] = useState("");
    const [openOtp, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const [settings, setSettings] = useState({
        email: user?.user?.email || "",
        newEmail: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        language: i18n.language || "en",
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

            // Handle language change specifically
            if (field === "language") {
                i18n.changeLanguage(value)
                updateLanguageHeaders(value)
            }
        }
    }

    const handleEmailUpdate = async (e) => {
        e.preventDefault(); // Prevent form submission and page refresh
        if (!newEmail) {
            toast.error(t("instructor.pleaseEnterNewEmail"))
            return
        }
        setLoading(true)
        try {
            const res = await VerifyNewEmail(newEmail);
            if (res.status === 200) {
                setOtpSent(true);
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            toast.error("An error occurred while verifying email");
        } finally {
            setLoading(false);
        }
    }

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }
        setLoading(true);
        try {
            const data = { email: newEmail, otp: otp };
            const res = await UpdateEmail(data);
            console.log(res.statusCode);
            if (res.status) {
                toast("Email Verified Successfully");
                setOtpSent(false);
                setOtp("");
                setNewEmail("");
            } else if (res === 400) {
                toast("Invalid Otp");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("An error occurred while verifying OTP");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()

        if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
            toast.error(t("instructor.pleaseCompleteAllFields"))
            return
        }

        if (settings.newPassword !== settings.confirmPassword) {
            toast.error(t("instructor.passwordsDoNotMatch"))
            return
        }

        const res = await UpdatePassword({
            extpassword: settings.currentPassword,
            newpassword: settings.newPassword,
        })

        if (res.statusCode === 200) {
            toast.success(t("instructor.passwordUpdatedSuccessfully"))
        }
        else if (res.status === 400) {
            toast.error(t("instructor.currentPasswordIncorrect"))
        }
        else {
            toast.error(t("instructor.somethingWentWrong"))
        }
    }

    return (
        <InstructorLayout>
            <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{t("instructor.settings")}</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">{t("instructor.manageYourAccountSettings")}</p>
                </div>

                <div className="space-y-2 sm:space-y-6">
                    <section id="account">
                        <Card>
                            <CardHeader className="p-2 sm:p-6">
                                <CardTitle className="text-lg sm:text-xl">{t("instructor.accountSettings")}</CardTitle>
                                <CardDescription className="text-sm">{t("instructor.manageYourAccountInformation")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 sm:space-y-6 p-2 sm:p-6">
                                <div>
                                    <h3 className="text-base sm:text-lg font-medium">{t("instructor.emailAddress")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 break-all">
                                        {t("instructor.currentEmail")}: {settings.email}
                                    </p>

                                    <form onSubmit={handleEmailUpdate} className="space-y-3 sm:space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="newEmail" className="text-sm">{t("instructor.newEmail")}</Label>
                                            <Input
                                                id="newEmail"
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder="new.email@example.com"
                                                className="text-sm"
                                            />
                                        </div>
                                        <Button type="submit" disabled={loading} className="w-full sm:w-auto text-sm">
                                            {loading ? t("instructor.updating") : t("instructor.updateEmail")}
                                        </Button>
                                    </form>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-base sm:text-lg font-medium">{t("instructor.language")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{t("instructor.selectYourPreferredLanguage")}</p>

                                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                                        <Select
                                            value={i18n.language}
                                            onValueChange={(value) => handleSettingChange(null, "language", value)}
                                        >
                                            <SelectTrigger className="w-full sm:w-[180px]">
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
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-lg sm:text-xl">{t("instructor.securitySettings")}</CardTitle>
                                <CardDescription className="text-sm">{t("instructor.manageYourSecurityPreferences")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                                <div>
                                    <h3 className="text-base sm:text-lg font-medium">{t("instructor.changePassword")}</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{t("instructor.updateYourPassword")}</p>

                                    <form onSubmit={handlePasswordUpdate} className="space-y-3 sm:space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="currentPassword" className="text-sm">{t("instructor.currentPassword")}</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    value={settings.currentPassword}
                                                    onChange={(e) => handleSettingChange(null, "currentPassword", e.target.value)}
                                                    className="pl-9 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="newPassword" className="text-sm">{t("instructor.newPassword")}</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    value={settings.newPassword}
                                                    onChange={(e) => handleSettingChange(null, "newPassword", e.target.value)}
                                                    className="pl-9 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="confirmPassword" className="text-sm">{t("instructor.confirmPassword")}</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={settings.confirmPassword}
                                                    onChange={(e) => handleSettingChange(null, "confirmPassword", e.target.value)}
                                                    className="pl-9 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={loading} className="w-full sm:w-auto text-sm">
                                            {loading ? t("instructor.updating") : t("instructor.updatePassword")}
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
                <Modal open={openOtp} footer={null} onCancel={() => setOtpSent(false)}>
                    <div className="space-y-2 flex flex-col items-center gap-4">
                        <h1>
                            Enter One-Time Password sent on{" "}
                            <span className="text-blue-500">{newEmail}</span>
                        </h1>
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <button
                            onClick={verifyOtp}
                            className="bg-black text-white rounded-2xl py-2 w-full"
                        >
                            Verify OTP
                        </button>
                    </div>
                </Modal>
            </div>
        </InstructorLayout>
    )
}

export default InstructorSettings