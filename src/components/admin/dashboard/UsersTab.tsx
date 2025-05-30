
import { RefreshCw, Check, X, User, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
  created_at: string;
  assigned_doctor_id?: string | null;
  doctor_info?: {
    specialization?: string;
    status?: string;
    doctor_id?: string;
  };
}

interface UsersTabProps {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  totalUsers: number;
  onRefresh: () => void;
  isRTL: boolean;
  language: string;
}

export const UsersTab = ({ 
  users, 
  isLoading, 
  error, 
  totalUsers, 
  onRefresh, 
  isRTL, 
  language 
}: UsersTabProps) => {
  const { t } = useLanguage();

  const handleDoctorStatusChange = async (userId: string, doctorId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ status: newStatus })
        .eq('id', doctorId);

      if (error) {
        console.error('Error updating doctor status:', error);
        toast.error(t('error_updating_status') || 'Error updating doctor status');
        return;
      }

      toast.success(
        newStatus === 'approved' 
          ? t('doctor_approved') || 'Doctor approved successfully'
          : t('doctor_rejected') || 'Doctor rejected successfully'
      );
      
      // Refresh the users list
      onRefresh();
    } catch (err) {
      console.error('Exception updating doctor status:', err);
      toast.error(t('error_updating_status') || 'Error updating doctor status');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'patient':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US');
  };

  // Separate users by role for better organization
  const doctors = users.filter(user => user.role === 'doctor');
  const patients = users.filter(user => user.role === 'patient');
  const admins = users.filter(user => user.role === 'admin');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('manage_users')}</CardTitle>
            <CardDescription>
              {t('view_and_manage_all_users')}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('refresh') || 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/10 p-4 rounded-md text-center">
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="text-sm text-muted-foreground">{t('total_users')}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
            <div className="text-sm text-muted-foreground">{t('doctors')}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-green-600">{patients.length}</div>
            <div className="text-sm text-muted-foreground">{t('patients')}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-purple-600">{admins.length}</div>
            <div className="text-sm text-muted-foreground">{t('admins')}</div>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserCheck className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('doctors')} ({doctors.length})
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))
            ) : doctors.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {t('no_doctors_found') || 'No doctors found'}
              </div>
            ) : (
              doctors.map((user) => (
                <div key={user.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{user.name}</div>
                    <div className="flex gap-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {t(user.role) || user.role}
                      </Badge>
                      {user.doctor_info?.status && (
                        <Badge className={getStatusBadgeColor(user.doctor_info.status)}>
                          {t(user.doctor_info.status) || user.doctor_info.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {user.email || 'No email provided'}
                  </div>
                  {user.doctor_info?.specialization && (
                    <div className="text-sm text-muted-foreground mb-2">
                      {t('specialization') || 'Specialization'}: {user.doctor_info.specialization}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mb-3">
                    {t('joined') || 'Joined'}: {formatDate(user.created_at)}
                  </div>
                  
                  {/* Action buttons for pending doctors */}
                  {user.doctor_info?.status === 'pending' && user.doctor_info?.doctor_id && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleDoctorStatusChange(user.id, user.doctor_info!.doctor_id!, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('approve') || 'Approve'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDoctorStatusChange(user.id, user.doctor_info!.doctor_id!, 'rejected')}
                      >
                        <X className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {t('reject') || 'Reject'}
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        

        {/* Admins Section */}
        {admins.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('administrators')} ({admins.length})
            </h3>
            <div className="space-y-4">
              {admins.map((user) => (
                <div key={user.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{user.name}</div>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {t(user.role) || user.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {user.email || 'No email provided'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('joined') || 'Joined'}: {formatDate(user.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
