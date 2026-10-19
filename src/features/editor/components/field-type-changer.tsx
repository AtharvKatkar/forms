"use client";

import React from "react";

import type { SUPPORTED_FIELDS } from "@/lib/constants";
import { SUPPORTED_FIELD_SELECT_ITEMS } from "../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FieldTypeChanger({
  type,
  onValueChange,
  disabled,
}: {
  type: SUPPORTED_FIELDS;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange: (value: any) => Promise<void>;
  disabled: boolean;
}) {
  return (
    <Select
      items={SUPPORTED_FIELD_SELECT_ITEMS}
      defaultValue={type}
      value={type}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Question type" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_FIELD_SELECT_ITEMS.map((value) => (
          <SelectItem key={value.label} value={value.value}>
            <value.Icon />
            {value.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FieldTypeChanger;
