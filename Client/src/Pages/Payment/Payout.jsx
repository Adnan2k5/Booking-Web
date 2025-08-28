import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Link as LinkIcon, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import InstructorLayout from "../Instructor/InstructorLayout";
import { 
  createBatchPayout 
} from "../../Api/payoutApi";
import axios from "axios";
import { staggerContainer, fadeIn } from "../../assets/Animations";
import { axiosClient } from "../../AxiosClient/axios.js";

export default function PayoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLinked, setIsLinked] = useState(null); // null = checking, true/false = status
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);

  const token = localStorage.getItem("accessToken");

useEffect(() => {
  if (!user?.user) {
    toast.error("Please login to access the payout page");
    navigate("/login");
    return;
  }

  const checkLinkStatus = async () => {
    try {
      console.log("🔑 Token from localStorage:", token);

      const res = await axiosClient.get('/api/payouts/status');

      console.log("PayPal status response:", res.data);
      setIsLinked(res.data.data?.isLinked ?? false);
    } catch (err) {
      console.error("Error fetching PayPal status:", err.response?.data || err.message);
      setIsLinked(false);
    }
  };

  const loadMockData = () => {
    // Mock data for demonstration
    setTotalEarnings(2450.75);
    setPendingPayouts(125.50);
    setPayoutHistory([
      { id: "P-001", amount: 450.00, date: "2025-01-15", status: "completed" },
      { id: "P-002", amount: 320.25, date: "2025-01-01", status: "completed" },
      { id: "P-003", amount: 125.50, date: "2025-01-25", status: "pending" },
    ]);
  };

  if (token) {
    checkLinkStatus();
    loadMockData();
  } else {
    console.warn("No token found in localStorage");
    setIsLinked(false);
  }

  // Listen for focus events to refresh status when user returns from PayPal
  const handleFocus = () => {
    if (token) {
      checkLinkStatus();
    }
  };

  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, [token, user, navigate]);

  const handleLinkAccount = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post('/api/payouts/connect');
      const redirectUrl = res.data?.data?.redirectUrl;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("No redirect URL received. Response:", res.data);
        toast.error("Failed to get redirect URL for PayPal onboarding");
      }
    } catch (err) {
      console.error("Failed to start PayPal onboarding:", err.response?.data || err.message);
      toast.error("Failed to start PayPal onboarding");
    } finally {
      setLoading(false);
    }
  };

  //  Trigger payout (for linked users)
  const handlePayout = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await createBatchPayout(
        {
          payouts: [
            { userId: user?.user?._id || "USER_ID_123", amount: 50, currency: "USD", note: "Monthly payout" },
          ],
          currency: "USD",
          note: "Batch Payout Example",
        },
        token
      );
      setMessage("Payout created successfully! Batch ID: " + res.batchId);
      toast.success("Payout created successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Failed to create payout");
      toast.error("Failed to create payout");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "default", icon: CheckCircle, text: "Completed" },
      pending: { variant: "secondary", icon: AlertCircle, text: "Pending" },
      failed: { variant: "destructive", icon: AlertCircle, text: "Failed" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

    // UI
  if (isLinked === null) {
    return (
      <InstructorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-muted-foreground">Checking PayPal account status...</p>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">
              {t("Payout Management") || "Payout Management"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {t("Manage your earnings and PayPal payouts") || "Manage your earnings and PayPal payouts"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeIn}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center text-green-500">
                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    12.5%
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">
                  Pending Payouts
                </CardTitle>
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  ${pendingPayouts.toFixed(2)}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-500">Processing</span>
                  <span>•</span>
                  <span>Next payout in 3 days</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">
                  PayPal Status
                </CardTitle>
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {isLinked ? "Connected" : "Not Linked"}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  {isLinked ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Ready for payouts
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Setup required
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Payout Section */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                PayPal Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isLinked ? (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                    <LinkIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Link Your PayPal Account</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Connect your PayPal account to receive payments. This is a secure process managed by PayPal.
                    </p>
                    <Button 
                      onClick={handleLinkAccount}
                      disabled={loading}
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {loading ? "Connecting..." : "Link PayPal Account"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">PayPal Account Connected</h3>
                      <p className="text-muted-foreground mb-6">
                        Your PayPal account is successfully linked and ready to receive payments.
                      </p>
                      <Button 
                        onClick={handlePayout}
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? "Processing..." : "Request Payout"}
                      </Button>
                    </div>
                  </div>
                  
                  {message && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800">{message}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payout History */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              {payoutHistory.length > 0 ? (
                <div className="space-y-4">
                  {payoutHistory.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Payout {payout.id}</p>
                          <p className="text-sm text-muted-foreground">{payout.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">${payout.amount.toFixed(2)}</p>
                        </div>
                        {getStatusBadge(payout.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payout history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </InstructorLayout>
  );
}
