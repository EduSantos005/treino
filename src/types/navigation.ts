import { Workout } from '../services/storage';

export type RootStackParamList = {
  Home: undefined;
  AddWorkout: {
    workout?: Workout;
  };
  StartWorkout: {
    workout: Workout;
  };
};