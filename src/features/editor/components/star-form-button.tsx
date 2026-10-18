"use client";

import React from "react";
import { StarIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "cn";

function StarFormButton() {
  const params = useParams();
  const utils = api.useUtils();

  const formApi = api.form.getOne.useQuery({
    id: params.form as string,
  });

  const updateApi = api.form.starForm.useMutation({
    onSuccess: async (data) => {
      await utils.form.getOne.invalidate({
        id: data.id,
      });
    },
  });

  return (
    <Button
      disabled={formApi.isPending || updateApi.isPending}
      variant="ghost"
      size="icon-lg"
      className="rounded-full"
      onClick={async () => {
        if (formApi.data === undefined) return;

        await updateApi.mutateAsync({
          id: params.form as string,
          state: !formApi.data!.stared,
        });
      }}
    >
      {formApi.isPending || updateApi.isPending ? (
        <Spinner />
      ) : (
        <StarIcon className={cn(formApi.data?.stared  ? "text-yellow-500 fill-yellow-500" : "fill-transparent text-foreground")} />
      )}
    </Button>
  );
}

export default StarFormButton;
