// app/api/monday/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0MDQyNzMyNiwiYWFpIjoxMSwidWlkIjo2MjE1MTQ3MSwiaWFkIjoiMjAyNC0xMS0yM1QxODo1NTo0Ny40NThaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM5NDMwODYsInJnbiI6ImV1YzEifQ.t5IONmg4UE6uHeN7qmkBI1cEGE4YKcYkDgutGA6q_Ic";
const BOARD_ID = "2048161725";

// Настрой почты (Hostinger)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: String(process.env.EMAIL_SECURE || "true") === "true", // true для 465
  auth: {
    user: process.env.EMAIL_USER!, // напр. contact@yourdomain.com
    pass: process.env.EMAIL_PASSWORD!, // SMTP / app password
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, surname, phone, email, message, country, currentPage } = body;

    const currentDate = new Date().toISOString().split("T")[0];

    const cols: Record<string, string> = {
      text_mksse3wx: surname,
      text_mkkwm0b4: phone,
      text_mkkwekh3: email,
      text_mkkwk9kt: currentPage,
      text_mkq6spmc: message,
      text_mkssckrt: country,
      date4: currentDate,
    };
    if (message) cols.text_message = message;

    const query = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${String(name).replace(/"/g, '\\"')}",
          column_values: "${JSON.stringify(cols).replace(/"/g, '\\"')}"
        ) { id }
      }
    `;

    const response = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY, // оставляем в коде, как просил
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Errors from monday.com API:", data.errors);
      return NextResponse.json(
        { error: "Error while creating item in monday.com" },
        { status: 400 }
      );
    }

    // ==== EMAIL УВЕДОМЛЕНИЕ ====
    // Короткое сообщение по твоему тексту
    const subject = "New lead — Cyprus VIP Estates";
    const text =
      "New lead from Cyprus VIP Estates. check your board in Monday.";
    const html = `<p>New lead from <b>Cyprus VIP Estates</b>. check your board in Monday.</p>`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to: process.env.EMAIL_USER!, // получатель(и)
        subject,
        text,
        html,
        replyTo: email || undefined, // удобно отвечать сразу лидy, если нужно
      });
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
      // не валим основной поток — лид уже создан в Monday
      return NextResponse.json(
        { message: "Lead sent to Monday; email notification failed" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Lead sent to Monday; email notification delivered" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
