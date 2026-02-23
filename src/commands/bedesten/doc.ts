import { Command } from "commander";
import { BedestenClient } from "../../clients/bedesten-client.js";

export const docCommand = new Command("doc")
  .description(
    "Retrieve full text of a legal decision as Markdown. " +
    "Takes a documentId from search results, fetches the document from Bedesten API, " +
    "decodes base64 content, converts HTML to Markdown. Output: JSON to stdout."
  )
  .argument(
    "<documentId>",
    "Document ID (numeric string) obtained from the 'documentId' field in search results"
  )
  .addHelpText(
    "after",
    "\nOutput JSON schema:\n" +
    "  {\n" +
    '    "documentId": string,        // The requested document ID\n' +
    '    "markdownContent": string,   // Full decision text converted to Markdown\n' +
    '    "sourceUrl": string,         // URL: https://mevzuat.adalet.gov.tr/ictihat/<id>\n' +
    '    "mimeType": string           // Original content type (text/html or application/pdf)\n' +
    "  }\n" +
    "\nExamples:\n" +
    '  $ yargi bedesten doc 1123588300\n' +
    '  $ yargi bedesten doc 1123588300 | jq -r \'.markdownContent\'\n' +
    "  $ yargi bedesten search \"test\" | jq -r '.decisions[0].documentId' | xargs yargi bedesten doc\n"
  )
  .action(async (documentId: string) => {
    if (!documentId.trim()) {
      const output = { error: "Document ID must be a non-empty string" };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
      return;
    }

    const client = new BedestenClient();

    try {
      const result = await client.getDocumentAsMarkdown(documentId);
      process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
