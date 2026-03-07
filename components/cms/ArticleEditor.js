"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Iframe } from "@/lib/tiptap-iframe";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  ImagePlus,
  Link2,
  Youtube as YoutubeIcon,
  Film,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function MenuBar({ editor, onImageUpload, onVideoEmbed, onIframeEmbed }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-3 py-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(editor.isActive("bold") && "bg-muted")}
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(editor.isActive("italic") && "bg-muted")}
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(editor.isActive("strike") && "bg-muted")}
        aria-label="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(editor.isActive("code") && "bg-muted")}
        aria-label="Code"
      >
        <Code className="h-4 w-4" />
      </Button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(editor.isActive("heading", { level: 1 }) && "bg-muted")}
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(editor.isActive("heading", { level: 2 }) && "bg-muted")}
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(editor.isActive("heading", { level: 3 }) && "bg-muted")}
        aria-label="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(editor.isActive("bulletList") && "bg-muted")}
        aria-label="Bullet list"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(editor.isActive("orderedList") && "bg-muted")}
        aria-label="Ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(editor.isActive("blockquote") && "bg-muted")}
        aria-label="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        aria-label="Horizontal rule"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onImageUpload}
        aria-label="Insert image"
      >
        <ImagePlus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = window.prompt("Enter link URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={cn(editor.isActive("link") && "bg-muted")}
        aria-label="Insert link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onVideoEmbed}
        aria-label="Embed YouTube video"
      >
        <YoutubeIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onIframeEmbed}
        aria-label="Embed video (Vimeo, etc.)"
      >
        <Film className="h-4 w-4" />
      </Button>
      <span className="mx-1 h-4 w-px bg-border" aria-hidden />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ArticleEditor({ content, onChange, placeholder }) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener" } }),
      Placeholder.configure({ placeholder: placeholder || "Start writing your article..." }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
      }),
      Iframe,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-[320px] px-4 py-4 focus:outline-none [&_img]:max-w-full [&_img]:rounded-lg [&_iframe]:max-w-full",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const handleImageUpload = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const data = reader.result;
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              data,
            }),
          });
          const json = await res.json();
          if (json.ok && json.url) {
            editor.chain().focus().setImage({ src: json.url }).run();
          } else {
            alert(json.error || "Upload failed");
          }
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        alert("Upload failed");
        setUploading(false);
      }
    };
    input.click();
  }, [editor]);

  const handleVideoEmbed = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Paste YouTube URL (e.g. https://www.youtube.com/watch?v=...):");
    if (!url) return;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) {
      editor.chain().focus().setYoutubeVideo({ src: match[1] }).run();
    } else {
      alert("Please enter a valid YouTube URL");
    }
  }, [editor]);

  const handleIframeEmbed = useCallback(() => {
    if (!editor) return;
    const url = window.prompt(
      "Paste embed URL (Vimeo, internal video, or any iframe-compatible URL):"
    );
    if (url && url.startsWith("http")) {
      editor.chain().focus().insertContent({
        type: "iframe",
        attrs: { src: url },
      }).run();
    } else if (url) {
      alert("Please enter a valid URL starting with http");
    }
  }, [editor]);

  return (
    <div className="rounded-lg border border-input bg-background overflow-hidden">
      <MenuBar
        editor={editor}
        onImageUpload={handleImageUpload}
        onVideoEmbed={handleVideoEmbed}
        onIframeEmbed={handleIframeEmbed}
      />
      {uploading && (
        <div className="px-4 py-2 text-sm text-muted-foreground bg-muted/50">
          Uploading image...
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
