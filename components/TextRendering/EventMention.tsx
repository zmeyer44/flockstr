"use client";
import Link from "next/link";

type EventMentionProps = {
  mention: string;
};

export default function EventMention({ mention }: EventMentionProps) {
  //   const { user } = useProfile(mention);
  return (
    <Link href={`/${mention}`}>
      <span className="text-primary-foreground hover:underline">{`*\$${mention}`}</span>
    </Link>
  );
}
