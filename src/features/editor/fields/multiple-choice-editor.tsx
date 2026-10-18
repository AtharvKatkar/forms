import React from "react";
import type { Question, Option } from "generated/prisma";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_FIELDS } from "@/lib/constants";
import { api } from "@/trpc/react";
import { SUPPORTED_FIELD_SELECT_ITEMS } from "../constants";

interface MultipleChoiceEditorProps extends Question {
  options: Option[];
}

function MultipleChoiceEditor(props: MultipleChoiceEditorProps) {
  const utils = api.useUtils();

  const updateApi = api.question.updateQuestion.useMutation({
    onSuccess: async (data) => {
      await utils.question.getAll.invalidate({
        form_id: data.formId,
      });
    },
  });

  return (
    <Card className="w-full">
      <CardContent>
        {/* Title & Main settings */}
        <div className="flex items-center gap-3">
          <textarea
            className="focus:border-b-primary w-full resize-none border-b text-lg focus:border-b-2 focus:outline-0"
            placeholder="Question"
            rows={1}
            onChange={(event) => {
              const textarea = event.currentTarget;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onBlur={async (e) => {
              const value = e.target.value;

              if (!value || value == props.title) return;

              await updateApi.mutateAsync({
                form_id: props.formId,
                question_id: props.id,
                title: value,
              });
            }}
          />
          <Select
            items={SUPPORTED_FIELD_SELECT_ITEMS}
            defaultValue={props.type}
            value={props.type}
            onValueChange={async (value) => {
              await updateApi.mutateAsync({
                question_id: props.id,
                form_id: props.formId,
                type: value as SUPPORTED_FIELDS,
              });
            }}
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
        </div>
      </CardContent>
    </Card>
  );
}

export default MultipleChoiceEditor;
