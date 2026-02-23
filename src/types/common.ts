export type CourtType =
  | "YARGITAYKARARI"
  | "DANISTAYKARAR"
  | "YERELHUKUK"
  | "ISTINAFHUKUK"
  | "KYB";

export const DEFAULT_COURT_TYPES: CourtType[] = [
  "YARGITAYKARARI",
  "DANISTAYKARAR",
];

export const ALL_COURT_TYPES: CourtType[] = [
  "YARGITAYKARARI",
  "DANISTAYKARAR",
  "YERELHUKUK",
  "ISTINAFHUKUK",
  "KYB",
];
