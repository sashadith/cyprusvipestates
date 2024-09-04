import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function POST(request: NextRequest) {
  const data = await request.json();

  console.log("Received data:", data); // Журналирование данных для отладки

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailBody = "";
  let isValid = false;

  // Проверка и формирование тела письма в зависимости от присутствующих полей
  if (data.name && data.phone && !data.country && !data.email) {
    // Обработка формы с только телефоном
    mailBody = `Name: ${data.name}\nPhone: ${data.phone}\nCountry: ${data.country}\nEmail: ${data.email}`;
    isValid = true;
  } else if (data.phone && data.country && data.email && !data.whatsapp) {
    // Обработка формы с телефоном, страной и email
    mailBody = `Phone: ${data.phone}\Country: ${data.country}\nEmail: ${data.email}`;
    isValid = true;
  } else if (data.whatsapp && !data.phone && !data.country && !data.email) {
    // Обработка формы с только Whatsapp
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
