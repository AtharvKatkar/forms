import React from "react";
import { headers } from "next/headers";

import { auth } from "@/server/better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function UserButton() {
  const sessionApi = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionApi?.user) {
    return null;
  }

  return (
    <Avatar>
      {sessionApi.user.image && <AvatarImage src={sessionApi.user.image} />}
      <AvatarFallback>
        {sessionApi.user.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserButton;
