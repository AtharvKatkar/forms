import {
  Calendar1Icon,
  ChevronDownCircleIcon,
  CircleDotIcon,
  ClockIcon,
  CloudUploadIcon,
  ListSortAscendingIcon,
  SquareCheckIcon,
  StarIcon,
  TextAlignJustifyStartIcon,
  type LucideIcon,
} from "lucide-react";

import { type SUPPORTED_FIELDS } from "@/lib/constants";

/**
 * Field types whose answer is picked from a list of `Option` rows. Only these render an option
 * list, so `shuffleOptionOrder` is meaningless on anything else and stays hidden.
 */
export const OPTION_BASED_FIELDS = [
  "MULTIPLE_CHOICE",
  "CHECKBOXES",
  "DROPDOWN",
] as const satisfies readonly SUPPORTED_FIELDS[];

export function usesOptions(type: string): boolean {
  return (OPTION_BASED_FIELDS as readonly string[]).includes(type);
}

export const SUPPORTED_FIELD_SELECT_ITEMS: {
  label: string;
  Icon: LucideIcon;
  value: SUPPORTED_FIELDS;
}[] = [
  {
    label: "Short answer",
    Icon: ListSortAscendingIcon,
    value: "SHORT_ANSWER",
  },
  {
    label: "Long answer",
    Icon: TextAlignJustifyStartIcon,
    value: "LONG_ANSWER",
  },
  {
    label: "Multiple choice",
    Icon: CircleDotIcon,
    value: "MULTIPLE_CHOICE",
  },
  {
    label: "Checkboxes",
    Icon: SquareCheckIcon,
    value: "CHECKBOXES",
  },
  {
    label: "Dropdown",
    Icon: ChevronDownCircleIcon,
    value: "DROPDOWN",
  },
  {
    label: "File upload",
    Icon: CloudUploadIcon,
    value: "FILE_UPLOAD",
  },
  {
    label: "Rating",
    Icon: StarIcon,
    value: "RATING",
  },
  {
    label: "Date",
    Icon: Calendar1Icon,
    value: "DATE",
  },
  {
    label: "Time",
    Icon: ClockIcon,
    value: "TIME",
  },
];
