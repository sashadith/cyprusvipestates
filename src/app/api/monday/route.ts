// app/api/monday/route.ts
import { getAutoReplyHtml } from "@/lib/emailTemplates";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = process.env.MONDAY_API_KEY!;
const BOARD_ID = 1761987486; // вернули рабочий id доски

// простой in-memory rate limit (под Vercel тоже работает на уровень инстанса)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  const filtered = timestamps.filter((t) => now - t < windowMs);
  filtered.push(now);

  rateLimitMap.set(ip, filtered);
  return filtered.length > limit;
}

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
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      message,
      preferredContact,
      currentPage,
      company,
      formStartTime,
      lang,
    } = body;

    // ===============================
    // ✅ АНТИСПАМ ЗАЩИТА
    // ===============================

    // 1. Honeypot — если заполнено скрытое поле
    if (company) {
      return NextResponse.json({ error: "Bot detected" }, { status: 403 });
    }

    // 2. Слишком быстрая отправка (< 3 секунд)
    if (formStartTime && Date.now() - formStartTime < 3000) {
      return NextResponse.json(
        { error: "Too fast submission" },
        { status: 403 }
      );
    }

    // 3. Проверка заголовков
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    if (!userAgent || !referer) {
      return NextResponse.json(
        { error: "Suspicious request" },
        { status: 403 }
      );
    }

    // ===============================
    // ✅ БАЗОВАЯ ВАЛИДАЦИЯ
    // ===============================

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

    const mutationCreate = `
  mutation {
    create_item(
      board_id: ${BOARD_ID},
      item_name: "${String(name).replace(/"/g, '\\"')}",
      column_values: "${JSON.stringify(cols).replace(/"/g, '\\"')}",
      position_relative_method: after_at
    ) {
      id
    }
  }
`;

    const mondayRes = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY,
      },
      body: JSON.stringify({ query: mutationCreate }),
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
        html: `
          <h2>New Lead — Cyprus VIP Estates</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Preferred contact:</b> ${preferredContact}</p>
          ${message ? `<p><b>Message:</b><br/>${message}</p>` : ""}
          <hr/>
          <p><b>Page:</b> ${currentPage}</p>
          <p><b>Date (Cyprus):</b> ${currentDate} ${cyprusTime}</p>
        `,
        replyTo: email || undefined,
      });
      // === AUTO-REPLY TO CLIENT ===
      await transporter.sendMail({
        from: `"Cyprus VIP Estates" <${process.env.EMAIL_USER!}>`,
        to: email, // ⬅️ ВАЖНО: письмо уходит ЛИДУ
        subject:
          lang === "ru"
            ? "Мы получили вашу заявку"
            : lang === "de"
              ? "Wir haben Ihre Anfrage erhalten"
              : lang === "pl"
                ? "Otrzymaliśmy Twoje zgłoszenie"
                : "We received your request",

        html: getAutoReplyHtml(name),
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
