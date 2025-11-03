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
    id: 'supino-reto-barra',
    name: 'Supino Reto com Barra',
    description: 'Exercício fundamental para o desenvolvimento do peitoral, ombros e tríceps.',
    muscleGroups: ['chest', 'triceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/bench-press-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Deite-se em um banco reto com os pés firmes no chão.',
      'Segure a barra com uma pegada um pouco mais larga que os ombros.',
      'Desça a barra de forma controlada até tocar o meio do peito.',
      'Empurre a barra para cima até a posição inicial, estendendo os cotovelos.'
    ]
  },
  {
    id: 'supino-inclinado-halteres',
    name: 'Supino Inclinado com Halteres',
    description: 'Foca na porção superior do peitoral (clavicular).',
    muscleGroups: ['chest', 'triceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/incline-dumbbell-bench-press-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Ajuste o banco para um ângulo de 30-45 graus.',
      'Segure um halter em cada mão com os braços estendidos acima do peito.',
      'Desça os halteres de forma controlada até a altura do peito.',
      'Empurre os halteres para cima até a posição inicial.'
    ]
  },
  {
    id: 'voador-maquina',
    name: 'Voador (Pec Deck)',
    description: 'Exercício de isolamento para o peitoral.',
    muscleGroups: ['chest'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/machine-chest-fly/machine-chest-fly-800.avif',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Sente-se na máquina com as costas apoiadas.',
      'Segure os pegadores com os braços estendidos ou semi-flexionados.',
      'Junte os pegadores na frente do corpo de forma controlada.',
      'Retorne à posição inicial lentamente.'
    ]
  },
  {
    id: 'cross-polia-alta',
    name: 'Cross na Polia Alta',
    description: 'Trabalha diferentes porções do peitoral dependendo do ângulo.',
    muscleGroups: ['chest'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/cable-fly/cable-fly-800.avif',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Posicione as polias na parte superior da máquina.',
      'Segure os pegadores e dê um passo à frente.',
      'Puxe os pegadores para baixo e para frente, cruzando as mãos na frente do corpo.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'elevacao-lateral-polia',
    name: 'Elevação Lateral na Polia',
    description: 'Excelente para isolar a cabeça medial do deltoide (ombros).',
    muscleGroups: ['shoulders'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/cable-lateral-raise-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Fique de lado para a polia baixa.',
      'Segure o pegador com a mão oposta à polia.',
      'Levante o braço lateralmente até a altura do ombro.',
      'Desça o braço de forma controlada.'
    ]
  },
  {
    id: 'triceps-pulley',
    name: 'Tríceps Pulley na Polia',
    description: 'Exercício de isolamento para o tríceps.',
    muscleGroups: ['triceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/tricep-pushdown-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Fique de frente para a polia alta com uma barra reta ou em V.',
      'Mantenha os cotovelos próximos ao corpo.',
      'Empurre a barra para baixo até estender completamente os braços.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'triceps-frances-halter',
    name: 'Tríceps Francês com Halter',
    description: 'Trabalha a cabeça longa do tríceps.',
    muscleGroups: ['triceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/lying-tricep-extension-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Deite-se em um banco e segure um halter com as duas mãos acima da cabeça.',
      'Flexione os cotovelos, descendo o halter para trás da cabeça.',
      'Estenda os cotovelos para levantar o halter de volta à posição inicial.'
    ]
  },
  {
    id: 'puxada-alta-frente',
    name: 'Puxada Alta pela Frente',
    description: 'Exercício chave para a largura das costas (latíssimo do dorso).',
    muscleGroups: ['back', 'biceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Sente-se na máquina e ajuste o suporte para os joelhos.',
      'Segure a barra com uma pegada mais larga que os ombros.',
      'Puxe a barra para baixo até a altura do queixo ou peito.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'remada-baixa',
    name: 'Remada Baixa',
    description: 'Trabalha a espessura das costas (trapézio, romboides).',
    muscleGroups: ['back', 'biceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/seated-cable-row-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Sente-se na máquina com os pés apoiados e os joelhos levemente flexionados.',
      'Puxe o pegador em direção ao abdômen, contraindo os músculos das costas.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'puxada-invertida-maquina',
    name: 'Puxada Invertida (Máquina)',
    description: 'Foco nos músculos posteriores do ombro e superior das costas.',
    muscleGroups: ['back', 'shoulders'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/machine-reverse-fly/machine-reverse-fly-800.avif',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Sente-se na máquina de voador invertido com o peito apoiado.',
      'Abra os braços para trás, contraindo a parte de trás dos ombros.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'pulldown-polia',
    name: 'Pull Down na Polia (Braço Reto)',
    description: 'Isolamento do latíssimo do dorso.',
    muscleGroups: ['back'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/straight-arm-pulldown-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Fique de frente para a polia alta com uma barra reta.',
      'Com os braços estendidos, puxe a barra para baixo até a altura das coxas.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'biceps-inclinado-halteres',
    name: 'Bíceps Inclinado com Halteres',
    description: 'Alongamento máximo da cabeça longa do bíceps.',
    muscleGroups: ['biceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/incline-dumbbell-curl-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Sente-se em um banco inclinado (45-60 graus) com um halter em cada mão.',
      'Com os braços estendidos ao lado do corpo, flexione os cotovelos, trazendo os halteres para cima.',
      'Desça os halteres de forma controlada.'
    ]
  },
  {
    id: 'biceps-scott',
    name: 'Bíceps Scott',
    description: 'Isolamento do bíceps, minimizando a ajuda de outros músculos.',
    muscleGroups: ['biceps'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/preacher-curl-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Sente-se no banco Scott, apoiando a parte de trás dos braços no suporte.',
      'Flexione os cotovelos para levantar a barra ou halteres.',
      'Desça o peso de forma controlada até quase estender os braços.'
    ]
  },
  {
    id: 'cadeira-abdutora',
    name: 'Cadeira Abdutora',
    description: 'Fortalece os músculos do glúteo médio e mínimo.',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/hip-abduction/hip-abduction-800.avif',
    defaultSets: 3,
    defaultReps: 15,
    instructions: [
      'Sente-se na máquina e posicione a parte externa das pernas contra as almofadas.',
      'Abra as pernas, empurrando contra a resistência.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'cadeira-adutora',
    name: 'Cadeira Adutora',
    description: 'Fortalece os músculos da parte interna da coxa.',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/hip-adduction/hip-adduction-800.avif',
    defaultSets: 3,
    defaultReps: 15,
    instructions: [
      'Sente-se na máquina e posicione a parte interna das pernas contra as almofadas.',
      'Feche as pernas, apertando contra a resistência.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'leg-press-articulado',
    name: 'Leg Press Articulado',
    description: 'Exercício composto para quadríceps, glúteos e isquiotibiais.',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/single-leg-press/single-leg-press-800.avif',
    defaultSets: 3,
    defaultReps: 15,
    instructions: [
      'Sente-se na máquina com os pés na plataforma na largura dos ombros.',
      'Empurre a plataforma até estender as pernas, sem travar os joelhos.',
      'Desça a plataforma de forma controlada até formar um ângulo de 90 graus nos joelhos.'
    ]
  },
  {
    id: 'passada-halteres',
    name: 'Passada com Halteres',
    description: 'Excelente exercício funcional para pernas e glúteos.',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/dumbbell-lunge-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 15,
    instructions: [
      'Segure um halter em cada mão.',
      'Dê um passo à frente com uma perna e desça o corpo até que ambos os joelhos formem um ângulo de 90 graus.',
      'Impulsione com a perna da frente para retornar à posição inicial e alterne as pernas.'
    ]
  },
  {
    id: 'cadeira-extensora',
    name: 'Cadeira Extensora',
    description: 'Exercício de isolamento para o quadríceps.',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/leg-extension-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Sente-se na máquina com as pernas presas sob a almofada.',
      'Estenda as pernas para levantar o peso até que estejam retas.',
      'Desça o peso de forma controlada.'
    ]
  },
  {
    id: 'mesa-flexora',
    name: 'Mesa Flexora',
    description: 'Exercício de isolamento para os isquiotibiais (posteriores da coxa).',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/lying-leg-curl-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Deite-se de bruços na máquina e prenda os tornozelos sob a almofada.',
      'Flexione os joelhos para puxar a almofada em direção aos glúteos.',
      'Retorne à posição inicial de forma controlada.'
    ]
  },
  {
    id: 'agachamento-livre',
    name: 'Agachamento Livre',
    description: 'O rei dos exercícios para pernas, trabalhando todo o corpo.',
    muscleGroups: ['legs'],
    imageUri: 'https://static.strengthlevel.com/images/illustrations/squat-1000x1000.jpg',
    defaultSets: 3,
    defaultReps: 12,
    instructions: [
      'Posicione a barra sobre os ombros (trapézio).',
      'Mantenha os pés na largura dos ombros e o peito para cima.',
      'Agache como se fosse sentar em uma cadeira, mantendo a coluna reta.',
      'Desça até que as coxas fiquem paralelas ao chão e depois suba.'
    ]
  }
];