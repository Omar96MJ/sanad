
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import MessagingLayout from "@/components/messaging/MessagingLayout";

export const MessagingTab = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('messaging')}</h2>
      <p className="text-muted-foreground mb-6">
        {t('send_messages_to_your_therapist')}
      </p>
      
      <MessagingLayout isTherapist={false} />
    </div>
  );
};

export default MessagingTab;
