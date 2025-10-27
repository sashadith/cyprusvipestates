// app/api/monday/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0MDQyNzMyNiwiYWFpIjoxMSwidWlkIjo2MjE1MTQ3MSwiaWFkIjoiMjAyNC0xMS0yM1QxODo1NTo0Ny40NThaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM5NDMwODYsInJnbiI6ImV1YzEifQ.t5IONmg4UE6uHeN7qmkBI1cEGE4YKcYkDgutGA6q_Ic";
const BOARD_ID = 1761987486; // вернули рабочий id доски

// SMTP (Hostinger через env — можно и хардкод, но env безопаснее)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: String(process.env.EMAIL_SECURE || "true") === "true",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, preferredContact, currentPage } = body;

    // базовая валидация
    if (!name || !phone || !email || !preferredContact) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const cyprusTime = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Nicosia",
    }).format(new Date());

    // колонка id — как в твоём ИЗНАЧАЛЬНОМ рабочем коде
    const cols: Record<string, string> = {
      text_mkkwm0b4: phone,
      text_mkkwekh3: email,
      text_mkkwk9kt: currentPage,
      text_mkq6spmc: message || "",
      date_mkt0wz3n: currentDate,
      text_mkx4pb8s: preferredContact,
      text_mkt0gyvy: cyprusTime,
    };

    const mutation = `
      mutation {
        create_item(
          board_id: ${BOARD_ID},
          item_name: "${String(name).replace(/"/g, '\\"')}",
          column_values: "${JSON.stringify(cols).replace(/"/g, '\\"')}"
        ) { id }
      }
    `;

    const mondayRes = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const data = await mondayRes.json();
    // для отладки: смотри логи на сервере Vercel/Host
    console.log("Monday response:", JSON.stringify(data));

    if (data?.errors?.length || !data?.data?.create_item?.id) {
      // Явно прокинем ошибку, чтобы увидеть это на фронте во время теста
      return NextResponse.json(
        {
          error: "Monday create_item failed",
          details: data?.errors || data,
        },
        { status: 400 }
      );
    }

    // === только если item создан — отправляем письмо ===
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER!,
        subject: "New Lead — Cyprus VIP Estates",
        text: "New lead from Cyprus VIP Estates. Check your board in Monday.",
        html: "<p>New lead from <b>Cyprus VIP Estates</b>. Check your board in Monday.</p>",
        replyTo: email || undefined,
      });
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
      // Лид есть в Monday; письмо не критично
      return NextResponse.json(
        { message: "Lead sent to Monday; email notification failed" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Lead sent to Monday; email notification delivered" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Internal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
