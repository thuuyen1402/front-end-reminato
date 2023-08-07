import { ReactHTML, createElement, useMemo } from "react";
import sanitizeHtml from "sanitize-html";
export type RichTextRender = {
  content: string;
  className?: string;
  component?: keyof ReactHTML;
  "aria-label": string
};
export const RichTextRender = ({ content, className = "", component = "div", ...props }: RichTextRender) => {
  const contentSanitize = useMemo(() => {
    return sanitizeHtml(content);
  }, [content]);

  return createElement(component, {
    ...props,
    className,
    dangerouslySetInnerHTML: { __html: contentSanitize },

  })
}
