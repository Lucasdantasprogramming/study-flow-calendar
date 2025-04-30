
import { useState, useEffect } from "react";
import { useSchedule } from "@/context/ScheduleContext";
import { DailyScheduleItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const DailySchedule = () => {
  const { getScheduleForDay, weeklySchedule, loading } = useSchedule();
  const [activeTab, setActiveTab] = useState<string>("1"); // Second-feira as default

  const getDayName = (day: number): string => {
    switch (day) {
      case 0: return "Domingo";
      case 1: return "Segunda";
      case 2: return "Terça";
      case 3: return "Quarta";
      case 4: return "Quinta";
      case 5: return "Sexta";
      case 6: return "Sábado";
      default: return "Dia";
    }
  };

  const getTimeBlocks = (startHour: number = 6, endHour: number = 22): string[] => {
    const blocks: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      blocks.push(`${hour.toString().padStart(2, '0')}:00`);
      blocks.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return blocks;
  };

  const getItemPosition = (
    item: DailyScheduleItem,
    timeBlocks: string[]
  ): {
    top: number;
    height: number;
    color: string;
  } => {
    const startTime = item.startTime;
    const endTime = item.endTime;

    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    const timeBlockHeight = 60;
    const minuteHeight = timeBlockHeight / 60;

    const startPosition = (startHour - 6) * 60 + startMinute;
    const endPosition = (endHour - 6) * 60 + endMinute;

    const top = startPosition * minuteHeight;
    const height = (endPosition - startPosition) * minuteHeight;

    const colors: { [key: string]: string } = {
      study: "bg-blue-100 border-blue-300 text-blue-800",
      break: "bg-green-100 border-green-300 text-green-800",
      exercise: "bg-purple-100 border-purple-300 text-purple-800",
      meeting: "bg-amber-100 border-amber-300 text-amber-800",
      default: "bg-gray-100 border-gray-300 text-gray-800",
    };

    return {
      top,
      height,
      color: colors[item.category || "default"] || item.color || colors.default,
    };
  };

  if (loading) {
    return <DailyScheduleSkeleton />;
  }

  return (
    <div>
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="flex w-full mb-6 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
            <TabsTrigger
              key={day}
              value={day.toString()}
              className="flex-1 min-w-[100px]"
            >
              {getDayName(day)}
            </TabsTrigger>
          ))}
        </TabsList>

        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const scheduleForDay = getScheduleForDay(day);
          const timeBlocks = getTimeBlocks();

          return (
            <TabsContent key={day} value={day.toString()} className="relative">
              <Card>
                <CardContent className="pt-6">
                  {scheduleForDay.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Nenhuma atividade programada para {getDayName(day)}.
                      </p>
                      <Button className="mt-4" variant="outline">
                        Adicionar Atividade
                      </Button>
                    </div>
                  ) : (
                    <div className="relative min-h-[800px]">
                      {/* Time blocks */}
                      {timeBlocks.map((time, index) => (
                        <div
                          key={time}
                          className={`absolute w-full border-t border-gray-100 flex ${
                            index % 2 === 0 ? "font-medium" : "text-xs text-gray-400"
                          }`}
                          style={{ top: `${index * 30}px` }}
                        >
                          <div className="w-16 -mt-2.5 text-gray-500">{time}</div>
                        </div>
                      ))}

                      {/* Schedule items */}
                      {scheduleForDay.map((item) => {
                        const position = getItemPosition(item, timeBlocks);
                        return (
                          <div
                            key={item.id}
                            className={`absolute left-20 right-4 rounded-md border p-2 ${position.color}`}
                            style={{
                              top: `${position.top}px`,
                              height: `${position.height}px`,
                              minHeight: "20px",
                            }}
                          >
                            <h4 className="font-medium text-sm truncate">
                              {item.title}
                            </h4>
                            {position.height > 40 && (
                              <p className="text-xs truncate">
                                {item.description}
                              </p>
                            )}
                            {position.height > 60 && (
                              <p className="text-xs font-medium mt-1">
                                {item.startTime} - {item.endTime}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

const DailyScheduleSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-10 w-full mb-6" />
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
