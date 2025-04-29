
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "../components/layouts/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Camera, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";

const ProfilePage = () => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  const handleSaveProfile = async () => {
    await updateProfile({ name });
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                      {currentUser?.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt="Profile" 
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-primary" />
                      )}
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    >
                      <Camera size={14} />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-center">{currentUser?.name}</CardTitle>
                <CardDescription className="text-center">{currentUser?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">ID do Usuário</span>
                    <span className="text-muted-foreground text-sm truncate max-w-[150px]">{currentUser?.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Membro desde</span>
                    <span className="text-muted-foreground text-sm">Abril 2023</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sair da Conta
                </Button>
              </CardFooter>
            </Card>

            {/* Settings */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Settings size={18} /> Configurações
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="account">
                  <TabsList className="mb-4">
                    <TabsTrigger value="account">Conta</TabsTrigger>
                    <TabsTrigger value="preferences">Preferências</TabsTrigger>
                    <TabsTrigger value="notifications">Notificações</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="account" className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setName(currentUser?.name || "");
                              setIsEditing(false);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveProfile}>Salvar</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Nome</Label>
                          <p className="text-lg">{currentUser?.name}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-muted-foreground">Email</Label>
                          <p className="text-lg">{currentUser?.email}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={() => setIsEditing(true)}>
                            Editar Perfil
                          </Button>
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="theme-mode">Tema Escuro</Label>
                          <p className="text-muted-foreground text-sm">Alterar entre tema claro e escuro</p>
                        </div>
                        <Switch 
                          id="theme-mode" 
                          checked={theme === "dark"} 
                          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Metas de Estudo</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="daily-goal">Meta Diária (horas)</Label>
                            <Input id="daily-goal" type="number" defaultValue={4} min={0} max={24} />
                          </div>
                          <div>
                            <Label htmlFor="weekly-goal">Meta Semanal (horas)</Label>
                            <Input id="weekly-goal" type="number" defaultValue={28} min={0} max={168} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Notificações por Email</Label>
                          <p className="text-muted-foreground text-sm">Receba lembretes de tarefas pendentes</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="browser-notifications">Notificações no Navegador</Label>
                          <p className="text-muted-foreground text-sm">Receba alertas no navegador</p>
                        </div>
                        <Switch id="browser-notifications" />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="reminder-time">Lembrete Antecipado</Label>
                          <p className="text-muted-foreground text-sm">Receba alertas antes da hora agendada</p>
                        </div>
                        <Switch id="reminder-time" defaultChecked />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
