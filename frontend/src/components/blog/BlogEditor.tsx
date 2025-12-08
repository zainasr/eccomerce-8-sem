"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const btnBase =
  "px-2 py-1 text-sm rounded border border-border bg-white hover:bg-slate-100 transition inline-flex items-center gap-1";

function ToolbarButton({
  onClick,
  label,
  active = false,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`${btnBase} ${active ? "bg-black text-white" : ""}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function askForLink(current: string | null) {
  const url = window.prompt("Enter URL", current || "https://");
  if (url === null) return null;
  return url.trim();
}

export function BlogEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog content...",
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[280px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const toggle = (action: () => void) => () => action();

  return (
    <div className="border border-border rounded-lg bg-white">
      <div className="flex flex-wrap gap-2 border-b border-border p-3">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={toggle(() => editor.chain().focus().toggleBold().run())}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={toggle(() => editor.chain().focus().toggleItalic().run())}
        />
        <ToolbarButton
          label="Strike"
          active={editor.isActive("strike")}
          onClick={toggle(() => editor.chain().focus().toggleStrike().run())}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={toggle(() => editor.chain().focus().toggleBlockquote().run())}
        />
        <ToolbarButton
          label="Code"
          active={editor.isActive("codeBlock")}
          onClick={toggle(() => editor.chain().focus().toggleCodeBlock().run())}
        />
        <ToolbarButton
          label="Bullets"
          active={editor.isActive("bulletList")}
          onClick={toggle(() => editor.chain().focus().toggleBulletList().run())}
        />
        <ToolbarButton
          label="Numbered"
          active={editor.isActive("orderedList")}
          onClick={toggle(() => editor.chain().focus().toggleOrderedList().run())}
        />
        <ToolbarButton
          label="P"
          active={editor.isActive("paragraph")}
          onClick={toggle(() => editor.chain().focus().setParagraph().run())}
        />
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={toggle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        />
        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={toggle(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        />
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link")?.href as string | undefined;
            const url = askForLink(prev || null);
            if (!url) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
        />
        <ToolbarButton
          label="HR"
          onClick={toggle(() => editor.chain().focus().setHorizontalRule().run())}
        />
        <ToolbarButton
          label="Undo"
          onClick={toggle(() => editor.chain().focus().undo().run())}
        />
        <ToolbarButton
          label="Redo"
          onClick={toggle(() => editor.chain().focus().redo().run())}
        />
        <ToolbarButton
          label="Clear"
          onClick={toggle(() => editor.chain().focus().unsetAllMarks().clearNodes().run())}
        />
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

