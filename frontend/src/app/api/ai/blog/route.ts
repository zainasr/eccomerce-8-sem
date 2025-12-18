import { NextResponse } from "next/server";

const MODEL = "google/gemma-2-9b-it";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const userPrompt: string | undefined = body?.prompt;

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
        "You are a professional blog writer. Generate a complete blog post based on the user's prompt. Return a JSON object with exactly these fields: 'title' (engaging title, 50-80 chars), 'excerpt' (brief summary, 100-150 chars), and 'content' (full HTML blog content with proper headings, paragraphs, and formatting using <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em> tags. Make it 400-600 words, well-structured with multiple sections). Do not include markdown, only HTML. Return valid JSON only.",
    },
    {
      role: "user",
      content: `Write a blog post about: ${userPrompt}`,
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
        max_tokens: 2000,
        temperature: 0.3,
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

    // Try to parse as JSON first
    let parsed: { title?: string; excerpt?: string; content?: string };
    try {
      // Remove any markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanedText);
    } catch {
      // If not JSON, try to extract structured data
      const titleMatch = text.match(/title[:\-]\s*["']?([^"'\n]+)["']?/i) || text.match(/^#\s*(.+)$/m);
      const excerptMatch = text.match(/excerpt[:\-]\s*["']?([^"'\n]+)["']?/i);
      const contentMatch = text.match(/content[:\-]\s*([\s\S]+)/i);

      parsed = {
        title: titleMatch?.[1]?.trim() || text.split("\n")[0]?.replace(/^#+\s*/, "").trim() || "Blog Post",
        excerpt: excerptMatch?.[1]?.trim() || text.split("\n").slice(1, 3).join(" ").trim().substring(0, 150) || "",
        content: contentMatch?.[1]?.trim() || text,
      };
    }

    // Ensure content is HTML formatted
    let content = parsed.content || "";
    if (!content.includes("<")) {
      // Convert plain text to HTML
      const paragraphs = content.split("\n\n").filter((p) => p.trim());
      content = paragraphs
        .map((p) => {
          const trimmed = p.trim();
          if (trimmed.startsWith("# ")) {
            return `<h2>${trimmed.slice(2)}</h2>`;
          } else if (trimmed.startsWith("## ")) {
            return `<h3>${trimmed.slice(3)}</h3>`;
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const items = trimmed.split("\n").filter((i) => i.trim().startsWith("- ") || i.trim().startsWith("* "));
            if (items.length > 1) {
              return `<ul>${items.map((i) => `<li>${i.replace(/^[-*]\s*/, "")}</li>`).join("")}</ul>`;
            }
            return `<p>${trimmed.replace(/^[-*]\s*/, "")}</p>`;
          }
          return `<p>${trimmed}</p>`;
        })
        .join("");
    }

    return NextResponse.json({
      title: parsed.title || "Blog Post",
      excerpt: parsed.excerpt || "",
      content: content || "<p>Blog content goes here.</p>",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "AI error", detail: errorMessage }, { status: 500 });
  }
}

