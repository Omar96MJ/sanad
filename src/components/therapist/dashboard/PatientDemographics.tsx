
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

type DemographicItem = {
  name: string;
  percentage: number;
};

type PatientDemographicsProps = {
  demographics: DemographicItem[];
};

export const PatientDemographics = ({ demographics }: PatientDemographicsProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-primary" />
          {t('patient_demographics')}
        </CardTitle>
        <CardDescription>{t('patient_overview')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demographics.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{item.name}</span>
              <div className="w-2/3 bg-muted rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
