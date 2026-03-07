import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Custom TipTap extension for embedding iframes (e.g. Vimeo, internal videos).
 * Use YouTube extension for YouTube URLs.
 */
export const Iframe = Node.create({
  name: "iframe",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      title: {
        default: "Embedded content",
        parseHTML: (element) => element.getAttribute("title") || "Embedded content",
        renderHTML: (attributes) => ({ title: attributes.title }),
      },
      width: {
        default: "640",
        parseHTML: (element) => element.getAttribute("width") || "640",
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: "360",
        parseHTML: (element) => element.getAttribute("height") || "360",
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "iframe-wrapper my-4 rounded-lg overflow-hidden bg-muted" },
      [
        "iframe",
        mergeAttributes(
          {
            width: "640",
            height: "360",
            frameborder: "0",
            allowfullscreen: "true",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
