
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateAdmin = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const email = "admin@email.com";
  const password = "admin";

  // Check if admin already exists
  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin')
        .single();
      
      if (data) {
        setIsCreated(true);
      }
    } catch (error) {
      console.error("Error checking admin:", error);
    }
  };

  useEffect(() => {
    checkAdminExists();
  }, []);

  const createAdminAccount = async () => {
    setIsCreating(true);
    try {
      // Register the admin user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: "Admin User",
            role: "admin"
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      toast.success("Admin account created successfully!");
      setIsCreated(true);
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsCreating(false);
    }
  };

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Admin Account Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              {isCreated 
                ? "Admin account already exists."
                : "Create an admin account with the following credentials:"}
            </p>
            
            {!isCreated && (
              <div className="bg-muted p-4 rounded-md">
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Password:</strong> {password}</p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              {isCreated ? (
                <Button variant="outline" onClick={() => window.location.href = "/login"}>
                  Go to Login
                </Button>
              ) : (
                <Button 
                  onClick={createAdminAccount} 
                  disabled={isCreating}
                >
                  {isCreating ? "Creating Admin..." : "Create Admin Account"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin;
