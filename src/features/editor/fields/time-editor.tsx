import React from "react";
import type { Question } from "generated/prisma";
import { ClockIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import QuestionEditorShell from "../components/question-editor-shell";

type TimeEditorProps = Question;

function TimeEditor(props: TimeEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <div className="pointer-events-none relative mt-3">
        <ClockIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          type="time"
          readOnly
          disabled
          className="pl-8"
          aria-label="Time"
        />
      </div>
    </QuestionEditorShell>
  );
}

export default TimeEditor;
