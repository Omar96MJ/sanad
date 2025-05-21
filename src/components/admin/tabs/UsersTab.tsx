
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface UsersTabProps {
  users: any[];
}

const UsersTab = ({ users }: UsersTabProps) => {
  const { t } = useLanguage();

  const handleExportCsv = () => {
    try {
      // Create CSV header
      const headers = [t('name'), t('email'), t('role')];
      
      // Transform users data to CSV format
      const csvData = users.map(user => [
        user.name || '',
        user.email || '',
        t(user.role) || ''
      ]);
      
      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create a Blob containing the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a link to download the CSV file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download and cleanup
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(t('export_successful'));
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error(t('export_failed'));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('manage_users')}</CardTitle>
          <CardDescription>
            {t('view_and_manage_all_users')}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCsv} 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {t('export_csv')}
        </Button>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('role')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="bg-secondary/20 text-xs inline-block px-2 py-1 rounded-full">
                      {t(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">{t('view')}</Button>
                      <Button variant="outline" size="sm">{t('manage')}</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {t('no_users_found')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTab;
