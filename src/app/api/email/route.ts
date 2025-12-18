// app/api/email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ALLOWED_HOSTS = new Set([
  "cyprusvipestates.com",
  "www.cyprusvipestates.com",
]);

// если этот роут ТОЛЬКО для партнёров — включи whitelist путей:
const ALLOWED_PATH_PREFIXES = ["/partners"]; // при необходимости добавь: "/de/partners", "/pl/partners" и т.д.

// in-memory rate limits (на уровне инстанса)
const rateLimitIpMap = new Map<string, number[]>();
const rateLimitEmailMap = new Map<string, number[]>();

function safeUrl(raw: string) {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function isAllowedHostFromUrl(raw: string) {
  const u = safeUrl(raw);
  if (!u) return false;
  return ALLOWED_HOSTS.has(u.hostname);
}

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

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

// анти-токен: длинная строка без пробелов, только буквы/цифры
function looksLikeToken(value: string) {
  const v = String(value ?? "")
    .trim()
    .replace(/\s+/g, "");
  if (v.length < 18) return false;
  if (!/^[a-z0-9]+$/i.test(v)) return false;
  return true;
}

function countDigits(value: string) {
  const m = String(value ?? "").match(/\d/g);
  return m ? m.length : 0;
}

function blocked(reason: string, extra?: Record<string, any>) {
  const debug = process.env.NODE_ENV !== "production";
  return NextResponse.json(
    debug ? { ok: false, blocked: reason, ...extra } : { ok: false },
    { status: 200 } // всегда 200
  );
}

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
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") || "";
  const ipKey = ip === "unknown" ? `unknown:${ua || "ua"}` : ip;

  if (!ua) return blocked("ua");

  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return blocked("content_type");

  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";

  if (!referer || !isAllowedHostFromUrl(referer)) return blocked("bad_referer");
  if (origin && !isAllowedHostFromUrl(origin)) return blocked("bad_origin");

  if (isRateLimitedKey(rateLimitIpMap, ipKey, 5, 60_000)) {
    return blocked("rate_limit_ip");
  }

  try {
    const body = await request.json();

    const {
      name,
      surname,
      phone,
      email,
      country,
      agreedToPolicy,
      company, // honeypot
      formStartTime,
      currentPage,
      lang,
    } = body;

    // currentPage обязателен и должен быть на твоём домене
    const page = String(currentPage ?? "").trim();
    if (!page) return blocked("missing_page");

    const pageUrl = safeUrl(page);
    if (!pageUrl) return blocked("bad_page_url");
    if (!ALLOWED_HOSTS.has(pageUrl.hostname)) return blocked("page_host");

    // если роут только для партнёров — ограничь путь
    if (ALLOWED_PATH_PREFIXES.length) {
      const okPath = ALLOWED_PATH_PREFIXES.some((p) =>
        pageUrl.pathname.startsWith(p)
      );
      if (!okPath) return blocked("bad_path");
    }

    // referer.host должен совпадать с currentPage.host
    const refUrl = safeUrl(referer);
    if (!refUrl) return blocked("bad_referer_url");
    if (refUrl.hostname !== pageUrl.hostname) return blocked("page_mismatch");

    // honeypot
    const honeypot = String(company ?? "").trim();
    if (honeypot.length > 0) return blocked("honeypot");

    // timing
    const startedRaw = Number(formStartTime);
    const elapsed = Date.now() - startedRaw;

    if (
      !Number.isFinite(startedRaw) ||
      startedRaw <= 0 ||
      elapsed < 1500 ||
      elapsed > 2 * 60 * 60 * 1000
    ) {
      return blocked("timing", { startedRaw, elapsed });
    }

    // нормализация
    const nameNorm = String(name ?? "").trim();
    const surnameNorm = String(surname ?? "").trim();
    const phoneNorm = String(phone ?? "").trim();
    const emailNorm = String(email ?? "")
      .trim()
      .toLowerCase();
    const countryNorm = String(country ?? "").trim();

    if (!nameNorm || !surnameNorm || !phoneNorm || !emailNorm || !countryNorm) {
      return blocked("missing_fields");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) return blocked("email");

    // rate limit по email (после валидации email)
    if (isRateLimitedKey(rateLimitEmailMap, emailNorm, 3, 60_000)) {
      return blocked("rate_limit_email");
    }

    // agreedToPolicy — базовая проверка
    if (agreedToPolicy !== true) return blocked("agreement");

    // ✅ анти-токен / анти-бот эвристики (как раз под твой спам)
    if (
      looksLikeToken(nameNorm) ||
      looksLikeToken(surnameNorm) ||
      looksLikeToken(countryNorm)
    ) {
      return blocked("token_fields");
    }

    // телефон: цифры в адекватном диапазоне
    const digits = countDigits(phoneNorm);
    if (digits < 8 || digits > 16) return blocked("phone_digits");

    // запрет на очень “шаблонные” номера
    const onlyDigits = phoneNorm.replace(/\D/g, "");
    if (/^(\d)\1{6,}$/.test(onlyDigits)) return blocked("phone_repeated"); // 0000000
    if ("0123456789012345".includes(onlyDigits) && onlyDigits.length >= 7)
      return blocked("phone_sequence");

    // письмо
    const mailBodyText =
      `Partner request\n\n` +
      `Name: ${nameNorm}\n` +
      `Surname: ${surnameNorm}\n` +
      `Phone: ${phoneNorm}\n` +
      `Email: ${emailNorm}\n` +
      `Country: ${countryNorm}\n` +
      `Lang: ${String(lang ?? "")}\n` +
      `Page: ${page}\n`;

    const mailBodyHtml = `
      <h2>Partner request</h2>
      <p><b>Name:</b> ${escapeHtml(nameNorm)}</p>
      <p><b>Surname:</b> ${escapeHtml(surnameNorm)}</p>
      <p><b>Phone:</b> ${escapeHtml(phoneNorm)}</p>
      <p><b>Email:</b> ${escapeHtml(emailNorm)}</p>
      <p><b>Country:</b> ${escapeHtml(countryNorm)}</p>
      <hr/>
      <p><b>Lang:</b> ${escapeHtml(String(lang ?? ""))}</p>
      <p><b>Page:</b> ${escapeHtml(page)}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER!,
      cc: process.env.EMAIL_COFOUNDER || undefined,
      subject: `Partner Request — ${nameNorm} ${surnameNorm}`,
      text: mailBodyText,
      html: mailBodyHtml,
      replyTo: emailNorm || undefined,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Email route internal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
