
import * as z from "zod";

export type Appointment = {
  id: string;
  patient_id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
};

export const appointmentFormSchema = z.object({
  patient_name: z.string().min(2),
  patient_id: z.string().optional(),
  session_date: z.date(),
  session_time: z.string(),
  session_type: z.string(),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
