
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormQuestionItem } from "./FormQuestionItem";

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  questions: any[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addQuestion: () => void;
  updateQuestion: (index: number, field: string, value: any) => void;
  removeQuestion: (index: number) => void;
  handleCreateForm: () => void;
}

export const CreateFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  questions,
  setTitle,
  setDescription,
  addQuestion,
  updateQuestion,
  removeQuestion,
  handleCreateForm,
}: CreateFormDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('create_evaluation_form')}</DialogTitle>
          <DialogDescription>
            {t('create_form_description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('form_title')}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enter_form_title')}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('form_description')}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enter_form_description')}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('questions')}</h3>
              <Button 
                type="button" 
                size="sm" 
                onClick={addQuestion}
              >
                {t('add_question')}
              </Button>
            </div>
            
            {questions.map((question, index) => (
              <FormQuestionItem
                key={index}
                question={question}
                index={index}
                updateQuestion={updateQuestion}
                removeQuestion={removeQuestion}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleCreateForm}>
            {t('create_form')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
