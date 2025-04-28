
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTasks } from "@/context/TasksContext";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, Plus, Trash, Edit } from "lucide-react";
import { NewTaskForm } from "./NewTaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TaskListProps {
  selectedDate: Date;
}

export const TaskList = ({ selectedDate }: TaskListProps) => {
  const { tasks, toggleComplete, postponeTask, updateTaskNotes, deleteTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const dateFormatted = format(selectedDate, "yyyy-MM-dd");
  const tasksForSelectedDate = tasks.filter(
    (task) => format(new Date(task.date), "yyyy-MM-dd") === dateFormatted
  );

  const handlePostpone = (taskId: string) => {
    postponeTask(taskId);
  };

  const handleEditNotes = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveNotes = () => {
    if (editingTask) {
      updateTaskNotes(editingTask.id, editingTask.notes);
      setEditingTask(null);
    }
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
  };

  const handleCloseAddTask = () => {
    setIsAddingTask(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Conteúdo para {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
        </h2>
        <Button onClick={handleAddTask} size="sm" className="flex items-center gap-1">
          <Plus size={16} /> Adicionar
        </Button>
      </div>

      {tasksForSelectedDate.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum conteúdo para estudar neste dia.
        </div>
      ) : (
        <div className="space-y-3">
          {tasksForSelectedDate.map((task) => (
            <Card key={task.id} className={cn(
              "p-4 transition-all",
              task.completed ? "border-green-200 bg-green-50" : "",
              task.postponed ? "border-amber-200" : ""
            )}>
              <div className="flex justify-between items-start">
                <div className={cn("flex-1", task.completed ? "line-through text-gray-500" : "")}>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(task.completed ? "bg-green-100" : "")}
                    onClick={() => toggleComplete(task.id)}
                    title={task.completed ? "Desmarcar como concluído" : "Marcar como concluído"}
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePostpone(task.id)}
                    title="Adiar para próxima semana"
                  >
                    <Clock size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditNotes(task)}
                    title="Adicionar anotações"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:bg-destructive/10"
                    title="Excluir"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              {task.notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium">Anotações:</p>
                  <p className="text-sm mt-1 whitespace-pre-line">{task.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for adding new tasks */}
      <Dialog open={isAddingTask} onOpenChange={handleCloseAddTask}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Conteúdo</DialogTitle>
          </DialogHeader>
          <NewTaskForm
            onClose={handleCloseAddTask}
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for editing notes */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Anotações: {editingTask?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              className="min-h-[200px]"
              placeholder="Escreva suas anotações sobre este conteúdo aqui..."
              value={editingTask?.notes || ""}
              onChange={(e) => setEditingTask(editingTask ? { ...editingTask, notes: e.target.value } : null)}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes}>Salvar Anotações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
