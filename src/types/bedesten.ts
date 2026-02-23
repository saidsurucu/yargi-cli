import type { CourtType } from "./common.js";

// Search Request
export interface BedestenSearchData {
  pageSize: number;
  pageNumber: number;
  itemTypeList: CourtType[];
  phrase: string;
  birimAdi?: string;
  kararTarihiStart?: string;
  kararTarihiEnd?: string;
  sortFields: string[];
  sortDirection: string;
}

export interface BedestenSearchRequest {
  data: BedestenSearchData;
  applicationName: string;
  paging: boolean;
}

// Search Response
export interface BedestenItemType {
  name: string;
  description: string;
}

export interface BedestenDecisionEntry {
  documentId: string;
  itemType: BedestenItemType;
  birimId?: string | null;
  birimAdi?: string | null;
  esasNoYil?: number | null;
  esasNoSira?: number | null;
  kararNoYil?: number | null;
  kararNoSira?: number | null;
  kararTuru?: string | null;
  kararTarihi: string;
  kararTarihiStr: string;
  kesinlesmeDurumu?: string | null;
  kararNo?: string | null;
  esasNo?: string | null;
}

export interface BedestenSearchDataResponse {
  emsalKararList: BedestenDecisionEntry[];
  total: number;
  start: number;
}

export interface BedestenSearchResponse {
  data: BedestenSearchDataResponse | null;
  metadata: Record<string, unknown>;
}

// Document Request
export interface BedestenDocumentRequestData {
  documentId: string;
}

export interface BedestenDocumentRequest {
  data: BedestenDocumentRequestData;
  applicationName: string;
}

// Document Response
export interface BedestenDocumentData {
  content: string;
  mimeType: string;
  version: number;
}

export interface BedestenDocumentResponse {
  data: BedestenDocumentData;
  metadata: Record<string, unknown>;
}

// Processed document output
export interface BedestenDocumentMarkdown {
  documentId: string;
  markdownContent: string | null;
  sourceUrl: string;
  mimeType: string;
}

// CLI search output
export interface BedestenSearchOutput {
  decisions: BedestenDecisionEntry[];
  totalRecords: number;
  requestedPage: number;
  pageSize: number;
  searchedCourts: CourtType[];
  error?: string;
}
