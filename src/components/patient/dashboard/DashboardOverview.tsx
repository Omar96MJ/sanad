
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { ProgressSection } from "./ProgressSection";
import { TherapistCard } from "./TherapistCard";
import { CalendarAndArticles } from "./CalendarAndArticles";
import { BlogPost } from "@/lib/types";

interface DashboardOverviewProps {
  isVisible: boolean;
  progress: number;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  handleBookAppointment: () => void;
  handleStartTherapy: () => void;
  calendarLocale: any;
  mockArticles: BlogPost[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  isVisible,
  progress,
  date,
  setDate,
  handleBookAppointment,
  handleStartTherapy,
  calendarLocale,
  mockArticles
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressSection 
            isVisible={isVisible} 
            progress={progress} 
            handleStartTherapy={handleStartTherapy} 
          />
        </div>
        <div>
          <TherapistCard isVisible={isVisible} />
        </div>
      </div>
      
      <CalendarAndArticles 
        isVisible={isVisible}
        date={date}
        setDate={setDate}
        calendarLocale={calendarLocale}
        mockArticles={mockArticles}
        handleBookAppointment={handleBookAppointment}
      />
    </div>
  );
};

export default DashboardOverview;
