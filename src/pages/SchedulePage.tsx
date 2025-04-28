
import MainLayout from "../components/layouts/MainLayout";
import { DailySchedule } from "../components/schedule/DailySchedule";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

const SchedulePage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <h1 className="text-3xl font-bold mb-6">Cronograma Diário</h1>
        <DailySchedule />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SchedulePage;
