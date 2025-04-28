
import { useState } from "react";
import { useSchedule } from "@/context/ScheduleContext";
import { DailyScheduleItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DailySchedule = () => {
  const { 
    scheduleItems, 
    weeklySchedule,
    addScheduleItem, 
    updateScheduleItem, 
    deleteScheduleItem,
    getScheduleForDay
  } = useSchedule();
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<DailyScheduleItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("0");
  
  const daysOfWeek = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Segunda" },
    { value: "2", label: "Terça" },
    { value: "3", label: "Quarta" },
    { value: "4", label: "Quinta" },
    { value: "5", label: "Sexta" },
    { value: "6", label: "Sábado" }
  ];
  
  const currentDayItems = getScheduleForDay(Number(selectedDay));
  
  // Sort schedule items by start time
  const sortedItems = [...currentDayItems].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  const handleAddItem = () => {
    setIsAddingItem(true);
  };
  
  const handleCloseDialog = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const category = formData.get("category") as string;
    const isRecurring = formData.has("isRecurring");
    
    // Obter dias selecionados
    const selectedDays: number[] = [];
    daysOfWeek.forEach(day => {
      if (formData.has(`day-${day.value}`)) {
        selectedDays.push(Number(day.value));
      }
    });
    
    const item = {
      title,
      description,
      startTime,
      endTime,
      category,
      isRecurring,
      dayOfWeek: selectedDays.length > 0 ? selectedDays : [Number(selectedDay)],
    };
    
    if (editingItem) {
      updateScheduleItem(editingItem.id, item);
    } else {
      addScheduleItem(item);
    }
    
    handleCloseDialog();
  };

  // Gerar cores adequadas com base na categoria
  const getCategoryColor = (category: string, isBackground = false) => {
    if (category === "study") {
      return isBackground ? "bg-study-purple/10" : "text-study-purple";
    } else if (category === "break") {
      return isBackground ? "bg-study-blue/10" : "text-study-blue";
    } else {
      return isBackground ? "bg-gray-100" : "text-gray-700";
    }
  };
  
  const getCategoryBorder = (category: string) => {
    if (category === "study") {
      return "border-l-study-purple";
    } else if (category === "break") {
      return "border-l-study-blue";
    } else {
      return "border-l-gray-300";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Cronograma Diário</h2>
          <p className="text-gray-500 text-sm">Organize suas atividades por dia da semana</p>
        </div>
        <Button onClick={handleAddItem} className="flex items-center gap-1">
          <Plus size={16} /> Adicionar Atividade
        </Button>
      </div>
      
      <Tabs value={selectedDay} onValueChange={setSelectedDay} className="mb-6">
        <TabsList className="grid grid-cols-7 w-full">
          {daysOfWeek.map(day => (
            <TabsTrigger key={day.value} value={day.value} className="text-xs sm:text-sm">
              {day.label.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {daysOfWeek.map(day => (
          <TabsContent key={day.value} value={day.value} className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{day.label} • {format(new Date().setDate(new Date().getDate() + (Number(day.value) - new Date().getDay() + 7) % 7), "dd 'de' MMMM", { locale: ptBR })}</h3>
            </div>
            
            {sortedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="mb-2">Nenhuma atividade para {day.label}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddItem}
                  className="mt-2"
                >
                  <Plus size={16} className="mr-2" /> Adicionar Atividade
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={cn(
                      "p-4 flex border-l-4 transition-all hover:shadow-md",
                      getCategoryBorder(item.category)
                    )}
                  >
                    <div className="mr-4 flex flex-col items-center justify-center">
                      <Clock className="text-gray-500" size={18} />
                      <div className="text-sm font-medium mt-1">
                        {item.startTime}<br/>
                        {item.endTime}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={cn(
                          "text-xs py-1 px-2 rounded-full",
                          getCategoryColor(item.category, true),
                          getCategoryColor(item.category)
                        )}>
                          {item.category === "study" ? "Estudo" : "Pausa"}
                        </span>
                        
                        {item.isRecurring && (
                          <span className="text-xs py-1 px-2 rounded-full bg-gray-100 text-gray-700">
                            Recorrente
                          </span>
                        )}
                        
                        {item.dayOfWeek && item.dayOfWeek.length > 1 && (
                          <span className="text-xs py-1 px-2 rounded-full bg-amber-100 text-amber-800">
                            {item.dayOfWeek.length} dias da semana
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteScheduleItem(item.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <Dialog open={isAddingItem || !!editingItem} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Atividade" : "Adicionar Atividade"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora de Início</Label>
                <Input 
                  id="startTime" 
                  name="startTime" 
                  type="time" 
                  defaultValue={editingItem?.startTime || "08:00"} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora de Término</Label>
                <Input 
                  id="endTime" 
                  name="endTime" 
                  type="time" 
                  defaultValue={editingItem?.endTime || "09:30"} 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={editingItem?.title || ""} 
                placeholder="Ex: Matemática" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingItem?.description || ""} 
                placeholder="Detalhes sobre a atividade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" defaultValue={editingItem?.category || "study"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Estudo</SelectItem>
                  <SelectItem value="break">Pausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isRecurring" 
                  name="isRecurring"
                  defaultChecked={editingItem?.isRecurring}
                />
                <Label htmlFor="isRecurring">Atividade recorrente</Label>
              </div>
              <p className="text-sm text-gray-500">
                Atividades recorrentes aparecem nos dias selecionados abaixo
              </p>
            </div>
            
            <fieldset className="border rounded-md p-3">
              <legend className="text-sm font-medium px-2">Dias da Semana</legend>
              <div className="grid grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`day-${day.value}`} 
                      name={`day-${day.value}`}
                      defaultChecked={editingItem?.dayOfWeek?.includes(Number(day.value))}
                    />
                    <Label htmlFor={`day-${day.value}`}>{day.label.slice(0, 3)}</Label>
                  </div>
                ))}
              </div>
            </fieldset>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingItem ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
