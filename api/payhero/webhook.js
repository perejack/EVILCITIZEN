const PAYHERO_AUTH_TOKEN = "Basic TUxvaklHWUJGSzJlYlJ5NTVGYVU6SjdETUgyZldsWWRhSnVSZUFlWVBMMUZGTzhNQkVHRjQzeW1oTG9rVg==";

// In-memory store for payment statuses (resets on cold start)
// For production, use a database or Vercel KV
const paymentStore = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // GET: Frontend polls to check payment status
  if (req.method === "GET") {
    const reference = req.query?.reference;
    if (!reference) {
      res.status(400).json({ message: "Missing reference query param" });
      return;
    }
    const status = paymentStore[reference] || { status: "pending" };
    res.status(200).json(status);
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // POST: PayHero callback
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log("PayHero webhook received:", JSON.stringify(body, null, 2));

    // Verify the request is from PayHero (optional but recommended)
    const authHeader = req.headers["authorization"] || "";
    if (authHeader && authHeader !== PAYHERO_AUTH_TOKEN) {
      console.warn("Webhook auth mismatch — proceeding anyway for testing");
    }

    // Extract payment details from PayHero callback
    const checkoutId = body?.CheckoutRequestID || body?.checkout_request_id || body?.reference;
    const mpesaReceipt = body?.MpesaReceiptNumber || body?.mpesa_receipt || body?.ReceiptNumber;
    const amount = body?.Amount || body?.amount;
    const phone = body?.PhoneNumber || body?.phone_number;
    const status = body?.ResultCode === 0 || body?.status === "completed" || body?.status === "success"
      ? "completed"
      : body?.ResultCode !== undefined
        ? "failed"
        : body?.status || "pending";

    const result = {
      status,
      checkoutId,
      mpesaReceipt,
      amount,
      phone,
      raw: body,
      updatedAt: new Date().toISOString(),
    };

    // Store by checkout ID
    if (checkoutId) {
      paymentStore[checkoutId] = result;
    }

    // Also store by M-PESA receipt if available
    if (mpesaReceipt) {
      paymentStore[mpesaReceipt] = result;
    }

    console.log(`Payment ${checkoutId}: ${status}${mpesaReceipt ? ` (Receipt: ${mpesaReceipt})` : ""}`);

    res.status(200).json({ received: true, status });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
}
