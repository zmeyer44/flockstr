"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { BlockNoteEditor, Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import Spinner from "../spinner";

type MarkdoneProps = {
  content?: string;
  editable?: boolean;
};
export default function Markdown({ content }: MarkdoneProps) {
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  const editor: BlockNoteEditor = useBlockNote({
    editable: false,
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
      <div className="center py-20 text-primary">
        <Spinner />
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
