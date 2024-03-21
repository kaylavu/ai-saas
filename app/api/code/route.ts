import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

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
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }
    const instructionMessage = {
      role: "system",
      content:
        "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
    };
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [instructionMessage, ...messages],
      model: "gpt-3.5-turbo",
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    await incrementApiLimit();

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
