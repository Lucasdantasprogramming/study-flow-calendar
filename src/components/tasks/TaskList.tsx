
import { useState } from "react";
import { useTasks } from "@/context/TasksContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Check,
  X,
  Calendar,
  Clock,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NewTaskForm } from "./NewTaskForm";
import { Task } from "@/types";
import { Skeleton } from "../ui/skeleton";

interface TaskListProps {
  selectedDate: Date;
}

export const TaskList = ({ selectedDate }: TaskListProps) => {
  const { tasks, toggleComplete, postponeTask, deleteTask, loading } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all tasks for the selected date
  const tasksForSelectedDate = tasks.filter(
    (task) =>
      format(new Date(task.date), "yyyy-MM-dd") ===
      format(selectedDate, "yyyy-MM-dd")
  );

  // Filter tasks by completion status
  const pendingTasks = tasksForSelectedDate.filter((task) => !task.completed);
  const completedTasks = tasksForSelectedDate.filter((task) => task.completed);

  // Calculate total study time for the day
  const totalStudyTime = tasksForSelectedDate.reduce(
    (total, task) => total + (task.duration || 60),
    0
  );

  // Format hours and minutes
  const hours = Math.floor(totalStudyTime / 60);
  const minutes = totalStudyTime % 60;

  const handleComplete = (taskId: string) => {
    toggleComplete(taskId);
  };

  const handlePostpone = (taskId: string) => {
    postponeTask(taskId);
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  if (loading) {
    return <TaskListSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            Tarefas para {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </h2>
          <p className="text-gray-500 text-sm mt-1 flex items-center">
            <Clock size={16} className="mr-1" />
            Tempo total de estudo:{" "}
            {hours > 0 && `${hours}h`}
            {minutes > 0 && `${minutes}m`}
            {totalStudyTime === 0 && "Nenhum"}
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <NewTaskForm
              initialDate={selectedDate}
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {tasksForSelectedDate.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            Nenhuma tarefa para este dia. Adicione uma nova tarefa para começar.
          </p>
          <DialogTrigger asChild>
            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} className="mr-2" /> Adicionar Tarefa
            </Button>
          </DialogTrigger>
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="flex-1">
              Pendentes ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              Concluídas ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-2 max-h-[350px] overflow-y-auto">
            {pendingTasks.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Nenhuma tarefa pendente para este dia.
              </p>
            ) : (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onPostpone={handlePostpone}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-2 max-h-[350px] overflow-y-auto">
            {completedTasks.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Nenhuma tarefa concluída para este dia.
              </p>
            ) : (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onPostpone={handlePostpone}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onPostpone: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onComplete, onPostpone, onDelete }: TaskItemProps) => {
  return (
    <div
      className={`p-3 border rounded-md ${
        task.completed
          ? "bg-gray-50 border-gray-200"
          : task.priority === "alta"
          ? "border-red-200 bg-red-50"
          : task.priority === "média"
          ? "border-amber-200 bg-amber-50"
          : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-1 min-w-0">
          <div className="pr-2 pt-1">
            <button
              onClick={() => onComplete(task.id)}
              className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                task.completed
                  ? "bg-green-100 border-green-500 text-green-500"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              {task.completed && <Check size={12} />}
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-medium truncate ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-sm text-gray-600 line-clamp-1 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.description}
              </p>
            )}
            {task.postponed && (
              <p className="text-xs text-amber-600 mt-1 italic flex items-center">
                <ArrowRight size={12} className="mr-1" /> Adiado
              </p>
            )}
            {task.duration && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Clock size={12} className="mr-1" /> {Math.floor(task.duration / 60)}h
                {task.duration % 60 > 0 && `${task.duration % 60}m`}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-1 ml-2">
          {!task.completed && (
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onPostpone(task.id)}
              title="Adiar tarefa"
            >
              <Calendar size={14} />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(task.id)}
            title="Excluir tarefa"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const TaskListSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32 mt-1" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="mb-4">
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
};
