// app/api/ask-gemini/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fileText, question } = await req.json();

    if (!fileText || !question) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    const prompt = `Answer the question based only on this document:\n\n${fileText}\n\nQuestion: ${question}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiRes.json();
console.log(data)
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
