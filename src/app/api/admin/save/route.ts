import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // Only allow local file writes during development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Local file saving is only supported in development environment. For production, please use the GitHub integration." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    }

    let filePath = "";
    if (type === "software") {
      filePath = path.join(process.cwd(), "public", "data", "software.json");
    } else if (type === "categories") {
      filePath = path.join(process.cwd(), "public", "data", "categories.json");
    } else {
      return NextResponse.json({ error: "Invalid type specified" }, { status: 400 });
    }

    // Ensure directory exists (should exist already, but to be safe)
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write to local file with clean formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ success: true, message: `Successfully updated local ${type}.json` });
  } catch (error: unknown) {
    console.error("Error saving file:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to write local file", details: errorMessage },
      { status: 500 }
    );
  }
}
