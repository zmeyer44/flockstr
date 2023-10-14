"use client";

import { Badge } from "@/components/ui/badge";

type TagsProps = {
  tags: string[];
};
export default function Tags({ tags }: TagsProps) {
  return (
    <div className="flex flex-row-reverse flex-wrap items-center gap-2">
      {tags.map((t, idx) => (
        <Badge key={idx} variant={"secondary"}>
          {t}
        </Badge>
      ))}
    </div>
  );
}
