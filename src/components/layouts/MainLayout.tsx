
import { ReactNode } from "react";
import { Sidebar } from "../sidebar/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default MainLayout;
