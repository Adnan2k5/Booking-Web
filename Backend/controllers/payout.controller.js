// controllers/payout.controller.js
import { User } from "../models/user.model.js";
import { Payout } from "../models/payout.model.js";
import axios from "axios";
import { getAccessToken } from "../utils/paypal.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from "uuid";

/* ----------------------- PAYPAL ACCOUNT LINKING ----------------------- */

export const linkPayPalAccount = async (req, res) => {
  const accessToken = await getAccessToken();

  try {
    const trackingId = `track-${Date.now()}`;

    const response = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v2/customer/partner-referrals`,
      {
        tracking_id: trackingId,
        partner_config_override: {
          return_url: "http://localhost:5173/paypal/success",
          return_url_description: "Return after PayPal onboarding",
        },
        operations: [
          {
            operation: "API_INTEGRATION",
            api_integration_preference: {
              rest_api_integration: {
                integration_method: "PAYPAL",
                integration_type: "THIRD_PARTY",
                third_party_details: {
                  features: [
                                    "PAYMENT",
                                    "REFUND"
                                ]
                },
              },
            },
          },
        ],
        products: [
                    "EXPRESS_CHECKOUT"
                ],
        legal_consents: [
          {
            type: "SHARE_DATA_CONSENT",
            granted: true,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "PayPal-Partner-Attribution-Id":
            process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
        },
      }
    );

    // Get the redirect URL from response
    const redirectUrl = response.data.links.find(
      (link) => link.rel === "action_url"
    )?.href;

    if (!redirectUrl) {
      throw new ApiError(500, "No redirect URL returned from PayPal");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { redirectUrl }, "Success"));
  } catch (error) {
    console.error("PayPal API Error:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to create partner referral", error);
  }
};


// 2. Step: Callback after user approves
export const paypalCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state;

    const tokenRes = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.BASE_URL}/api/payouts/callback`,
      }),
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get(
      `${process.env.PAYPAL_API_BASE}/v1/identity/oauth2/userinfo?schema=paypalv1.1`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { emails } = userRes.data;

    const {
      merchantIdInPayPal,
      isEmailConfirmed,
      accountStatus,
      permissionsGranted,
      consentStatus,
      riskStatus,
    } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.paypalPayerId = merchantIdInPayPal;
    user.paypalEmail = emails?.[0]?.value || null;
    user.paypalLinkedAt = new Date();
    user.paypalEmailConfirmed = isEmailConfirmed === "true";
    user.paypalAccountStatus = accountStatus;
    user.paypalPermissionsGranted = permissionsGranted === "true";
    user.paypalConsentStatus = consentStatus === "true";
    user.paypalRiskStatus = riskStatus;

    await user.save();

    return res.redirect("/dashboard?paypalLinked=1");
  } catch (err) {
    console.error("PayPal Callback Error:", err.response?.data || err.message);
    return res.status(500).send("PayPal connection failed");
  }
};

export const getSuccessPage = async (req, res) => {
  const {
    merchantId,
    merchantIdInPayPal,
    permissionsGranted,
    productIntentId,
    consentStatus,
    isEmailConfirmed
  } = req.body; // assuming frontend sends a POST request

  // Validate required fields
  if (
    !merchantId ||
    !merchantIdInPayPal ||
    !permissionsGranted ||
    !productIntentId ||
    !consentStatus ||
    !isEmailConfirmed
  ) {
    throw new ApiError(400, "Missing required fields in PayPal onboarding data");
  }

  const user = req.user; // assuming verifyJWT middleware sets req.user

  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  // Prevent duplicate entries
  if (user.paymentDetails) {
    throw new ApiError(400, "Payment details already exist for this user");
  }

  // Save payment details
  const paymentDetail = await User.create({
    merchantId,
    merchantIdInPayPal,
    permissionsGranted,
    productIntentId,
    consentStatus,
    isEmailConfirmed
  });

  // Link payment details to user
  user.paymentDetails = paymentDetail._id;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, paymentDetail, "Payment details saved successfully")
  );
};
/* -------------------------- PAYOUT CREATION --------------------------- */

export const createBatchPayout = async (req, res) => {
  try {
    const { payouts, currency, note } = req.body;

    const accessToken = await pp.getAppAccessToken({
      apiBase: process.env.PAYPAL_API_BASE,
      clientId: process.env.PAYPAL_CLIENT_ID,
      secret: process.env.PAYPAL_SECRET,
    });

    const senderBatchId = uuidv4();

    const items = await Promise.all(
      payouts.map(async (p) => {
        const user = await User.findById(p.userId);
        if (!user || !user.paypalEmail) {
          throw new Error(`User ${p.userId} has no PayPal linked`);
        }
        return {
          recipient_type: "EMAIL",
          amount: { value: p.amount.toFixed(2), currency },
          receiver: user.paypalEmail,
          note: note || "Batch payout from platform",
          sender_item_id: uuidv4(),
        };
      })
    );

    const payoutRes = await pp.createPayout({
      apiBase: process.env.PAYPAL_API_BASE,
      accessToken,
      senderBatchId,
      items,
    });

    const savedPayouts = await Promise.all(
      items.map((item, idx) =>
        Payout.create({
          user: payouts[idx].userId,
          amount: payouts[idx].amount,
          currency,
          note,
          batchId: senderBatchId,
          itemId: item.sender_item_id,
          status: "SENT",
          rawResponse: payoutRes,
        })
      )
    );

    return res.json({
      success: true,
      batchId: senderBatchId,
      payouts: savedPayouts,
    });
  } catch (err) {
    console.error("Batch Payout Error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/* -------------------------- PAYOUT QUERIES ---------------------------- */

export const getBatchPayouts = async (req, res) => {
  try {
    const { batchId } = req.params;
    const payouts = await Payout.find({ batchId }).populate(
      "user",
      "email name paypalEmail"
    );
    return res.json({ success: true, payouts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getUserPayouts = async (req, res) => {
  try {
    const { userId } = req.params;
    const payouts = await Payout.find({ user: userId }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, payouts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
