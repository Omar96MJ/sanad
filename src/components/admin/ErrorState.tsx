
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="text-center text-destructive">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {t('retry')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
