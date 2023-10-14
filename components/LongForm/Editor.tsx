"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock, Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import Spinner from "../spinner";
import "@blocknote/core/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialMarkdown?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialMarkdown, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [initialContent, setInitialContent] = useState<Block[]>();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
  });

  useEffect(() => {
    if (editor) {
      if (!initialContent && initialMarkdown) {
        // Whenever the current Markdown content changes, converts it to an array
        // of Block objects and replaces the editor's content with them.
        const getBlocks = async () => {
          const blocks: Block[] =
            await editor.markdownToBlocks(initialMarkdown);
          setInitialContent(blocks);
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
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

export default Editor;
