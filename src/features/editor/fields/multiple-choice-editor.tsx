import React from "react";
import type { Question, Option } from "generated/prisma";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type SUPPORTED_FIELDS } from "@/lib/constants";
import { api } from "@/trpc/react";
import FieldTypeChanger from "../components/field-type-changer";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  PlusIcon,
  TextAlignStartIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const addOptionApi = api.question.addOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: props.formId,
      });
    },
  });

  const updateOptionApi = api.question.updateOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: props.formId,
      });
    },
  });

  const deleteOptionApi = api.question.deleteOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: props.formId,
      });
    },
  });

  const moveOptionApi = api.question.moveOption.useMutation({
    onSuccess: async () => {
      await utils.question.getAll.invalidate({
        form_id: props.formId,
      });
    },
  });

  const isPending =
    updateApi.isPending || deleteApi.isPending || moveQuestionApi.isPending;

  // `getAll` comes back ordered by `order`, so the cached list is enough to tell whether a
  // move would be a no-op and the menu item can be disabled instead of erroring on the server.
  const questions = utils.question.getAll.getData({ form_id: props.formId });
  const isFirstQuestion = questions?.at(0)?.id === props.id;
  const isLastQuestion = questions?.at(-1)?.id === props.id;

  return (
    <Card className="w-full">
      <CardContent>
        {/* Title & Main settings */}
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
            defaultValue={props.description ?? ""}
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
                description: value,
              });
            }}
          />
        )}
        {/* Options */}
        <div className="grid gap-3 py-3">
          {props.options.map((value) => (
            <div key={value.id} className="flex items-center gap-3">
              <CircleIcon className="text-muted-foreground size-5" />
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
                disabled={
                  isPending ||
                  deleteOptionApi.isPending ||
                  moveOptionApi.isPending ||
                  props.options?.at(0)?.id === value.id
                }
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
                disabled={
                  isPending ||
                  deleteOptionApi.isPending ||
                  moveOptionApi.isPending ||
                  props.options?.at(-1)?.id === value.id
                }
                onClick={async () => {
                  await moveOptionApi.mutateAsync({
                    id: value.id,
                    direction: "down",
                  });
                }}
              >
                <ChevronDownIcon />
              </Button>
              {props.options.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending || deleteOptionApi.isPending}
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
          disabled={addOptionApi.isPending || isPending}
          onClick={async () => {
            await addOptionApi.mutateAsync({
              question_id: props.id,
            });
          }}
        >
          <PlusIcon />
          Add option
        </Button>
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
            defaultChecked={props.required}
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

export default MultipleChoiceEditor;
