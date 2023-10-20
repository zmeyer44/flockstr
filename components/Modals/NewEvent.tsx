"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Template from "./Template";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/_providers/modal/provider";
import { nip19 } from "nostr-tools";
// import { useKeys } from "@/app/_providers/keysProvider";
import { useNDK } from "@/app/_providers/ndk";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import {
  HiChatBubbleLeftEllipsis,
  HiBookmarkSquare,
  HiNewspaper,
  HiUserGroup,
} from "react-icons/hi2";
import { RiSubtractFill, RiAddFill } from "react-icons/ri";
import { formatCount } from "@/lib/utils";
import LoginModal from "./Login";
import CreateList from "./CreateList";
import ShortTextNoteModal from "./ShortTextNote";
export default function NewEventModal() {
  const modal = useModal();
  return (
    <Template title="New Event" className="md:max-w-[400px]">
      <div className="flex flex-col gap-y-5">
        <Button
          onClick={() => {
            modal?.swap(<ShortTextNoteModal />);
          }}
          className="w-full gap-x-1"
        >
          <span>Short Text</span>
          <HiChatBubbleLeftEllipsis className="h-4 w-4" />
        </Button>
        <Link href={`/article/new`}>
          <Button className="w-full gap-x-1">
            <span>Long Form</span>
            <HiNewspaper className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          onClick={() => {
            modal?.swap(<CreateList />);
          }}
          className="w-full gap-x-1"
        >
          <span>Content List</span>
          <HiBookmarkSquare className="h-4 w-4" />
        </Button>
      </div>
    </Template>
  );
}
