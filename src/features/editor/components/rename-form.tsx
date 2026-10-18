"use client";

import React from "react";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";

function RenameForm() {
  const params = useParams();
  const utils = api.useUtils();

  const formApi = api.form.getOne.useQuery({
    id: params.form as string,
  });

  const renameApi = api.form.renameForm.useMutation({
    onSuccess: async (data) => {
      await utils.form.getOne.invalidate({
        id: data.id,
      });
    },
  });

  return (
    <input
      disabled={formApi.isPending || renameApi.isPending}
      defaultValue={formApi.data?.name}
      placeholder="Untitled form"
      className="focus:border-b-primary font-heading border-b-2 border-b-transparent text-lg focus:outline-0 w-fit"
      onBlur={async (e) => {
        const value = e.target.value;

        if (!value || value.length === 0) {
          return;
        }

        await renameApi.mutateAsync({
          id: params.form as string,
          name: value,
        });
      }}
    />
  );
}

export default RenameForm;
