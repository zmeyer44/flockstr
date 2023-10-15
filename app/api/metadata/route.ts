import { NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";
import { z } from "zod";
import { validateUrl } from "@/lib/utils";

type MetaData = {
  title: string;
  description: string;
  image: string;
  creator: string;
  "theme-color": string;
  type: string;
};
const keys = [
  "title",
  "description",
  "image",
  "creator",
  "theme-color",
  "type",
] as const;
const bodySchema = z.object({
  url: z.string(),
});
async function handler(req: NextRequest) {
  const body = await req.json();
  let { url } = bodySchema.parse(body);

  if (url.includes("open.spotify")) {
    url = url.split("?")[0] as string;
  } else if (url.startsWith("https://t.co/")) {
    // const data = await getMetaData({
    //   url: url,
    //   ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    // });
    // if (data.title) {
    //   url = data.title;
    // }
    console.log("Twitter");
  }

  const decode = decodeURIComponent(url);
  try {
    const retreivedHtml = await fetch(decode);
    const html = await retreivedHtml.text();
    const root = parse(html);

    const metadata: Partial<MetaData> = {};
    const titleElement = root.querySelector("title");
    const title = titleElement?.text;
    metadata.title = title;
    const metaTags = root.querySelectorAll("meta");

    for (const metaTag of metaTags) {
      const name =
        metaTag.getAttribute("name") ?? metaTag.getAttribute("property");

      const content = metaTag.getAttribute("content");
      if (!name || !content) continue;
      for (const key of keys) {
        if (name.includes(key)) {
          if (key === "image" && !validateUrl(content)) {
            continue;
          }
          const current = metadata[key];
          if (!current || content.length > current.length) {
            metadata[key] = content;
          }
        }
      }
      console.log(`Name: ${name}, Content: ${content}`);
    }

    const data = {
      ...metadata,
      url: decode,
    };
    return NextResponse.json({
      data,
    });
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export { handler as GET, handler as POST };
