"use client";

import React from "react";
import { useParams } from "next/navigation";

import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";

function FormTitleCard() {
  const params = useParams();
  const utils = api.useUtils();

  const formApi = api.form.getOne.useQuery({
    id: params.form as string,
  });

  const updateFormApi = api.form.updateForm.useMutation({
    onSuccess: async (data) => {
      await utils.form.getOne.invalidate({
        id: data.id,
      });
    },
  });

  return (
    <Card className="border-t-primary w-full border-t-8">
      <CardContent className="space-y-1.5">
        <input
          disabled={updateFormApi.isPending}
          placeholder="Untitled form"
          defaultValue={formApi.data?.name}
          className="focus:border-b-primary border-b text-4xl transition focus:border-b-2 focus:outline-0"
          onBlur={async (e) => {
            const value = e.target.value;

            if (!value || value === formApi.data?.name) return;

            await updateFormApi.mutateAsync({
              id: params.form as string,
              name: value,
            });
          }}
        />
        <input
          disabled={updateFormApi.isPending}
          placeholder="Form description"
          defaultValue={formApi.data?.description ?? ""}
          className="focus:border-b-primary border-b transition focus:border-b-2 focus:outline-0"
          onBlur={async (e) => {
            const value = e.target.value;

            if (!value || value === formApi.data?.name) return;

            await updateFormApi.mutateAsync({
              id: params.form as string,
              description: value,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}

export default FormTitleCard;
