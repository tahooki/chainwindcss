import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest } from "next/server";

export interface ImageInput {
  data: string; // base64 이미지 데이터
  label?: string;
  description?: string;
  mimeType: string;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, images } = await req.json();

    // Create messages array for multi-modal input
    const messages = [
      {
        role: "system" as const,
        content: `You are an expert web developer who creates semantic HTML with Tailwind CSS classes.
        Follow these requirements:
        1. Use semantic HTML5 elements
        2. Apply responsive Tailwind CSS classes
        3. Follow modern web development best practices
        4. Analyze UX/UI images precisely to generate appropriate code.
        4. Generate Tailwind CSS code by analyzing text or images.
        5. Use HTML tags and include the Tailwind CSS CDN.
        6. Add to the header:
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0,0" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0,0" rel="stylesheet" />
        7. If icons are needed, use Material Icons.
        8. For image fields:
           - If width and height dimensions are specified in the code/text prompt, use those exact dimensions
           - Otherwise, for field names:
             - If the field name suggests specific dimensions (e.g., banner, thumbnail, cover), use "https://picsum.photos/width/height" format
             - For banner/cover images, use "https://picsum.photos/1200/400"
             - For regular images (e.g., imageUrl, image, avatar), use "https://picsum.photos/400"
        `,
      },
      {
        role: "user" as const,
        content: [
          { type: "text", text: prompt },
          // Add images if they exist
          ...(images?.map((img: ImageInput) => ({
            type: "image",
            image: img.data,
          })) || []),
        ],
      },
    ];

    console.log("messages ::: ", messages);

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages,
    });

    console.log("text ::: ", text);

    // Extract code from markdown code block if present
    const codeMatch = text.match(/```(?:html)?([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : text;

    // Basic HTML validation
    if (!code.includes("<") || !code.includes(">")) {
      throw new Error("Invalid HTML generated");
    }

    return Response.json({ code });
  } catch (error: any) {
    console.error("Error in generate route:", error);
    return Response.json(
      { error: "Failed to generate code. Please try again." },
      { status: 500 }
    );
  }
}
