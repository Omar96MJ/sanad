
import { Users, Calendar, ClipboardList, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { StatCard } from "./StatCard";

type DoctorStats = {
  patients_count: number;
  upcoming_sessions: number;
  pending_evaluations: number;
  available_hours: number;
};

type StatsOverviewProps = {
  stats: DoctorStats;
};

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title={t('total_patients')}
        value={stats.patients_count}
        icon={<Users className="h-6 w-6" />}
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-700"
      />
      <StatCard
        title={t('upcoming_sessions')}
        value={stats.upcoming_sessions}
        icon={<Calendar className="h-6 w-6" />}
        iconBgColor="bg-green-100"
        iconTextColor="text-green-700"
      />
      <StatCard
        title={t('pending_evaluations')}
        value={stats.pending_evaluations}
        icon={<ClipboardList className="h-6 w-6" />}
        iconBgColor="bg-amber-100"
        iconTextColor="text-amber-700"
      />
      <StatCard
        title={t('available_hours')}
        value={stats.available_hours}
        icon={<Clock className="h-6 w-6" />}
        iconBgColor="bg-violet-100"
        iconTextColor="text-violet-700"
      />
    </div>
  );
};
