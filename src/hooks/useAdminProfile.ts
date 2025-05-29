
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AdminSettings {
  id: string;
  user_id: string;
  permissions: {
    manageUsers: boolean;
    manageContent: boolean;
    manageSettings: boolean;
  };
  created_at: string;
  updated_at: string;
}

export const useAdminProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  const fetchAdminSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin settings:', error);
        return;
      }

      if (data) {
        setAdminSettings(data);
      } else {
        // Create default admin settings if they don't exist
        const defaultSettings = {
          user_id: user.id,
          permissions: {
            manageUsers: true,
            manageContent: true,
            manageSettings: true
          }
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('admin_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating admin settings:', insertError);
        } else {
          setAdminSettings(newSettings);
        }
      }
    } catch (err) {
      console.error('Exception fetching admin settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, profileImage?: string) => {
    if (!user) return false;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name,
          ...(profileImage && { profile_image: profileImage })
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }

      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error('Exception updating profile:', err);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermissions = async (permissions: AdminSettings['permissions']) => {
    if (!user || !adminSettings) return false;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('admin_settings')
        .update({ permissions })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating permissions:', error);
        toast.error('Failed to update permissions');
        return false;
      }

      setAdminSettings(prev => prev ? { ...prev, permissions } : null);
      toast.success('Permissions updated successfully');
      return true;
    } catch (err) {
      console.error('Exception updating permissions:', err);
      toast.error('Failed to update permissions');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload image');
        return null;
      }

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      console.error('Exception uploading image:', err);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, [user]);

  return {
    adminSettings,
    isLoading,
    updateProfile,
    updatePermissions,
    uploadProfileImage,
    refreshSettings: fetchAdminSettings
  };
};
