import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold text-xl text-primary">StudyFlow</span>
          
          <div className="ml-auto">
            <UserMenu currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </div>
      )}
      
      {/* Sidebar with overlay for mobile */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} 
        transition-transform duration-200 ease-in-out
      `}>
        <Sidebar />
      </div>
      
      {/* Backdrop for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main className={`flex-1 ${isMobile ? 'mt-16' : ''} p-4 md:p-8 overflow-auto`}>
        {!isMobile && (
          <header className="flex justify-end mb-8">
            <UserMenu currentUser={currentUser} onLogout={handleLogout} />
          </header>
        )}
        
        {children}
      </main>
    </div>
  );
};

interface UserMenuProps {
  currentUser: any;
  onLogout: () => void;
}

const UserMenu = ({ currentUser, onLogout }: UserMenuProps) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={currentUser?.photoURL} 
              alt={currentUser?.name || "Avatar"} 
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {currentUser?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link to="/profile" className="flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link to="/profile" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
          {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainLayout;
