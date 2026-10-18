import React from "react";
import type { Question, Option } from "generated/prisma";
import { CircleIcon } from "lucide-react";

import QuestionEditorShell from "../components/question-editor-shell";
import QuestionOptions from "../components/question-options";

interface MultipleChoiceEditorProps extends Question {
  options: Option[];
}

function MultipleChoiceEditor(props: MultipleChoiceEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <QuestionOptions
        formId={props.formId}
        questionId={props.id}
        options={props.options}
        Indicator={CircleIcon}
      />
    </QuestionEditorShell>
  );
}

export default MultipleChoiceEditor;
