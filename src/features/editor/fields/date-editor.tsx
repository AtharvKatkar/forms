import React from "react";
import type { Question } from "generated/prisma";
import { Calendar1Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import QuestionEditorShell from "../components/question-editor-shell";

type DateEditorProps = Question;

function DateEditor(props: DateEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <Button
        disabled
        variant="outline"
        size="lg"
        className="pointer-events-none mt-3 w-full justify-start font-normal"
      >
        <Calendar1Icon className="text-muted-foreground" />
        <span className="text-muted-foreground">MM/DD/YYYY</span>
      </Button>
    </QuestionEditorShell>
  );
}

export default DateEditor;
