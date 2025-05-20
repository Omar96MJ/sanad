
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { Form } from "@/components/ui/form";
import { TherapistInfo } from "./TherapistInfo";
import { useSessionForm, SessionFormData } from "./useSessionForm";
import { SessionTypeField } from "./form-fields/SessionTypeField";
import { DatePickerField } from "./form-fields/DatePickerField";
import { TimePickerField } from "./form-fields/TimePickerField";
import { NotesField } from "./form-fields/NotesField";
import { FormActions } from "./form-fields/FormActions";

// Form schema for validation - export it for use in field components
export const formSchema = z.object({
  sessionType: z.string({
    required_error: "Please select a session type",
  }),
  sessionDate: z.date({
    required_error: "Please select a date",
  }),
  sessionTime: z.string({
    required_error: "Please select a time",
  }),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface SessionModalFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onCancel: () => void;
}

export const SessionModalForm = ({ onSubmit, isLoading, setIsLoading, onCancel }: SessionModalFormProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const { mockDoctor } = useSessionForm({ onClose: onCancel });
  
  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionType: "",
      sessionTime: "",
      notes: "",
    },
    mode: "onSubmit",
  });
  
  // Handle form submission
  const handleFormSubmit = async (values: FormValues) => {
    try {
      // Format the data and submit
      setIsLoading(true);
      
      await onSubmit({
        sessionDate: values.sessionDate,
        sessionTime: values.sessionTime,
        sessionType: values.sessionType,
        notes: values.notes || "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        {/* Therapist info */}
        <TherapistInfo therapist={mockDoctor} />
        
        {/* Session type */}
        <SessionTypeField control={form.control} />
        
        {/* Date selection */}
        <DatePickerField control={form.control} />
        
        {/* Time selection */}
        <TimePickerField control={form.control} />
        
        {/* Notes */}
        <NotesField control={form.control} />
        
        {/* Action buttons */}
        <FormActions isLoading={isLoading} onCancel={onCancel} />
      </form>
    </Form>
  );
};
