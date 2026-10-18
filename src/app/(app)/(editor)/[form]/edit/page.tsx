"use client";

import React from "react";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";

function EditFormPage() {
  const params = useParams();

  const formApi = api.form.getOne.useQuery({
    id: params.form as string,
  });

  return (
    <div>
      <pre>
        <code>{JSON.stringify(formApi.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export default EditFormPage;
