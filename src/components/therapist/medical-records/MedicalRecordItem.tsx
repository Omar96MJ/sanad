
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicalRecord } from "@/components/therapist/medical-records/types";

interface MedicalRecordItemProps {
  record: MedicalRecord;
  onEditClick: (record: MedicalRecord) => void;
}

const MedicalRecordItem = ({ record, onEditClick }: MedicalRecordItemProps) => {
  return (
    <Card key={record.id} className="bg-muted/30">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold">{record.recordType}</p>
            <p className="text-sm text-muted-foreground">{record.date} • {record.therapistName}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEditClick(record)}
          >
            Edit
          </Button>
        </div>
        <p className="whitespace-pre-wrap mt-2">{record.content}</p>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordItem;
