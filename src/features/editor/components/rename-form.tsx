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

  // Uncontrolled: `defaultValue` alone seeds the field once the form resolves, and `size` keeps
  // the input growing with the name instead of clipping it or leaving a gap. A controlled
  // `value` would fight the server value while a rename is in flight.
  const name = formApi.data?.name ?? "Untitled form";

  return (
    <input
      key={name}
      disabled={formApi.isPending || renameApi.isPending}
      defaultValue={name}
      placeholder="Untitled form"
      size={Math.max(name.length, "Untitled form".length, 1)}
      className="focus:border-b-primary font-heading border-b-2 border-b-transparent text-lg focus:outline-0"
      onBlur={async (e) => {
        const value = e.target.value.trim();

        if (!value || value === name) {
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
