
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from "lucide-react";
import { PsyToolkitTest } from '@/data/psyToolkitTests';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

interface TestViewerProps {
  test: PsyToolkitTest;
  onBack: () => void;
}

const TestViewer: React.FC<TestViewerProps> = ({ test, onBack }) => {
  const { t } = useLanguage();
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleIframeLoad = () => {
    setIframeLoading(false);
    toast.success(t('test_loaded'));
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    toast.error(t('test_load_error') || 'Failed to load test. Please try again later.');
  };

  const openExternalTest = () => {
    window.open(test.embedUrl, '_blank', 'noopener,noreferrer');
    toast.info(t('opening_external_test') || 'Opening test in a new tab');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{test.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openExternalTest}>
            <ExternalLink size={16} className="mr-1" />
            {t('open_in_new_tab') || 'Open in new tab'}
          </Button>
          <Button variant="outline" onClick={onBack}>{t('back_to_tests')}</Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0 h-[600px] relative">
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>{t('loading_test')}</p>
              </div>
            </div>
          )}
          <div className="h-full flex items-center justify-center">
            <iframe
              src={test.embedUrl}
              title={test.name}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            ></iframe>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <p>{t('psytoolkit_attribution')}</p>
        <a 
          href="https://www.psytoolkit.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center hover:underline"
        >
          PsyToolkit <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default TestViewer;
