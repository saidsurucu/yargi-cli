import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export function convertHtmlToMarkdown(html: string): string {
  if (!html) return "";
  return turndown.turndown(html);
}
