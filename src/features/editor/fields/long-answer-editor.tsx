import React from "react";
import type { Question } from "generated/prisma";

import { Textarea } from "@/components/ui/textarea";
import QuestionEditorShell from "../components/question-editor-shell";

type LongAnswerEditorProps = Question;

function LongAnswerEditor(props: LongAnswerEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <Textarea
        readOnly
        disabled
        placeholder="Long answer text"
        rows={4}
        className="pointer-events-none mt-3 resize-none"
      />
    </QuestionEditorShell>
  );
}

export default LongAnswerEditor;
