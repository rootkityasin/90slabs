import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 },
    );
  }

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    if (!latestMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 },
      );
    }

    // 1. Fetch Context from Database
    const db = await getDatabase();
    const [servicesDoc, projects, aboutDoc, members] = await Promise.all([
      db.collection("services").findOne({}),
      db.collection("projects").find({}).toArray(),
      db.collection("about").findOne({}),
      db.collection("members").find({}).toArray(),
    ]);

    // 2. Format Context
    let contextString =
      "You are a helpful AI assistant for a portfolio website. Use the following context to answer the user's question. If the answer is not in the context, say you don't know but can forward the message to the owner.\n\n";

    if (aboutDoc) {
      contextString += `--- ABOUT US ---\n`;
      contextString += `Title: ${aboutDoc.title}\n`;
      contextString += `Description: ${aboutDoc.paragraphs?.join("\n")}\n\n`;
    }

    if (members && members.length > 0) {
      contextString += `--- TEAM MEMBERS ---\n`;
      members.forEach((m: any) => {
        contextString += `- Name: ${m.name}, Role: ${m.role}\n`;
      });
      contextString += "\n";
    }

    if (servicesDoc && servicesDoc.categories) {
      contextString += `--- SERVICES ---\n`;
      servicesDoc.categories.forEach((cat: any) => {
        contextString += `Category: ${cat.title} - ${cat.description}\n`;
        cat.services?.forEach((svc: any) => {
          contextString += `- Service: ${svc.title}: ${svc.description}\n`;
        });
      });
      contextString += "\n";
    }

    if (projects && projects.length > 0) {
      contextString += `--- PROJECTS ---\n`;
      projects.forEach((p: any) => {
        contextString += `- ${p.title} (${p.category}): ${
          p.description
        }. Tech: ${p.tech?.join(", ")}\n`;
      });
      contextString += "\n";
    }

    // 3. Prepare Messages (OpenAI Compatible)
    const apiMessages = [
      {
        role: "system",
        content: contextString,
      },
      ...messages.map((m: any) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    // 4. Call OpenRouter API
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        // Optional OpenRouter headers for identifying your app
        "HTTP-Referer": "https://localhost:3000", // Update with your actual site URL
        "X-Title": "Portfolio Chatbot",
      },
      body: JSON.stringify({
        model: "stepfun/step-3.5-flash:free",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);

      if (response.status === 429) {
        return NextResponse.json(
          {
            message: "I'm receiving too many requests. Please try again later.",
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const aiMessage =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat API connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
