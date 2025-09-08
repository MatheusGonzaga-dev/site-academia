import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { sampleWorkouts, sampleDietEntry, sampleProgressEntries } from '@/data/sampleData';

export function useSampleData() {
  const { 
    workouts, 
    dietEntries, 
    progressEntries,
    addWorkout, 
    addDietEntry, 
    addProgressEntry 
  } = useAppStore();

  useEffect(() => {
    // Only add sample data if the app is empty
    const hasData = workouts.length > 0 || dietEntries.length > 0 || progressEntries.length > 0;
    
    if (!hasData) {
      // Add sample workouts
      sampleWorkouts.forEach(workout => addWorkout(workout));
      
      // Add sample diet entry
      addDietEntry(sampleDietEntry);
      
      // Add sample progress entries
      sampleProgressEntries.forEach(entry => addProgressEntry(entry));
    }
  }, [workouts.length, dietEntries.length, progressEntries.length, addWorkout, addDietEntry, addProgressEntry]);
}
