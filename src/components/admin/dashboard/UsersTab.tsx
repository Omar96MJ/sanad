
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US');
  };

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
        
        <div className="mb-4">
          <div className="bg-primary/10 p-4 rounded-md flex justify-between items-center">
            <div>
              <h3 className="font-medium">{t('authenticated_users')}</h3>
              <p className="text-sm text-muted-foreground">{t('total_registered_users')}</p>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-8" />
            ) : (
              <div className="text-3xl font-bold">{totalUsers}</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
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
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('no_users_found') || 'No users found'}
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {t(user.role) || user.role}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {user.email || 'No email provided'}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {t('joined') || 'Joined'}: {formatDate(user.created_at)}
                </div>
                {user.role === 'doctor' && user.doctor_info && (
                  <div className="text-xs text-muted-foreground mb-2">
                    {t('specialization') || 'Specialization'}: {user.doctor_info.specialization || 'Not specified'} | 
                    {t('status') || 'Status'}: {user.doctor_info.status || 'pending'}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">{t('view_resources')}</Button>
                  <Button variant="outline" size="sm">{t('manage_content')}</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
