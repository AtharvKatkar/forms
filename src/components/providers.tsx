import React from "react";

import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/toast";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </>
  );
}

export default Providers;
