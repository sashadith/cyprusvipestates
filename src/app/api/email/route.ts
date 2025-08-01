import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  const data = await request.json();

  // console.log("Received data:", data);

  const transport = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // true для порта 465, false для 587
    auth: {
      user: process.env.EMAIL_USER, // например: contact@yourdomain.com
      pass: process.env.EMAIL_PASSWORD, // пароль или пароль приложения
    },
  });

  // Проверка наличия всех полей
  if (data.name && data.phone && data.country && data.email) {
    const mailBody = `Name: ${data.name}\nSurname: ${data.surname}\nPhone: ${data.phone}\nEmail: ${data.email}\nCountry: ${data.country}`;

    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Partner Request from ${data.name}`,
      text: mailBody,
    };

    try {
      await transport.sendMail(mailOptions);
      return NextResponse.json({ message: "Email sent" });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // Если какие-то данные отсутствуют, вернуть ошибку
  return NextResponse.json({ error: "Invalid data" }, { status: 400 });
}
