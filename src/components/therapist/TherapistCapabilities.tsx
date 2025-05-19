
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  UserCog, 
  CalendarDays, 
  Send, 
  MessageSquare, 
  FileEdit, 
  UserCheck, 
  ClipboardList, 
  ScrollText, 
  PenTool, 
  Trash2, 
  LockKeyhole
} from "lucide-react";

const TherapistCapabilities = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  
  // Define capability categories with their actions
  const capabilityCategories = [
    {
      title: t('profile_management'),
      items: [
        { 
          icon: <UserCog className="h-5 w-5" />, 
          label: t('view_profile'), 
          action: () => navigate('/profile') 
        },
        { 
          icon: <LockKeyhole className="h-5 w-5" />, 
          label: t('reset_password'), 
          action: () => navigate('/forgot-password') 
        }
      ]
    },
    {
      title: t('client_management'),
      items: [
        { 
          icon: <FileText className="h-5 w-5" />, 
          label: t('view_medical_records'), 
          action: () => navigate('/therapist-dashboard?tab=patients') 
        },
        { 
          icon: <FileEdit className="h-5 w-5" />, 
          label: t('update_medical_records'), 
          action: () => navigate('/therapist-dashboard?tab=patients')
        },
        { 
          icon: <UserCheck className="h-5 w-5" />, 
          label: t('transfer_client'), 
          action: () => navigate('/therapist-dashboard?tab=patients')
        }
      ]
    },
    {
      title: t('session_management'),
      items: [
        { 
          icon: <MessageSquare className="h-5 w-5" />, 
          label: t('conduct_sessions'), 
          action: () => navigate('/therapist-dashboard?tab=sessions') 
        },
        { 
          icon: <ClipboardList className="h-5 w-5" />, 
          label: t('session_notes'), 
          action: () => navigate('/therapist-dashboard?tab=sessions')
        },
        { 
          icon: <CalendarDays className="h-5 w-5" />, 
          label: t('view_schedule'), 
          action: () => navigate('/therapist-dashboard?tab=sessions')
        },
        { 
          icon: <ScrollText className="h-5 w-5" />, 
          label: t('update_availability'), 
          action: () => navigate('/therapist-dashboard?tab=availability')
        }
      ]
    },
    {
      title: t('blog_management'),
      items: [
        { 
          icon: <PenTool className="h-5 w-5" />, 
          label: t('publish_blog'), 
          action: () => navigate('/blog/new') 
        },
        { 
          icon: <FileEdit className="h-5 w-5" />, 
          label: t('update_blog'), 
          action: () => navigate('/blog?tab=my-posts') 
        },
        { 
          icon: <Trash2 className="h-5 w-5" />, 
          label: t('delete_blog'), 
          action: () => navigate('/blog?tab=my-posts')
        }
      ]
    },
    {
      title: t('registration'),
      items: [
        { 
          icon: <Send className="h-5 w-5" />, 
          label: t('submit_registration'), 
          action: () => navigate('/therapist-registration') 
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('therapist_capabilities')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capabilityCategories.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>
                {category.items.length} {t('available_actions')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="w-full justify-start gap-2 text-left"
                    onClick={item.action}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TherapistCapabilities;
