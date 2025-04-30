
import { useState, Suspense } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { CalendarView } from "../components/calendar/CalendarView";
import { TaskList } from "../components/tasks/TaskList";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Calendário de Estudos</h1>
          <p className="text-gray-500 mb-6">
            Organize suas tarefas e visualize seu progresso
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<CalendarSkeleton />}>
              <CalendarView 
                onSelectDate={handleDateSelect} 
                selectedDate={selectedDate} 
              />
            </Suspense>
            <Suspense fallback={<TaskListSkeleton />}>
              <TaskList selectedDate={selectedDate} />
            </Suspense>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

const CalendarSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-8 w-full mb-4" />
      <div className="grid grid-cols-7 gap-1">
        {Array(35).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
};

const TaskListSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
};

export default Index;
