
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
};

export const StatCard = ({ title, value, icon, iconBgColor, iconTextColor }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconBgColor} ${iconTextColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
