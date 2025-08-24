import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitPayPalSuccess } from "../../Api/payoutApi";

const PayPalSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const payload = {
      merchantId: queryParams.get("merchantId"),
      merchantIdInPayPal: queryParams.get("merchantIdInPayPal"),
      permissionsGranted: queryParams.get("permissionsGranted"),
      productIntentId: queryParams.get("productIntentId"),
      consentStatus: queryParams.get("consentStatus"),
      isEmailConfirmed: queryParams.get("isEmailConfirmed"),
    };

    const token = localStorage.getItem("accessToken");

    submitPayPalSuccess(token, payload)
      .then(() => {
        console.log(" Payment details saved");
      })
      .catch((err) => {
        console.error("Failed to save payment details:", err.response?.data || err.message);
      });
  }, [navigate]);

  return (
    <div>
      <h2>PayPal Onboarding Complete</h2>
      <p>Your account has been successfully linked.</p>
    </div>
  );
};

export default PayPalSuccess;