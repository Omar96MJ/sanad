
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import DashboardOverview from "@/components/patient/dashboard/DashboardOverview";
import { AppointmentsTab } from "@/components/patient/dashboard/AppointmentsTab";
import { ResourcesTab } from "@/components/patient/dashboard/ResourcesTab";
import { MessagingTab } from "@/components/patient/dashboard/MessagingTab";

export const TabContents = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <TabsContent value="overview" className="py-4">
        <DashboardOverview />
      </TabsContent>
      
      <TabsContent value="appointments" className="py-4">
        <AppointmentsTab />
      </TabsContent>
      
      <TabsContent value="resources" className="py-4">
        <ResourcesTab />
      </TabsContent>
      
      <TabsContent value="messaging" className="py-4">
        <MessagingTab />
      </TabsContent>
    </>
  );
};

export default TabContents;
