import React from "react";
import type { Question } from "generated/prisma";

import { Input } from "@/components/ui/input";
import QuestionEditorShell from "../components/question-editor-shell";

type ShortAnswerEditorProps = Question;

function ShortAnswerEditor(props: ShortAnswerEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <Input
        readOnly
        disabled
        placeholder="Short answer text"
        className="pointer-events-none mt-3"
      />
    </QuestionEditorShell>
  );
}

export default ShortAnswerEditor;
