
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
import { Plus, Edit, Trash, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const DailySchedule = () => {
  const { scheduleItems, addScheduleItem, updateScheduleItem, deleteScheduleItem } = useSchedule();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<DailyScheduleItem | null>(null);
  
  // Sort schedule items by start time
  const sortedItems = [...scheduleItems].sort((a, b) => {
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
    
    const item = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      category: formData.get("category") as string,
    };
    
    if (editingItem) {
      updateScheduleItem(editingItem.id, item);
    } else {
      addScheduleItem(item);
    }
    
    handleCloseDialog();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cronograma Diário</h2>
        <Button onClick={handleAddItem} className="flex items-center gap-1">
          <Plus size={16} /> Adicionar Atividade
        </Button>
      </div>

      <div className="space-y-4">
        {sortedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma atividade no cronograma. Adicione uma atividade para começar.
          </div>
        ) : (
          sortedItems.map((item) => (
            <Card key={item.id} className={cn(
              "p-4 flex border-l-4",
              item.category === "study" ? "border-l-study-purple" : "border-l-study-blue"
            )}>
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
                <div className="mt-2">
                  <span className={cn(
                    "text-xs py-1 px-2 rounded-full",
                    item.category === "study" 
                      ? "bg-study-purple/10 text-study-purple" 
                      : "bg-study-blue/10 text-study-blue"
                  )}>
                    {item.category === "study" ? "Estudo" : "Pausa"}
                  </span>
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
          ))
        )}
      </div>
      
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
