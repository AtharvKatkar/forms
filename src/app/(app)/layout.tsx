import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/server/better-auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

async function AppLayout({ children }: AppLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "discord",
      },
    });

    if (!url) {
      throw new Error("Failed to generate oAuth url");
    }

    redirect(url);
  }

  return children;
}

export default AppLayout;
