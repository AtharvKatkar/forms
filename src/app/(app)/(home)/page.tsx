import React from "react";

import Templates from "@/features/home/components/templates";
import RecentForms from "@/features/home/components/recent-forms";

async function HomePage() {
  return (
    <div className="flex flex-col">
      <Templates />
      <RecentForms />
    </div>
  );
}

export default HomePage;
