
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Doctor, Patient } from "@/lib/types";

interface DoctorCardProps {
  doctor: Doctor;
}

interface PatientCardProps {
  patient: Patient;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden h-full card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={doctor.profileImage} alt={doctor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {doctor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
          <p className="text-primary font-medium mb-2">{doctor.specialization}</p>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{doctor.bio}</p>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-lg font-semibold">{doctor.patients}</p>
              <p className="text-xs text-muted-foreground">Patients</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-lg font-semibold">{doctor.yearsOfExperience}</p>
              <p className="text-xs text-muted-foreground">Experience</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PatientCard = ({ patient }: PatientCardProps) => {
  return (
    <Card className="overflow-hidden h-full card-hover">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={patient.profileImage} alt={patient.name} />
            <AvatarFallback className="bg-secondary/10 text-secondary-foreground text-lg">
              {patient.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className="text-muted-foreground text-sm">{patient.email}</p>
            
            {patient.assignedDoctor && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Doctor:</span>{" "}
                <span className="font-medium">{patient.assignedDoctor}</span>
              </div>
            )}
            
            {patient.upcomingAppointment && (
              <div className="mt-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full inline-block">
                Next Appointment: {patient.upcomingAppointment}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
