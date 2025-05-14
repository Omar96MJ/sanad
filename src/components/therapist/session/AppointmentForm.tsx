
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const formSchema = z.object({
  patient_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  session_date: z.date({ required_error: "Please select a date." }),
  session_time: z.string({ required_error: "Please select a time." }),
  session_type: z.string({ required_error: "Please select a session type." }),
  notes: z.string().optional(),
});

type AppointmentFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isSaving: boolean;
};

export const AppointmentForm = ({ onSubmit, isSaving }: AppointmentFormProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_name: "",
      session_date: undefined,
      session_time: "",
      session_type: "",
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('patient_name')}</FormLabel>
              <FormControl>
                <Input {...field} className={isRTL ? 'text-right' : 'text-left'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="session_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('date')}</FormLabel>
                <Dialog>
                  <DialogContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={dateLocale}
                    />
                  </DialogContent>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${field.value ? "text-foreground" : "text-muted-foreground"}`}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP", { locale: dateLocale })
                    ) : (
                      <span>{t('pick_a_date')}</span>
                    )}
                  </Button>
                </Dialog>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="session_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('time')}</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="session_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('session_type')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_session_type')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="initial">
                    {t('initial_consultation')}
                  </SelectItem>
                  <SelectItem value="followup">
                    {t('follow_up')}
                  </SelectItem>
                  <SelectItem value="therapy">
                    {t('therapy_session')}
                  </SelectItem>
                  <SelectItem value="assessment">
                    {t('assessment')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('session_notes_placeholder')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              t('save')
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
