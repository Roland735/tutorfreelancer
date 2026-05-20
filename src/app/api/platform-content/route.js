import { NextResponse } from "next/server";
import { getPlatformContent, getPlatformContentMap } from "@/lib/platform-content";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const keys = url.searchParams.get("keys");

    if (keys) {
      const content = await getPlatformContentMap(
        keys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      );

      return NextResponse.json({ content });
    }

    if (!key) {
      return NextResponse.json({ message: "Provide key or keys." }, { status: 400 });
    }

    const content = await getPlatformContent(key);
    if (!content) {
      return NextResponse.json({ message: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load platform content." },
      { status: 500 }
    );
  }
}
