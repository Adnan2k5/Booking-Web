import { useState } from "react";
import { Modal } from "antd";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../components/ui/input-otp";
import { Button } from "../../../components/ui/button";

export const OTPVerificationModal = ({ isOpen, onClose, onVerify, email }) => {
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            return;
        }

        setIsVerifying(true);
        try {
            await onVerify(otp);
            setOtp("");
        } catch (error) {
            console.error("Verification failed:", error);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClose = () => {
        setOtp("");
        onClose();
    };

    return (
        <Modal open={isOpen} footer={null} onCancel={handleClose} centered>
            <div className="space-y-6 p-4">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-black">Verify Your Email</h2>
                    <p className="text-sm text-gray-600">
                        Enter the 6-digit code sent to {email}
                    </p>
                </div>

                <div className="flex justify-center">
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
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                </Button>
            </div>
        </Modal>
    );
};
