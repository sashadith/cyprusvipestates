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

    // дата и время
    const currentDate = new Date().toISOString().split("T")[0];
    const cyprusTime = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Nicosia",
    }).format(new Date());

    // значения для колонок в Monday
    const cols: Record<string, string> = {
      text_mkkwm0b4: phone, // phone
      text_mkkwekh3: email, // email
      text_mkkwk9kt: currentPage, // page url
      text_mkq6spmc: message || "", // message
      date_mkt0wz3n: currentDate, // date
      text_mkt0gyvy: cyprusTime, // time in Cyprus
      text_mkx4pb8s: preferredContact, // "phone" | "whatsapp" | "email"
    };

    // 1) создаём item
    const mutationCreate = `
      mutation {
        create_item(
          board_id: ${BOARD_ID},
          item_name: "${String(name).replace(/"/g, '\\"')}",
          column_values: "${JSON.stringify(cols).replace(/"/g, '\\"')}"
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
    console.log("Monday response:", JSON.stringify(data));

    // если не создалось — говорим фронту об ошибке
    if (data?.errors?.length || !data?.data?.create_item?.id) {
      return NextResponse.json(
        {
          error: "Monday create_item failed",
          details: data?.errors || data,
        },
        { status: 400 }
      );
    }

    const newItemId = data.data.create_item.id;

    // 2) пробуем переместить наверх
    try {
      // берём первый айтем с доски (то, что Monday считает "сверху" по выдаче)
      const topItemsRes = await fetch(MONDAY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: MONDAY_API_KEY,
        },
        body: JSON.stringify({
          query: `
            query {
              boards (ids: [${BOARD_ID}]) {
                items (limit: 1) {
                  id
                }
              }
            }
          `,
        }),
      });

      const topData = await topItemsRes.json();
      const topItemId = topData?.data?.boards?.[0]?.items?.[0]?.id;

      // если есть верхний элемент и это не тот же самый новый лид — двигаем
      if (topItemId && topItemId !== newItemId) {
        await fetch(MONDAY_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: MONDAY_API_KEY,
          },
          body: JSON.stringify({
            query: `
              mutation {
                change_item_position(
                  item_id: ${newItemId},
                  position_relative_method: before,
                  relative_to_item_id: ${topItemId}
                ) {
                  id
                }
              }
            `,
          }),
        });
      }
    } catch (posErr) {
      // Не роняем весь запрос, если не смогли поднять вверх.
      console.error("Monday position change error:", posErr);
    }

    // 3) отправляем письмо (но не падаем, если письмо не ушло)
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
      return NextResponse.json(
        { message: "Lead sent to Monday; email notification failed" },
        { status: 200 }
      );
    }

    // всё ок
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
