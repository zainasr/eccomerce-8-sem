import { NextResponse } from "next/server";

const MODEL = "google/gemma-2-9b-it";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const productName: string | undefined = body?.productName;
  const description: string | undefined = body?.description;
  const categories: string[] | undefined = body?.categories;

  if (!productName && !description) {
    return NextResponse.json({ message: "Product name or description is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Missing OPENROUTER_API_KEY" }, { status: 500 });
  }

  const messages = [
    {
      role: "system",
      content:
        "You generate SEO metadata. Return: a title <= 60 chars, a meta description <= 150 chars, and 6-10 comma-separated keywords. Keep it natural and product-relevant.",
    },
    {
      role: "user",
      content: [
        `Product: ${productName || "N/A"}`,
        `Description: ${description || "N/A"}`,
        `Categories: ${categories?.join(", ") || "N/A"}`,
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
        max_tokens: 180,
        temperature: 0.4,
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

    // crude parsing: expect lines like Title: ..., Description: ..., Keywords: ...
    const titleMatch = text.match(/title[:\-]\s*(.*)/i);
    const descMatch = text.match(/description[:\-]\s*(.*)/i);
    const keywordsMatch = text.match(/keywords[:\-]\s*(.*)/i);

    const title = titleMatch?.[1]?.trim() || text.slice(0, 60);
    const seoDescription = descMatch?.[1]?.trim() || text.slice(0, 150);
    const seoKeywords = keywordsMatch?.[1]?.trim() || "";

    return NextResponse.json({
      title,
      seoDescription,
      seoKeywords,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "AI error", detail: errorMessage }, { status: 500 });
  }
}

