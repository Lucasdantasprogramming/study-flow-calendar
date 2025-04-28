
import { useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { CalendarView } from "../components/calendar/CalendarView";
import { TaskList } from "../components/tasks/TaskList";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <h1 className="text-3xl font-bold mb-6">Calendário de Estudos</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarView 
            onSelectDate={handleDateSelect} 
            selectedDate={selectedDate} 
          />
          <TaskList selectedDate={selectedDate} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Index;
