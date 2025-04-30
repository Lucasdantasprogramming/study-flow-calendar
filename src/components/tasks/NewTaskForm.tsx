
import { useState } from "react";
import { useTasks } from "@/context/TasksContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface NewTaskFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialDate?: Date;
}

export const NewTaskForm = ({ onClose, onSuccess, initialDate }: NewTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(initialDate || new Date());
  const [priority, setPriority] = useState<"baixa" | "média" | "alta">("média");
  const [duration, setDuration] = useState(60); // duração em minutos
  
  const { addTask } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask({
      title,
      description,
      date,
      completed: false,
      postponed: false,
      notes: "",
      priority,
      duration,
    });
    
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Matemática - Cálculo Diferencial"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes sobre o conteúdo a ser estudado"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Prioridade</Label>
        <RadioGroup 
          value={priority} 
          onValueChange={(val) => setPriority(val as "baixa" | "média" | "alta")}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="baixa" id="priority-low" />
            <Label htmlFor="priority-low" className="text-green-600">Baixa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="média" id="priority-medium" />
            <Label htmlFor="priority-medium" className="text-amber-600">Média</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alta" id="priority-high" />
            <Label htmlFor="priority-high" className="text-red-600">Alta</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="duration">Duração estimada</Label>
          <span className="text-sm">{Math.floor(duration / 60)}h{duration % 60 > 0 ? ` ${duration % 60}min` : ''}</span>
        </div>
        <Slider
          id="duration"
          min={15}
          max={240}
          step={15}
          value={[duration]}
          onValueChange={([val]) => setDuration(val)}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>15min</span>
          <span>4h</span>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Adicionar</Button>
      </div>
    </form>
  );
};
