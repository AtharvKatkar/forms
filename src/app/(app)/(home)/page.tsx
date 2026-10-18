import React from "react";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { auth } from "@/server/better-auth";

async function HomePage() {
  return (
    <div>
      <Button
        variant="destructive"
        onClick={async () => {
          "use server";

          await auth.api.signOut({
            headers: await headers()
          });
          revalidatePath("/", "layout");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}

export default HomePage;
