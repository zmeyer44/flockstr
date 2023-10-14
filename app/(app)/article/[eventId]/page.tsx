"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
const Viewer = dynamic(() => import("@/components/LongForm/Viewer"), {
  ssr: false,
});

export default function ArticlePage({
  params: { eventId },
}: {
  params: {
    eventId: string;
  };
}) {
  const router = useRouter();
  const markdown = `This is a test
### test text

- First
- Second
1 nest`;

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b pb-4 pt-4">
        <div className="center gap-x-3">
          <Avatar className="center h-8 w-8 overflow-hidden rounded-sm bg-muted">
            <AvatarImage
              src={
                "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
              }
              alt="user"
            />
            <AvatarFallback className="text-xs">SC</AvatarFallback>
          </Avatar>
          <span className="text-xs uppercase text-muted-foreground">
            Derek Seivers
          </span>
        </div>
        <Button
          onClick={() => {
            if (sessionStorage.getItem("RichHistory")) {
              void router.back();
            } else {
              void router.push("/");
            }
          }}
          size="icon"
          variant={"outline"}
          className=""
        >
          <RiCloseFill className="h-5 w-5" />
        </Button>
      </div>
      <div className="h-[70px] w-full"></div>
      <Viewer initialMarkdown={markdown} />
    </div>
  );
}
