"use client";
import Article from "@/containers/Article";

export default function ArticlePage({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  return <Article />;
}
