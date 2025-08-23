import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields: name, email, and message are required." },
        { status: 400 }
      );
    }

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server email configuration is missing" },
        { status: 500 }
      );
    }

    if (!process.env.CONTACT_ADMIN_EMAIL) {
      console.error("Missing CONTACT_ADMIN_EMAIL environment variable");
      return NextResponse.json(
        { error: "Server email configuration is missing" },
        { status: 500 }
      );
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Kursor Contact <onboarding@resend.dev>', // Default Resend sender
      to: [process.env.CONTACT_ADMIN_EMAIL],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #6366f1;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This email was sent from the Kursor contact form.
          </p>
        </div>
      `,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        {
          error: "Failed to send message",
          details: process.env.NODE_ENV !== "production" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ success: true, messageId: data?.id });

  } catch (error) {
    console.error("/api/contact error:", error);
    return NextResponse.json(
      {
        error: "Failed to send message",
        details: process.env.NODE_ENV !== "production" ? 
          (error as any)?.message ?? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
