"use client";

import React from "react";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";
import { type SUPPORTED_FIELDS } from "@/lib/constants";

import MultipleChoiceEditor from "../fields/multiple-choice-editor";

function FormFields() {
  const params = useParams();

  const fieldsApi = api.question.getAll.useQuery({
    form_id: params.form as string,
  });

  return (
    <>
      {fieldsApi.data?.map((value) => {
        switch (value.type as SUPPORTED_FIELDS) {
          case "MULTIPLE_CHOICE":
            return <MultipleChoiceEditor key={value.id} {...value} />;
          default:
            return (
              <span key={value.id}>
                Invalid type of question. Recieved {value.type}
              </span>
            );
        }
      })}
    </>
  );
}

export default FormFields;
