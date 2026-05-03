const PAYHERO_API_URL = "https://backend.payhero.co.ke/api/v2";
const PAYHERO_AUTH_TOKEN = "Basic TUxvaklHWUJGSzJlYlJ5NTVGYVU6SjdETUgyZldsWWRhSnVSZUFlWVBMMUZGTzhNQkVHRjQzeW1oTG9rVg==";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Support both GET (query params) and POST (body)
  let checkoutId;
  if (req.method === "GET") {
    checkoutId = req.query?.checkoutId ?? req.query?.reference;
  } else if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    checkoutId = body?.checkoutId ?? body?.checkout_request_id ?? body?.reference;
  } else {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!checkoutId) {
    res.status(400).json({ message: "Missing checkoutId or reference" });
    return;
  }

  try {
    // Query PayHero transaction status API using the reference
    const statusUrl = `${PAYHERO_API_URL}/transaction-status?reference=${encodeURIComponent(checkoutId)}`;
    console.log("Checking PayHero status:", statusUrl);

    const payheroRes = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Authorization": PAYHERO_AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const data = await payheroRes.json().catch(() => null);
    console.log("PayHero status response:", JSON.stringify(data));

    if (!payheroRes.ok || !data) {
      // If API call fails, return pending so frontend keeps polling
      res.status(200).json({
        status: "pending",
        message: "Could not verify payment status",
        reference: checkoutId,
      });
      return;
    }

    // Parse PayHero response - check various possible response structures
    const items = data?.data ?? data?.items ?? data?.results ?? (Array.isArray(data) ? data : null);
    const transaction = Array.isArray(items) && items.length > 0 ? items[0] : data?.transaction ?? data;

    const resultCode = transaction?.ResultCode ?? transaction?.result_code;
    const resultDesc = transaction?.ResultDesc ?? transaction?.result_desc ?? transaction?.message ?? "";
    const mpesaReceipt = transaction?.MpesaReceiptNumber ?? transaction?.mpesa_receipt ?? transaction?.ReceiptNumber;
    const txStatus = String(transaction?.status ?? transaction?.Status ?? "").toLowerCase();

    let status = "pending";
    if (resultCode === 0 || txStatus === "completed" || txStatus === "success" || mpesaReceipt) {
      status = "completed";
    } else if (resultCode !== undefined && resultCode !== 0) {
      status = "failed";
    } else if (txStatus === "failed" || txStatus === "cancelled") {
      status = "failed";
    }

    res.status(200).json({
      status,
      checkoutId,
      mpesaReceipt: mpesaReceipt || null,
      message: resultDesc || (status === "completed" ? "Payment confirmed" : "Payment pending"),
      reference: checkoutId,
      raw: transaction,
    });
  } catch (error) {
    console.error("Status check error:", error);
    // Return pending instead of error so frontend keeps polling
    res.status(200).json({
      status: "pending",
      message: "Status check temporarily unavailable",
      reference: checkoutId,
    });
  }
}
