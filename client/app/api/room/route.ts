import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/room`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server connection failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("Received request body:", body);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_END_URL}/room`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server connection failed",
      },
      {
        status: 500,
      }
    );
  }
}