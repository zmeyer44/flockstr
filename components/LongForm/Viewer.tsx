"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock, Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import Spinner from "../spinner";
import "@blocknote/core/style.css";

interface EditorProps {
  initialMarkdown?: string;
}

const Viewer = ({ initialMarkdown }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [initialContent, setInitialContent] = useState<Block[]>();

  const editor: BlockNoteEditor = useBlockNote({
    editable: false,
    initialContent: initialContent,
  });

  useEffect(() => {
    if (editor) {
      if (!initialContent && initialMarkdown) {
        console.log("initial md", initialMarkdown);
        // Whenever the current Markdown content changes, converts it to an array
        // of Block objects and replaces the editor's content with them.
        const getBlocks = async () => {
          const blocks: Block[] =
            await editor.markdownToBlocks(initialMarkdown);
          setInitialContent(blocks);
          console.log("Blocks", blocks);
          //   editor.replaceBlocks(editor.topLevelBlocks, blocks);
          setLoading(false);
        };
        void getBlocks();
      } else if (loading) {
        setLoading(false);
      }
    }
  }, [editor]);

  if (loading) {
    return (
      <div className="">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Viewer;
