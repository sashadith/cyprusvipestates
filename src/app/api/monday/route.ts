// app/api/monday/route.ts
import { getAutoReplyEmail } from "@/lib/emailTemplates";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = process.env.MONDAY_API_KEY!;
const BOARD_ID = 1761987486; // вернули рабочий id доски

const ALLOWED_HOSTS = new Set([
  "cyprusvipestates.com",
  "www.cyprusvipestates.com",
]);

function safeUrl(raw: string) {
  try {
    const u = new URL(raw);
    return u;
  } catch {
    return null;
  }
}

function isAllowedHostFromUrl(raw: string) {
  const u = safeUrl(raw);
  if (!u) return false;
  return ALLOWED_HOSTS.has(u.hostname);
}

// простой in-memory rate limit (под Vercel тоже работает на уровень инстанса)
const rateLimitMap = new Map<string, number[]>();

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim(); // берём первый IP
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

const rateLimitEmailMap = new Map<string, number[]>();

function isRateLimitedKey(
  map: Map<string, number[]>,
  key: string,
  limit = 3,
  windowMs = 60_000
) {
  const now = Date.now();
  const timestamps = map.get(key) || [];
  const filtered = timestamps.filter((t) => now - t < windowMs);
  filtered.push(now);
  map.set(key, filtered);
  return filtered.length > limit;
}

function escapeHtml(input: unknown) {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

function blocked(reason: string, extra?: Record<string, any>) {
  const debug = process.env.NODE_ENV !== "production";
  return NextResponse.json(
    debug ? { ok: false, blocked: reason, ...extra } : { ok: false },
    { status: 200 } // ✅ ВСЕГДА 200, чтобы “не обучать” ботов статусами
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // const userAgentHeader = request.headers.get("user-agent") || "";
  // const userAgent = userAgentHeader || "ua";
  const ua = request.headers.get("user-agent") || "";
  const ipKey = ip === "unknown" ? `unknown:${ua || "ua"}` : ip;
  if (!ua) return blocked("ua");

  // Content-Type должен быть json (минимальная фильтрация мусора)
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return blocked("content_type");
  }

  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";

  // referer обязателен и должен быть твоим доменом
  if (!referer || !isAllowedHostFromUrl(referer)) {
    return blocked("bad_referer");
  }

  // origin (если есть) тоже должен быть твоим доменом
  if (origin && !isAllowedHostFromUrl(origin)) {
    return blocked("bad_origin");
  }

  if (isRateLimited(ipKey)) {
    return blocked("rate_limit");
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
      fax,
      company,
      formStartTime,
      lang,
    } = body;

    const page = String(currentPage ?? "").trim();
    if (!page) return blocked("missing_page");

    const pageUrl = safeUrl(page);
    if (!pageUrl) return blocked("bad_page_url");
    if (!ALLOWED_HOSTS.has(pageUrl.hostname)) return blocked("page_host");

    // referer.host должен совпадать с currentPage.host
    const refUrl = safeUrl(referer);
    if (!refUrl) return blocked("bad_referer_url");
    if (refUrl.hostname !== pageUrl.hostname) return blocked("page_mismatch");

    // ===============================
    // ✅ АНТИСПАМ ЗАЩИТА
    // ===============================

    // 1. Honeypot — если заполнено скрытое поле
    const honeypot = String(fax ?? company ?? "").trim();
    if (honeypot.length > 0) return blocked("honeypot");

    // 2. Слишком быстрая отправка (< 1,5 секунд)
    const startedRaw = Number(formStartTime);
    const elapsed = Date.now() - startedRaw;

    // Допускаем минимальное время даже для автозаполнения
    if (
      !Number.isFinite(startedRaw) ||
      startedRaw <= 0 ||
      elapsed < 1500 ||
      elapsed > 2 * 60 * 60 * 1000
    ) {
      console.log("Blocked by timing anti-spam", { startedRaw, elapsed });
      return blocked("timing", { startedRaw, elapsed });
    }

    // ===============================
    // ✅ БАЗОВАЯ ВАЛИДАЦИЯ
    // ===============================

    // базовая валидация
    const nameNorm = String(name ?? "").trim();
    const emailNorm = String(email ?? "")
      .trim()
      .toLowerCase();
    const phoneNorm = String(phone ?? "").trim();
    const preferredNorm = String(preferredContact ?? "")
      .trim()
      .toLowerCase();

    // preferredContact только из списка
    if (!["phone", "whatsapp", "email"].includes(preferredNorm)) {
      return blocked("preferredContact");
    }

    const messageNorm = String(message ?? "").trim();
    const messageHtml = escapeHtml(messageNorm).replace(/\n/g, "<br/>");

    if (!nameNorm || !phoneNorm || !emailNorm || !preferredNorm) {
      return blocked("missing_fields");
    }

    // email (простая, но рабочая)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return blocked("email");
    }

    // rate limit по email — только если email валидный
    if (isRateLimitedKey(rateLimitEmailMap, emailNorm, 3, 60_000)) {
      return blocked("rate_limit_email");
    }

    // имя: длина + защита от "токенов"
    if (nameNorm.length < 2 || nameNorm.length > 60) {
      return blocked("name");
    }
    const compactName = nameNorm.replace(/\s+/g, "");
    if (compactName.length >= 22 && /^[a-z0-9]+$/i.test(compactName)) {
      return blocked("name_token");
    }
    if (/[A-Z].*[A-Z].*[A-Z].*[A-Z]/.test(nameNorm) && !/\s/.test(nameNorm)) {
      return blocked("name_caps");
    }

    // телефон: очень грубо, но эффективно против мусора
    if (phoneNorm.length < 7 || phoneNorm.length > 25) {
      return blocked("phone");
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
      text_mkkwm0b4: phoneNorm,
      text_mkkwekh3: emailNorm,
      text_mkkwk9kt: String(currentPage ?? ""),
      text_mkq6spmc: messageNorm,
      date_mkt0wz3n: currentDate,
      text_mkx4pb8s: preferredNorm,
      text_mkt0gyvy: cyprusTime,
    };

    const mutationCreate = `
      mutation {
        create_item(
          board_id: ${BOARD_ID},
          item_name: "${String(nameNorm).replace(/"/g, '\\"')}",
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
        to: process.env.EMAIL_TO || "office@cyprusvipestates.com",
        subject: "New Lead — Cyprus VIP Estates",
        text: "New lead from Cyprus VIP Estates. Check your board in Monday.",
        html: `
          <h2>New Lead — Cyprus VIP Estates</h2>
          <p><b>Name:</b> ${nameNorm}</p>
          <p><b>Phone:</b> ${phoneNorm}</p>
          <p><b>Email:</b> ${emailNorm}</p>
          <p><b>Preferred contact:</b> ${preferredNorm}</p>
          ${messageNorm ? `<p><b>Message:</b><br/>${messageHtml}</p>` : ""}
          <hr/>
          <p><b>Page:</b> ${currentPage}</p>
        `,
        replyTo: emailNorm || undefined,
      });
    } catch (mailErr) {
      console.error("Email send error (internal notification):", mailErr);
    }

    // 2) Автоответ клиенту с учётом языка
    try {
      const { subject, html } = getAutoReplyEmail({ name: nameNorm, lang });

      await transporter.sendMail({
        from: `"Cyprus VIP Estates" <office@cyprusvipestates.com>`,
        to: emailNorm,
        subject,
        html,
      });
    } catch (autoReplyErr) {
      console.error("Email send error (auto-reply to client):", autoReplyErr);
    }

    return NextResponse.json(
      {
        ok: true,
        created: true,
        message: "Lead sent to Monday; emails processed",
      },
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
