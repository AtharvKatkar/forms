"use client";

import React from "react";
import type { Question } from "generated/prisma";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  TextAlignStartIcon,
  TrashIcon,
} from "lucide-react";

import { type SUPPORTED_FIELDS } from "@/lib/constants";
import { api } from "@/trpc/react";
import { usesOptions } from "../constants";
import FieldTypeChanger from "./field-type-changer";

interface QuestionEditorShellProps extends Question {
  children: React.ReactNode;
}

function QuestionEditorShell(props: QuestionEditorShellProps) {
  const utils = api.useUtils();

  const updateApi = api.question.updateQuestion.useMutation({
    onSuccess: async (data) => {
      await utils.question.getAll.invalidate({
        form_id: data.formId,
      });
    },
  });

  const deleteApi = api.question.deleteQuestion.useMutation({
    onSuccess: async (data) => {
      await utils.question.getAll.invalidate({
        form_id: data.formId,
      });
    },
  });

  const moveQuestionApi = api.question.moveQuestion.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: props.formId,
      });
    },
  });

  const isPending =
    updateApi.isPending || deleteApi.isPending || moveQuestionApi.isPending;

  const usesOptionList = usesOptions(props.type);

  const questions = utils.question.getAll.getData({ form_id: props.formId });
  const isFirstQuestion = questions?.at(0)?.id === props.id;
  const isLastQuestion = questions?.at(-1)?.id === props.id;

  return (
    <Card className="w-full">
      <CardContent>
        {/* Title & main settings */}
        <div className="flex items-center gap-3">
          <textarea
            className="focus:border-b-primary w-full resize-none border-b text-lg focus:border-b-2 focus:outline-0"
            placeholder="Question"
            rows={1}
            defaultValue={props.title ?? ""}
            disabled={isPending}
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
          <Button disabled={isPending} variant="ghost" size="icon-lg">
            <ImageIcon />
          </Button>
          <FieldTypeChanger
            type={props.type as SUPPORTED_FIELDS}
            disabled={isPending}
            onValueChange={async (value) => {
              await updateApi.mutateAsync({
                question_id: props.id,
                form_id: props.formId,
                type: value as SUPPORTED_FIELDS,
              });
            }}
          />
        </div>
        {/* description */}
        {props.description && (
          <textarea
            className="focus:border-b-primary w-full resize-none border-b focus:border-b-2 focus:outline-0"
            placeholder="Question description"
            rows={1}
            disabled={isPending}
            defaultValue={props.description}
            onChange={(event) => {
              const textarea = event.currentTarget;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onBlur={async (e) => {
              const value = e.target.value;

              if (!value || value == props.description) return;

              await updateApi.mutateAsync({
                form_id: props.formId,
                question_id: props.id,
                description: value,
              });
            }}
          />
        )}
        {/* field */}
        {props.children}
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-end">
        <Button disabled={isPending} variant="ghost" size="icon-lg">
          <CopyIcon />
        </Button>
        <Button
          disabled={isPending}
          onClick={async () => {
            await deleteApi.mutateAsync({
              form_id: props.formId,
              question_id: props.id,
            });
          }}
          variant="ghost"
          size="icon-lg"
        >
          <TrashIcon />
        </Button>
        <Separator orientation="vertical" className="mx-1.5" />
        <Label>
          Required
          <Switch
            checked={props.required}
            disabled={isPending}
            onCheckedChange={async () => {
              await updateApi.mutateAsync({
                form_id: props.formId,
                question_id: props.id,
                required: !props.required,
              });
            }}
          />
        </Label>
        {usesOptionList && (
          <Label>
            Shuffle options
            <Switch
              checked={props.shuffleOptionOrder}
              disabled={isPending}
              onCheckedChange={async () => {
                await updateApi.mutateAsync({
                  form_id: props.formId,
                  question_id: props.id,
                  shuffleOptionOrder: !props.shuffleOptionOrder,
                });
              }}
            />
          </Label>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
          >
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-45">
            <DropdownMenuItem
              disabled={isPending}
              onClick={async () => {
                await updateApi.mutateAsync({
                  form_id: props.formId,
                  question_id: props.id,
                  description: "Add description",
                });
              }}
            >
              <TextAlignStartIcon />
              Add description
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isPending || isFirstQuestion}
              onClick={async () => {
                await moveQuestionApi.mutateAsync({
                  form_id: props.formId,
                  question_id: props.id,
                  direction: "up",
                });
              }}
            >
              <ChevronUpIcon />
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isPending || isLastQuestion}
              onClick={async () => {
                await moveQuestionApi.mutateAsync({
                  form_id: props.formId,
                  question_id: props.id,
                  direction: "down",
                });
              }}
            >
              <ChevronDownIcon />
              Move down
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

export default QuestionEditorShell;
