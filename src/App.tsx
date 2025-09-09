import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Workouts } from '@/pages/Workouts';
import { WeeklyPlan } from '@/pages/WeeklyPlan';
import { Schedule } from '@/pages/Schedule';
import { Diet } from '@/pages/Diet';
import { Progress } from '@/pages/Progress';
import { Settings } from '@/pages/Settings';
import { useSupabaseInit } from '@/hooks/useSupabaseInit';

function App() {
  // Initialize Supabase data (temporariamente desabilitado para evitar duplicação)
  // const { populateSampleData } = useSupabaseInit();
  useSupabaseInit();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="weekly-plan" element={<WeeklyPlan />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="diet" element={<Diet />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
