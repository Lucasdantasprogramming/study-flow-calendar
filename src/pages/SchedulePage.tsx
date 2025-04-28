
import { useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { DailySchedule } from "../components/schedule/DailySchedule";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

const SchedulePage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Cronograma Diário</h1>
          <p className="text-gray-500 mb-6">
            Organize seus estudos e atividades por dia da semana
          </p>
          <DailySchedule />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SchedulePage;
