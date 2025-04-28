
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { name: "Calendário", path: "/", icon: Calendar },
    { name: "Cronograma", path: "/schedule", icon: Clock },
    { name: "Notas", path: "/notes", icon: BookOpen },
    { name: "Perfil", path: "/profile", icon: User },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar h-screen border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary">StudyFlow</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? ">" : "<"}
        </Button>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  <item.icon
                    className={cn("mr-2", collapsed && "mx-auto")}
                    size={18}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        {!collapsed && <p className="text-xs text-muted-foreground">StudyFlow © 2023</p>}
      </div>
    </div>
  );
};
