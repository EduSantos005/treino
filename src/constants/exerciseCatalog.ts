import { MuscleGroup } from './exerciseCategories';

export type CatalogExercise = {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  imageUri: string;
  defaultSets: number;
  defaultReps: number;
  instructions: string[];
};

export const exerciseCatalog: CatalogExercise[] = [
  {
    id: 'supino-reto',
    name: 'Supino Reto',
    description: 'Exercício básico para desenvolvimento do peitoral',
    muscleGroups: ['chest', 'triceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/bench-press-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Deite no banco com os pés apoiados no chão',
      'Segure a barra com as mãos um pouco mais abertas que a largura dos ombros',
      'Desça a barra controladamente até tocar levemente o peito',
      'Empurre a barra para cima até estender os braços'
    ]
  },
  {
    id: 'puxada-frente',
    name: 'Puxada pela Frente',
    description: 'Exercício para desenvolvimento das costas',
    muscleGroups: ['back', 'biceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Sente-se na máquina com os joelhos fixos',
      'Segure a barra com as mãos mais abertas que os ombros',
      'Puxe a barra até a altura do peito',
      'Retorne controladamente à posição inicial'
    ]
  },
  {
    id: 'agachamento',
    name: 'Agachamento',
    description: 'Exercício fundamental para pernas',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/squat-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Posicione a barra nas costas, apoiada nos trapézios',
      'Pés na largura dos ombros',
      'Desça até as coxas ficarem paralelas ao chão',
      'Suba empurrando através dos calcanhares'
    ]
  }
];