
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EvaluationForm } from "@/lib/therapist-types";
import { Search, FilePlus, FileText, FileCheck } from "lucide-react";

interface FormListProps {
  forms: EvaluationForm[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCreateForm: () => void;
  onAssignForm: (form: EvaluationForm) => void;
  onViewResults: (form: EvaluationForm) => void;
}

export const FormList = ({
  forms,
  searchTerm,
  setSearchTerm,
  onCreateForm,
  onAssignForm,
  onViewResults,
}: FormListProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('evaluation_forms')}
          </div>
          <Button onClick={onCreateForm}>
            <FilePlus className="h-4 w-4 mr-1" />
            {t('create_form')}
          </Button>
        </CardTitle>
        <CardDescription className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_forms')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('created_at')}</TableHead>
                <TableHead>{t('questions')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t('no_forms_found')}
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell>{form.description.substring(0, 50)}{form.description.length > 50 ? '...' : ''}</TableCell>
                    <TableCell>{form.createdAt}</TableCell>
                    <TableCell>{form.questions.length}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onAssignForm(form)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          {t('assign')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewResults(form)}
                        >
                          <FileCheck className="h-4 w-4 mr-1" />
                          {t('results')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
