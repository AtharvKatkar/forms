"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";

function RenameForm() {
  const [name, setName] = useState("Untitled form");

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

  useEffect(() => {
    if(formApi.data?.name){
      setName(formApi.data?.name)
    }
  }, [formApi.data?.name])

  return (
    <input
      disabled={formApi.isPending || renameApi.isPending}
      defaultValue={formApi.data?.name}
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Untitled form"
      size={Math.max(name.length, "Untitled form".length, 1)}
      className="focus:border-b-primary font-heading border-b-2 border-b-transparent text-lg focus:outline-0"
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
