"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Option } from "generated/prisma";

interface QuestionOptionsProps {
  formId: string;
  questionId: string;
  options: Option[];
  Indicator: LucideIcon;
}

function QuestionOptions({
  formId,
  questionId,
  options,
  Indicator,
}: QuestionOptionsProps) {
  const utils = api.useUtils();

  const addOptionApi = api.question.addOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: formId,
      });
    },
  });

  const updateOptionApi = api.question.updateOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: formId,
      });
    },
  });

  const deleteOptionApi = api.question.deleteOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: formId,
      });
    },
  });

  const moveOptionApi = api.question.moveOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: formId,
      });
    },
  });

  const isPending = deleteOptionApi.isPending || moveOptionApi.isPending;

  return (
    <>
      <div className="grid gap-3 py-3">
        {options.map((value) => (
          <div key={value.id} className="flex items-center gap-3">
            <Indicator className="text-muted-foreground size-5" />
            <input
              className="focus:border-b-primary w-full resize-none border-b border-b-transparent focus:border-b-2 focus:outline-0"
              defaultValue={value.name}
              onBlur={async (e) => {
                const option = e.target.value;

                if (!option || option === value.name) return;

                await updateOptionApi.mutateAsync({
                  id: value.id,
                  name: option,
                });
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending || options.at(0)?.id === value.id}
              onClick={async () => {
                await moveOptionApi.mutateAsync({
                  id: value.id,
                  direction: "up",
                });
              }}
            >
              <ChevronUpIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending || options.at(-1)?.id === value.id}
              onClick={async () => {
                await moveOptionApi.mutateAsync({
                  id: value.id,
                  direction: "down",
                });
              }}
            >
              <ChevronDownIcon />
            </Button>
            {options.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                disabled={deleteOptionApi.isPending}
                onClick={async () => {
                  await deleteOptionApi.mutateAsync({
                    id: value.id,
                  });
                }}
              >
                <XIcon />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-fit text-blue-500 hover:text-blue-600"
        disabled={addOptionApi.isPending}
        onClick={async () => {
          await addOptionApi.mutateAsync({
            question_id: questionId,
          });
        }}
      >
        <PlusIcon />
        Add option
      </Button>
    </>
  );
}

export default QuestionOptions;
