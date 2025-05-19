
// Fix for "Module has no default export" errors
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { ProgressSection } from "./ProgressSection"; // Change from default to named import
import { TherapistCard } from "./TherapistCard"; // Change from default to named import
import CalendarAndArticles from "./CalendarAndArticles";

const DashboardOverview = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressSection />
        </div>
        <div>
          <TherapistCard />
        </div>
      </div>
      
      <CalendarAndArticles />
    </div>
  );
};

export default DashboardOverview;
