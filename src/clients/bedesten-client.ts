import { BaseClient } from "./base-client.js";
import { getFullBirimAdi } from "../enums/chambers.js";
import { convertHtmlToMarkdown } from "../converters/html-to-markdown.js";
import type {
  BedestenSearchRequest,
  BedestenSearchResponse,
  BedestenDocumentRequest,
  BedestenDocumentResponse,
  BedestenDocumentMarkdown,
} from "../types/bedesten.js";

export class BedestenClient extends BaseClient {
  private static readonly SEARCH_ENDPOINT = "/emsal-karar/searchDocuments";
  private static readonly DOCUMENT_ENDPOINT = "/emsal-karar/getDocumentContent";

  constructor(timeoutMs?: number) {
    super("https://bedesten.adalet.gov.tr", timeoutMs);
  }

  async searchDocuments(
    request: BedestenSearchRequest
  ): Promise<BedestenSearchResponse> {
    // Map abbreviated birimAdi to full Turkish name
    const mapped = getFullBirimAdi(request.data.birimAdi ?? "ALL");
    const body: Record<string, unknown> = {
      data: {
        ...request.data,
        birimAdi: mapped || undefined,
      },
      applicationName: request.applicationName,
      paging: request.paging,
    };

    // Remove birimAdi if empty
    const data = body.data as Record<string, unknown>;
    if (!data.birimAdi) {
      delete data.birimAdi;
    }

    // Remove empty date fields
    if (!data.kararTarihiStart) delete data.kararTarihiStart;
    if (!data.kararTarihiEnd) delete data.kararTarihiEnd;

    return this.post<BedestenSearchResponse>(
      BedestenClient.SEARCH_ENDPOINT,
      body
    );
  }

  async getDocumentAsMarkdown(
    documentId: string
  ): Promise<BedestenDocumentMarkdown> {
    const request: BedestenDocumentRequest = {
      data: { documentId },
      applicationName: "UyapMevzuat",
    };

    const response = await this.post<BedestenDocumentResponse>(
      BedestenClient.DOCUMENT_ENDPOINT,
      request
    );

    if (!response.data?.content) {
      throw new Error("Document response does not contain content");
    }

    if (!response.data.mimeType) {
      throw new Error("Document response does not contain mimeType");
    }

    // Decode base64 content
    const contentBytes = Buffer.from(response.data.content, "base64");
    const mimeType = response.data.mimeType;
    let markdownContent: string | null = null;

    if (mimeType === "text/html") {
      const html = contentBytes.toString("utf-8");
      markdownContent = convertHtmlToMarkdown(html);
    } else {
      markdownContent = `Unsupported content type: ${mimeType}. Unable to convert to markdown.`;
    }

    return {
      documentId,
      markdownContent,
      sourceUrl: `https://mevzuat.adalet.gov.tr/ictihat/${documentId}`,
      mimeType,
    };
  }
}
