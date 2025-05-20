
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { TherapistSelect } from "./TherapistSelect";
import { SessionTypeSelect } from "./SessionTypeSelect";
import { DateTimeSelection } from "./DateTimeSelection";
import { SessionNotes } from "./SessionNotes";
import { useSessionBooking } from "./useSessionBooking";

interface SessionBookingFormProps {
  onSuccess?: () => void;
  inDashboard?: boolean;
}

const SessionBookingForm = ({ onSuccess, inDashboard = false }: SessionBookingFormProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const {
    therapists,
    selectedTherapist,
    selectedTherapistDetails,
    eventTypeId,
    selectedDate,
    selectedTime,
    notes,
    loading,
    loadingTherapists,
    loadingSlots,
    availableSlots,
    timeSlots,
    handleTherapistChange,
    handleEventTypeChange,
    handleBookSession,
    setSelectedDate,
    setSelectedTime,
    setNotes
  } = useSessionBooking({ onSuccess, inDashboard });

  return (
    <Card className={`border shadow-sm ${inDashboard ? 'shadow-none border-0' : ''}`}>
      {!inDashboard && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {isRTL ? "حجز جلسة جديدة" : "Schedule a New Session"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "اختر المعالج والتاريخ والوقت المناسب لك"
              : "Select your preferred therapist, date, and time"}
          </CardDescription>
        </CardHeader>
      )}
      
      <CardContent className="space-y-6">
        <TherapistSelect 
          therapists={therapists}
          loadingTherapists={loadingTherapists}
          selectedTherapist={selectedTherapist}
          selectedTherapistDetails={selectedTherapistDetails}
          handleTherapistChange={handleTherapistChange}
        />

        {selectedTherapistDetails && (
          <SessionTypeSelect 
            selectedTherapistDetails={selectedTherapistDetails}
            eventTypeId={eventTypeId}
            handleEventTypeChange={handleEventTypeChange}
          />
        )}

        {eventTypeId && (
          <DateTimeSelection 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            loadingSlots={loadingSlots}
            timeSlots={timeSlots}
          />
        )}

        <SessionNotes 
          notes={notes}
          setNotes={setNotes}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleBookSession} 
          disabled={!selectedTherapist || !eventTypeId || !selectedDate || !selectedTime || loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              {isRTL ? "جاري الحجز..." : "Booking..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {isRTL ? "تأكيد الحجز" : "Confirm Booking"}
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionBookingForm;
