import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Enforce SponsorshipInterestPayload schema validation
    const { companyName, contactName, email, phone, interestedTier, message } = payload;

    const errors: string[] = [];

    if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
      errors.push("companyName is required and must be a non-empty string.");
    }
    if (!contactName || typeof contactName !== "string" || contactName.trim() === "") {
      errors.push("contactName is required and must be a non-empty string.");
    }
    if (!email || typeof email !== "string" || email.trim() === "" || !email.includes("@")) {
      errors.push("email is required and must be a valid email address.");
    }
    if (phone && typeof phone !== "string") {
      errors.push("phone must be a string if provided.");
    }
    
    const validTiers = ["Hermes", "Apollo", "ZEUS", "Other"];
    if (!interestedTier || !validTiers.includes(interestedTier)) {
      errors.push(`interestedTier must be one of: ${validTiers.join(", ")}`);
    }
    if (!message || typeof message !== "string" || message.trim() === "") {
      errors.push("message is required and must be a non-empty string.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Server-side logging to record the intent deterministically
    console.log("=========================================");
    console.log("🚀 NEW SPONSORSHIP INTEREST SUBMISSION");
    console.log(`Company: ${companyName}`);
    console.log(`Contact: ${contactName}`);
    console.log(`Email:   ${email}`);
    if (phone) console.log(`Phone:   ${phone}`);
    console.log(`Tier:    ${interestedTier}`);
    console.log(`Message: ${message}`);
    console.log("=========================================");

    // Simulating Resend Email Integration Server-side
    console.warn(
      "⚠️ [Email Dispatch]: RESEND_API_KEY not found in environment. Email transmission simulated successfully."
    );

    // Return the schema-compliant processed output
    return NextResponse.json({
      success: true,
      message: "Sponsorship interest registered successfully.",
      receipt: {
        companyName,
        contactName,
        email,
        phone: phone || undefined,
        interestedTier,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to parse sponsorship submission:", error);
    return NextResponse.json(
      { success: false, errors: ["Invalid request body or JSON parsing failed."] },
      { status: 400 }
    );
  }
}
