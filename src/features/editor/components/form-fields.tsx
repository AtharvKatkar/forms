"use client";

import React from "react";
import { useParams } from "next/navigation";

import { api, type RouterOutputs } from "@/trpc/react";
import { type SUPPORTED_FIELDS } from "@/lib/constants";

import CheckboxesEditor from "../fields/checkboxes-editor";
import DateEditor from "../fields/date-editor";
import DropdownEditor from "../fields/dropdown-editor";
import FileUploadEditor from "../fields/file-upload-editor";
import LongAnswerEditor from "../fields/long-answer-editor";
import MultipleChoiceEditor from "../fields/multiple-choice-editor";
import RatingEditor from "../fields/rating-editor";
import ShortAnswerEditor from "../fields/short-answer-editor";
import TimeEditor from "../fields/time-editor";

type Field = RouterOutputs["question"]["getAll"][number];

const FIELD_EDITORS = {
  SHORT_ANSWER: ShortAnswerEditor,
  LONG_ANSWER: LongAnswerEditor,
  MULTIPLE_CHOICE: MultipleChoiceEditor,
  CHECKBOXES: CheckboxesEditor,
  DROPDOWN: DropdownEditor,
  FILE_UPLOAD: FileUploadEditor,
  RATING: RatingEditor,
  DATE: DateEditor,
  TIME: TimeEditor,
} satisfies Record<SUPPORTED_FIELDS, React.ComponentType<Field>>;

function FormFields() {
  const params = useParams();

  const fieldsApi = api.question.getAll.useQuery({
    form_id: params.form as string,
  });

  return (
    <>
      {fieldsApi.data?.map((value) => {
        const Editor = FIELD_EDITORS[value.type as SUPPORTED_FIELDS];

        if (!Editor) {
          return (
            <span key={value.id}>
              Invalid type of question. Recieved {value.type}
            </span>
          );
        }

        return <Editor key={value.id} {...value} />;
      })}
    </>
  );
}

export default FormFields;
