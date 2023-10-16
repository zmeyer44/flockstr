"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

interface EditorProps {
  editable?: boolean;
  onContentChange: (text: string) => void;
}

const Editor = ({ editable, onContentChange }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    onEditorContentChange: (editor) => {
      // Converts the editor's contents from Block objects to Markdown and
      // saves them.
      const saveBlocksAsMarkdown = async () => {
        const markdown: string = await editor.blocksToMarkdown(
          editor.topLevelBlocks,
        );
        onContentChange(markdown);
      };
      saveBlocksAsMarkdown();
    },
  });

  return (
    <div className="">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
