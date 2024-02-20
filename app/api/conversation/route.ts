import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

export default async function POST(req: Request) {
  try {
    // TODO: Implement openai interactions in route.ts file
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
