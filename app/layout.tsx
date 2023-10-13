import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";

const inter = Inter({ subsets: ["latin"] });
const title = "Flockstr";
const description = "Own your flock";
const image =
  "https://o-0-o-image-storage.s3.amazonaws.com/zachmeyer_a_cartoon_image_of_an_ostrich_wearing_sunglasses_at_a_e68ac83e-a3b8-4d81-9550-a1fb7ee1ee62.png";

export const metadata: Metadata = {
  title,
  description,
  icons: [
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@zachmeyer_",
  },
  metadataBase: new URL("https://flockstr.com"),
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: title,
    statusBarStyle: "default",
  },
  applicationName: "Flockstr",
  formatDetection: {
    telephone: false,
  },
  themeColor: {
    color: "#000000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <body
        className={cn(inter.className, "w-full bg-background scrollbar-none")}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
