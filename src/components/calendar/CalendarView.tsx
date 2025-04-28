
import { useState } from "react";
import { format, addMonths, subMonths, isToday, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTasks } from "@/context/TasksContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Calcula o tempo total de estudo para um dia específico
  const calculateStudyTimeForDay = (day: Date): number => {
    const dateFormatted = format(day, "yyyy-MM-dd");
    const tasksForDay = tasks.filter(
      task => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted
    );
    
    // Se temos duração definida, usamos a soma, senão estimamos 60 minutos por tarefa
    return tasksForDay.reduce((total, task) => 
      total + (task.duration || 60), 0);
  };

  // Determina a cor de fundo baseado no número de tarefas e sua prioridade
  const getTasksColor = (day: Date): string => {
    const dateFormatted = format(day, "yyyy-MM-dd");
    const tasksForDay = tasks.filter(
      task => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted
    );
    
    const hasHighPriority = tasksForDay.some(task => task.priority === "alta");
    const hasMediumPriority = tasksForDay.some(task => task.priority === "média");
    
    if (hasHighPriority) return "bg-red-50 hover:bg-red-100";
    if (hasMediumPriority) return "bg-amber-50 hover:bg-amber-100";
    if (tasksForDay.length > 0) return "bg-blue-50 hover:bg-blue-100";
    
    return "";
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
        const studyTimeMinutes = calculateStudyTimeForDay(day);
        const taskColor = getTasksColor(day);

        days.push(
          <div
            key={dateFormatted}
            className={cn(
              "h-20 border p-1 transition-colors duration-200 cursor-pointer hover:bg-secondary flex flex-col",
              !isSameMonth(day, monthStart) && "text-gray-400 bg-gray-50",
              isSameDay(day, selectedDate) && "border-primary border-2",
              taskColor,
              "calendar-grid"
            )}
            onClick={() => onSelectDate(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span className={cn(
                "text-sm inline-flex h-6 w-6 items-center justify-center rounded-full",
                isToday(day) && "bg-primary text-primary-foreground font-bold"
              )}>
                {format(day, "d")}
              </span>
              
              {studyTimeMinutes > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-gray-600">
                        <AlarmClock size={14} className="mr-1" />
                        <span>{Math.floor(studyTimeMinutes / 60)}h{studyTimeMinutes % 60 > 0 ? `${studyTimeMinutes % 60}m` : ''}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tempo de estudo: {Math.floor(studyTimeMinutes / 60)}h{studyTimeMinutes % 60 > 0 ? ` ${studyTimeMinutes % 60}m` : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
                        "truncate text-left px-1 py-0.5 rounded mb-1",
                        task.completed ? "line-through text-gray-400" : "",
                        task.postponed ? "italic" : "",
                        task.priority === "alta" ? "border-l-2 border-red-400 pl-1" : 
                        task.priority === "média" ? "border-l-2 border-amber-400 pl-1" : ""
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
