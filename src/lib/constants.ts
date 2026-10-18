export const SUPPORTED_FIELDS = [
  "MULTIPLE_CHOICE",
  "SHORT_ANSWER",
  "LONG_ANSWER",
  "CHECKBOXES",
  "DROPDOWN",
  "FILE_UPLOAD",
  "RATING",
  "DATE",
  "TIME",
] as const;

export type SUPPORTED_FIELDS = (typeof SUPPORTED_FIELDS)[number];
