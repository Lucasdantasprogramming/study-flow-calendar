
import { useAuth } from "@/context/AuthContext";
import MainLayout from "../components/layouts/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <h1 className="text-3xl font-bold mb-6">Perfil</h1>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={48} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">{currentUser?.name}</CardTitle>
              <CardDescription className="text-center">{currentUser?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">ID do Usuário</span>
                  <span className="text-muted-foreground text-sm">{currentUser?.id}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                Sair da Conta
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
