import { NextResponse } from "next/server";

const MODEL = "google/gemma-2-9b-it";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const userPrompt: string | undefined = body?.prompt;
  const productName: string | undefined = body?.productName;
  const categories: string[] | undefined = body?.categories;

  if (!userPrompt) {
    return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Missing OPENROUTER_API_KEY" }, { status: 500 });
  }

  const messages = [
    {
      role: "system",
      content:
        "You write concise, friendly, SEO-aware product descriptions (80-140 words). Keep it readable, benefit-driven, and avoid hype. Include subtle keywords, no markdown.",
    },
    {
      role: "user",
      content: [
        `Product: ${productName || "N/A"}`,
        `Categories: ${categories?.join(", ") || "N/A"}`,
        `Extra details: ${userPrompt}`,
      ].join("\n"),
    },
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ShopHub Admin",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 220,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ message: "AI request failed", detail: err }, { status: 500 });
    }

    const data = await response.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) {
      return NextResponse.json({ message: "No content returned" }, { status: 500 });
    }

    return NextResponse.json({ description: text.trim() });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "AI error", detail: errorMessage }, { status: 500 });
  }
}

