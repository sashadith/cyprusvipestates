import { NextResponse } from "next/server";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQ0MDQyNzMyNiwiYWFpIjoxMSwidWlkIjo2MjE1MTQ3MSwiaWFkIjoiMjAyNC0xMS0yM1QxODo1NTo0Ny40NThaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM5NDMwODYsInJnbiI6ImV1YzEifQ.t5IONmg4UE6uHeN7qmkBI1cEGE4YKcYkDgutGA6q_Ic";
const BOARD_ID = "1761987486";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, country } = body;

    const query = `
      mutation {
        create_item (
          board_id: ${BOARD_ID},
          item_name: "${name}",
          column_values: "${JSON.stringify({
            text_mkkwm0b4: phone,
            text_mkkwekh3: email,
            text_mkkwk9kt: country,
          }).replace(/"/g, '\\"')}"
        ) {
          id
        }
      }
    `;

    const response = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY,
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

    return NextResponse.json(
      { message: "Lead successfully sent to monday.com" },
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
