import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: messages,
      model: "gpt-3.5-turbo",
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);
    return NextResponse.json(chatCompletion.choices[0].message);

    // For development purposes, stubbing response to save on API Requests costs.
    // const chatCompletion = {
    //   choices: [
    //     { message: { content: "hello, stubbed for now", role: "assistant" } },
    //   ],
    // };
    // return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
