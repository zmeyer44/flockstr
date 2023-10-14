"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

interface EditorProps {
  editable?: boolean;
}

const Editor = ({ editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const [content, setContent] = useState("");

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    onEditorContentChange: (editor) => {
      setContent(JSON.stringify(editor.topLevelBlocks, null, 2));
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
