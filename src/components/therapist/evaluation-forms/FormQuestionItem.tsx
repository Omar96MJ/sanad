
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormQuestionItemProps {
  question: {
    type: string;
    question: string;
    options?: string[];
    scaleRange?: { min: number; max: number };
  };
  index: number;
  updateQuestion: (index: number, field: string, value: any) => void;
  removeQuestion: (index: number) => void;
}

export const FormQuestionItem = ({
  question,
  index,
  updateQuestion,
  removeQuestion,
}: FormQuestionItemProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 p-4 border rounded-md">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{t('question')} #{index + 1}</h4>
        <Button 
          type="button" 
          variant="destructive" 
          size="sm"
          onClick={() => removeQuestion(index)}
        >
          {t('remove')}
        </Button>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('question_text')}</label>
        <Input
          value={question.question}
          onChange={(e) => updateQuestion(index, 'question', e.target.value)}
          placeholder={t('enter_question')}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('question_type')}</label>
        <select 
          className="w-full p-2 border rounded"
          value={question.type}
          onChange={(e) => updateQuestion(index, 'type', e.target.value)}
        >
          <option value="text">{t('text_input')}</option>
          <option value="multiple-choice">{t('multiple_choice')}</option>
          <option value="scale">{t('scale')}</option>
          <option value="boolean">{t('yes_no')}</option>
        </select>
      </div>
      
      {question.type === 'multiple-choice' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('options')}</label>
          <Textarea
            placeholder={t('enter_options')}
            value={question.options?.join('\n') || ''}
            onChange={(e) => updateQuestion(index, 'options', e.target.value.split('\n'))}
          />
          <p className="text-xs text-muted-foreground">{t('one_option_per_line')}</p>
        </div>
      )}
      
      {question.type === 'scale' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('min_value')}</label>
            <Input
              type="number"
              value={question.scaleRange?.min}
              onChange={(e) => updateQuestion(index, 'scaleRange', {
                ...question.scaleRange,
                min: parseInt(e.target.value)
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('max_value')}</label>
            <Input
              type="number"
              value={question.scaleRange?.max}
              onChange={(e) => updateQuestion(index, 'scaleRange', {
                ...question.scaleRange,
                max: parseInt(e.target.value)
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
