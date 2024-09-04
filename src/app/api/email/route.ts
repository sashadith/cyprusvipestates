import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  const data = await request.json();

  console.log("Received data:", data); // Журналирование данных для отладки

  // Используем переменные из окружения для настроек SMTP
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Хост берется из окружения
    port: Number(process.env.SMTP_PORT), // Порт также берется из окружения
    secure: true, // true для порта 465 (SSL), false для порта 587
    auth: {
      user: process.env.EMAIL_USER, // Email пользователя
      pass: process.env.EMAIL_PASSWORD, // Пароль пользователя
    },
  });

  let mailBody = "";
  let isValid = false;

  // Проверка и формирование тела письма
  if (data.name && data.phone && !data.country && !data.email) {
    mailBody = `Name: ${data.name}\nPhone: ${data.phone}\nCountry: ${data.country}\nEmail: ${data.email}`;
    isValid = true;
  } else if (data.phone && data.country && data.email && !data.whatsapp) {
    mailBody = `Phone: ${data.phone}\Country: ${data.country}\nEmail: ${data.email}`;
    isValid = true;
  } else if (data.whatsapp && !data.phone && !data.country && !data.email) {
    mailBody = `Whatsapp: ${data.whatsapp}`;
    isValid = true;
  } else {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (isValid) {
    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Request from Cyprys VIP Estates`,
      text: mailBody,
    };

    try {
      await transport.sendMail(mailOptions);
      return NextResponse.json({ message: "Email sent" });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Invalid data" }, { status: 400 });
}
