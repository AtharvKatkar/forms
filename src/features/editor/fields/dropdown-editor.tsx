import React from "react";
import type { Question, Option } from "generated/prisma";
import { ChevronDownCircleIcon } from "lucide-react";

import QuestionEditorShell from "../components/question-editor-shell";
import QuestionOptions from "../components/question-options";

interface DropdownEditorProps extends Question {
  options: Option[];
}

function DropdownEditor(props: DropdownEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <QuestionOptions
        formId={props.formId}
        questionId={props.id}
        options={props.options}
        Indicator={ChevronDownCircleIcon}
      />
    </QuestionEditorShell>
  );
}

export default DropdownEditor;
