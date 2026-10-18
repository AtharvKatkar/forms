import React from "react";
import type { Question, Option } from "generated/prisma";
import { SquareIcon } from "lucide-react";

import QuestionEditorShell from "../components/question-editor-shell";
import QuestionOptions from "../components/question-options";

interface CheckboxesEditorProps extends Question {
  options: Option[];
}

function CheckboxesEditor(props: CheckboxesEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <QuestionOptions
        formId={props.formId}
        questionId={props.id}
        options={props.options}
        Indicator={SquareIcon}
      />
    </QuestionEditorShell>
  );
}

export default CheckboxesEditor;
