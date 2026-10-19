"use client";

import React from "react";
import {
  CaseSensitiveIcon,
  CirclePlusIcon,
  ImageIcon,
  StretchHorizontalIcon,
} from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";

function EditorActions() {
  const params = useParams();
  const utils = api.useUtils();

  const addQuestionApi = api.question.addQuestion.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: params.form as string,
      });
    },
  });

  const actions = [
    {
      label: "Add question",
      Icon: CirclePlusIcon,
      disabled: addQuestionApi.isPending,
      action: async () => {
        await addQuestionApi.mutateAsync({
          form_id: params.form as string,
        });
      },
    },
    {
      label: "Add title and description",
      Icon: CaseSensitiveIcon,
      action: () => {
        return;
      },
    },
    {
      label: "Add image",
      Icon: ImageIcon,
      action: () => {
        return;
      },
    },
    {
      label: "Add section",
      Icon: StretchHorizontalIcon,
      action: () => {
        return;
      },
    },
  ];

  return (
    <div className="bg-background sticky top-28 flex h-fit flex-col rounded-md border p-1.5 shadow">
      {actions.map((value) => (
        <Tooltip key={value.label}>
          <TooltipTrigger
            render={
              <Button
                disabled={value.disabled}
                variant="ghost"
                size="icon-lg"
                key={value.label}
                onClick={value.action}
              >
                {value.disabled ? <Spinner /> : <value.Icon />}
              </Button>
            }
          />
          <TooltipContent side="right">{value.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export default EditorActions;
