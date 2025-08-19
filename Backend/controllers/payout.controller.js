import { User } from "../models/user.model.js";
import { Payout } from "../models/payout.model.js";
import pp from "../services/paypal.js"; // your PayPal util
import { v4 as uuidv4 } from "uuid";

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

    return res.json({ success: true, batchId: senderBatchId, payouts: savedPayouts });
  } catch (err) {
    console.error("Batch Payout Error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getBatchPayouts = async (req, res) => {
  try {
    const { batchId } = req.params;
    const payouts = await Payout.find({ batchId }).populate("user", "email name paypalEmail");
    return res.json({ success: true, payouts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getUserPayouts = async (req, res) => {
  try {
    const { userId } = req.params;
    const payouts = await Payout.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ success: true, payouts });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
