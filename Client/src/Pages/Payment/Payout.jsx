import React, { useEffect, useState } from "react";
import { 
  getPayPalConnectUrl, 
  createBatchPayout 
} from "../../Api/payoutApi";
import axios from "axios";

export default function PayoutPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLinked, setIsLinked] = useState(null); // null = checking, true/false = status

  const token = localStorage.getItem("accessToken");

useEffect(() => {
  const checkLinkStatus = async () => {
    try {
      console.log("🔑 Token from localStorage:", token);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Response from /user/me:", res.data);
      setIsLinked(res.data.data?.paypalLinked ?? false);
    } catch (err) {
      console.error("❌ Error fetching user:", err.response?.data || err.message);
      setIsLinked(false);
    }
  };

  if (token) {
    checkLinkStatus();
  } else {
    console.warn("⚠️ No token found in localStorage");
    setIsLinked(false);
  }
}, [token]);

  const handleLinkAccount = () => {
    // ✅ Redirect directly to backend route
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/payouts/connect`;
  };


  // 3️⃣ Trigger payout (for linked users)
  const handlePayout = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await createBatchPayout(
        {
          payouts: [
            { userId: "USER_ID_123", amount: 50, currency: "USD", note: "Monthly payout" },
          ],
          currency: "USD",
          note: "Batch Payout Example",
        },
        token
      );
      setMessage("✅ Payout created successfully! Batch ID: " + res.batchId);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Failed to create payout");
    } finally {
      setLoading(false);
    }
  };

  // UI
  if (isLinked === null) {
    return <p className="text-center mt-20">Checking PayPal account status...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Payout Page</h1>

      {!isLinked ? (
        <>
          <p className="mb-4">You haven’t linked your PayPal account yet.</p>
          <button
            onClick={handleLinkAccount}
            className="px-6 py-3 bg-yellow-500 text-white rounded-xl shadow-md hover:bg-yellow-600"
          >
            Link PayPal Account
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">✅ Your PayPal account is linked.</p>
          <button
            onClick={handlePayout}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Send Payout"}
          </button>
        </>
      )}

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
