
import { useState } from "react";
import { format, addMonths, subMonths, isToday, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTasks } from "@/context/TasksContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export const CalendarView = ({ onSelectDate, selectedDate }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tasks } = useTasks();

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={prevMonth} size="icon">
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <Button variant="ghost" onClick={nextMonth} size="icon">
          <ChevronRight size={20} />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    return (
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-sm font-medium text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dateFormatted = format(day, "yyyy-MM-dd");
        const hasTasksForDay = tasks.some(
          task => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted
        );

        days.push(
          <div
            key={dateFormatted}
            className={cn(
              "h-16 border p-1 transition-colors duration-200 cursor-pointer hover:bg-secondary flex flex-col",
              !isSameMonth(day, monthStart) && "text-gray-400 bg-gray-50",
              isSameDay(day, selectedDate) && "border-primary",
              "calendar-grid"
            )}
            onClick={() => onSelectDate(cloneDay)}
          >
            <div
              className={cn(
                "text-right w-full",
                isToday(day) && "today",
                hasTasksForDay && "has-tasks"
              )}
            >
              <span className={cn(
                "text-sm inline-flex h-6 w-6 items-center justify-center rounded-full",
                isToday(day) && "bg-primary text-primary-foreground font-bold"
              )}>
                {format(day, "d")}
              </span>
            </div>
            {hasTasksForDay && (
              <div className="mt-1 text-xs overflow-hidden">
                {tasks
                  .filter(task => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted)
                  .slice(0, 2)
                  .map((task, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "truncate text-left px-1 rounded mb-1",
                        task.completed ? "line-through text-gray-400" : "",
                        task.postponed ? "italic" : ""
                      )}
                    >
                      {task.title}
                    </div>
                  ))}
                {tasks.filter(task => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted).length > 2 && (
                  <div className="text-xs text-center text-gray-500">
                    +{tasks.filter(task => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted).length - 2} mais
                  </div>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="flex-1">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
