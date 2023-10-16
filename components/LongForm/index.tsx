"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { BlockNoteEditor, Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toolbar } from "./ToolBar";

type MarkdoneProps = {
  content?: string;
  editable?: boolean;
};
export default function Markdown({ content, editable = false }: MarkdoneProps) {
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    onEditorContentChange: (e) => {
      console.log("EDITOR CHANGE", e);
    },
  });

  useEffect(() => {
    if (editor) {
      if (content) {
        // Whenever the current Markdown content changes, converts it to an array
        // of Block objects and replaces the editor's content with them.
        const getBlocks = async () => {
          const blocks: Block[] = await editor.markdownToBlocks(content);
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
          setLoading(false);
        };
        void getBlocks();
      } else if (loading) {
        console.log("TURING LOADING OFF");
        setLoading(false);
      }
    }
  }, [editor]);

  if (loading) {
    return (
      <div className="space-y-4 pl-8 pt-5">
        <Skeleton className="h-14 w-[50%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[40%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    );
  }
  return (
    <div className="pt-5">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
