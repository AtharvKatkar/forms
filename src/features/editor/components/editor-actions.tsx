"use client";

import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  CaseSensitiveIcon,
  CirclePlusIcon,
  ImageIcon,
  StretchHorizontalIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function EditorActions() {
  const actions = [
    {
      label: "Add question",
      Icon: CirclePlusIcon,
      action: () => {
        return;
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
    <div className="bg-background shadow border flex flex-col rounded-md p-1.5 h-fit sticky top-28">
        {actions.map((value) => (
          <Tooltip key={value.label}>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  key={value.label}
                  onClick={value.action}
                >
                  <value.Icon />
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
