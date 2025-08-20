// controllers/payout.controller.js
import { User } from "../models/user.model.js";
import { Payout } from "../models/payout.model.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

/* ----------------------- PAYPAL ACCOUNT LINKING ----------------------- */

export const linkPayPalAccount = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const redirectUri = `${process.env.BASE_URL}/api/payouts/callback`;
    const clientId = process.env.PAYPAL_CLIENT_ID;

    // 🔍 Log the redirect URI to verify it's correct
    console.log("🔁 redirectUri:", redirectUri);

    const scope = encodeURIComponent(
  "openid profile email https://uri.paypal.com/services/paypalattributes"
);

const url = `https://www.sandbox.paypal.com/signin/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&state=${userId}`;

    // 🔗 Log the full PayPal redirect URL
    console.log("🔗 Final PayPal Redirect URL:", url);

    return res.redirect(url);
  } catch (err) {
    console.error("PayPal Connect Error:", err.message);
    return res.status(500).send("Could not start PayPal linking");
  }
};

export const paypalCallback = async (req, res) => {
  try {
    const { code, state } = req.query; // PayPal sends back "state"
    const userId = state; // this is the user we want to link

    // exchange code for access token
    const tokenRes = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
      }),
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        },
      }
    );

    const { access_token } = tokenRes.data;

    // fetch user info from PayPal
    const userRes = await axios.get(
      `${process.env.PAYPAL_API_BASE}/v1/identity/oauth2/userinfo?schema=paypalv1.1`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { user_id, emails } = userRes.data;

    // update that specific user
    await User.findByIdAndUpdate(userId, {
      paypalPayerId: user_id,
      paypalEmail: emails[0].value,
      paypalLinkedAt: new Date(),
    });

    return res.redirect("/dashboard?paypalLinked=1");
  } catch (err) {
    console.error("PayPal Callback Error:", err.response?.data || err.message);
    return res.status(500).send("PayPal connection failed");
  }
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
