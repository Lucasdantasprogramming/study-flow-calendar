
import { useState, useEffect } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { useTasks } from "@/context/TasksContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NotesPage = () => {
  const { tasks, updateTaskNotes } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState("");
  
  // Get tasks with notes
  const tasksWithNotes = tasks.filter(task => task.notes && task.notes.trim() !== "");
  
  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.notes && task.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    // Set the first task as selected when the list changes
    if (filteredTasks.length > 0 && !selectedTask) {
      setSelectedTask(filteredTasks[0].id);
      setCurrentNotes(filteredTasks[0].notes);
    }
  }, [filteredTasks, selectedTask]);

  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(taskId);
      setCurrentNotes(task.notes);
    }
  };

  const handleSaveNotes = () => {
    if (selectedTask) {
      updateTaskNotes(selectedTask, currentNotes);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <h1 className="text-3xl font-bold mb-6">Minhas Anotações</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Conteúdos</span>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar..."
                      className="pl-8 w-[180px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
                    <TabsTrigger value="with-notes" className="flex-1">Com Anotações</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    {filteredTasks.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">Nenhum conteúdo encontrado</p>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {filteredTasks.map(task => (
                          <div
                            key={task.id}
                            className={cn(
                              "p-3 rounded-md cursor-pointer border transition-colors",
                              selectedTask === task.id
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted",
                              task.completed && "border-green-200"
                            )}
                            onClick={() => handleTaskSelect(task.id)}
                          >
                            <div className="flex justify-between">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.notes && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {task.description}
                            </p>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(task.date), "d 'de' MMM", { locale: ptBR })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="with-notes" className="mt-4">
                    {tasksWithNotes.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">Nenhuma anotação encontrada</p>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {tasksWithNotes.map(task => (
                          <div
                            key={task.id}
                            className={cn(
                              "p-3 rounded-md cursor-pointer border transition-colors",
                              selectedTask === task.id
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted"
                            )}
                            onClick={() => handleTaskSelect(task.id)}
                          >
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {task.description}
                            </p>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(task.date), "d 'de' MMM", { locale: ptBR })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {selectedTask ? tasks.find(t => t.id === selectedTask)?.title : "Selecione um conteúdo"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTask ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tasks.find(t => t.id === selectedTask)?.description}
                    </p>
                    <div className="mb-4">
                      <Textarea
                        placeholder="Escreva suas anotações aqui..."
                        className="min-h-[300px] resize-none"
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotes} className="flex items-center gap-2">
                        <Check size={16} /> Salvar Anotações
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80">
                    <p className="text-muted-foreground">
                      Selecione um conteúdo para ver ou adicionar anotações
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default NotesPage;
