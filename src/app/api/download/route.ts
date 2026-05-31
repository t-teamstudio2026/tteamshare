import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Software } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing software ID" }, { status: 400 });
    }

    if (process.env.NODE_ENV === "development") {
      const filePath = path.join(process.cwd(), "public", "data", "software.json");
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const software: Software[] = JSON.parse(fileContent);
        
        const updatedSoftware = software.map((sw) => {
          if (sw.id === id) {
            return {
              ...sw,
              downloadsCount: (sw.downloadsCount || 0) + 1,
              updatedAt: new Date().toISOString(),
            };
          }
          return sw;
        });

        fs.writeFileSync(filePath, JSON.stringify(updatedSoftware, null, 2), "utf8");
        return NextResponse.json({ success: true, message: "Local download count incremented" });
      }
    }

    return NextResponse.json({ success: true, message: "Download request processed" });
  } catch (error: unknown) {
    console.error("Error updating download count:", error);
    return NextResponse.json({ error: "Server error" }, { status: 550 });
  }
}
