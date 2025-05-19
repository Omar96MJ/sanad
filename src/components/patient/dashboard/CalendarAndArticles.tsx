
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { BlogPost } from "@/lib/types";
import { CalendarIcon } from "lucide-react";

export interface CalendarAndArticlesProps {
  isVisible: boolean;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  calendarLocale: any;
  mockArticles: BlogPost[];
  handleBookAppointment: () => void;
}

export const CalendarAndArticles: React.FC<CalendarAndArticlesProps> = ({
  isVisible,
  date,
  setDate,
  calendarLocale,
  mockArticles,
  handleBookAppointment
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in-50 duration-500" 
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s' }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t('calendar')}</span>
            <Button variant="outline" size="sm" onClick={handleBookAppointment}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t('book_appointment')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto"
            locale={calendarLocale}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('recent_posts')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockArticles.slice(0, 2).map((article, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium line-clamp-2 mb-1">{article.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarAndArticles;
