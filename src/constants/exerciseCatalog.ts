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
    name: 'Voador Peitoral',
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
    name: 'Tríceps Francês',
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
  },
  {
    id: 'stiff',
    name: 'Stiff',
    description: 'Exercício que enfatiza o movimento de dobradiça do quadril com mínima flexão do joelho, focando nos isquiotibiais, glúteos e lombar.',
    muscleGroups: ['legs', 'back'],
    imageUri: 'https://static.strengthlevel.com/images/exercises/stiff-leg-deadlift/stiff-leg-deadlift-800.avif',
    defaultSets: 3,
    defaultReps: 10,
    instructions: [
      'Posição inicial: Fique em pé com os pés na largura dos ombros, barra sobre o meio dos pés. Mantenha uma leve flexão nos joelhos.',
      'Pegada na barra: Incline-se para frente a partir dos quadris, mantendo as costas retas. Segure a barra com uma pegada na largura dos ombros.',
      'Levantamento: Inspire, contraia o core e levante a barra estendendo os quadris e joelhos. Mantenha a barra próxima ao corpo e as costas retas.',
            'Descida: Inverta o movimento, empurrando os quadris para trás e inclinando-se para frente. Mantenha as pernas quase retas e as costas retas. Desça a barra de forma controlada.'
          ]
        },
        {
          id: 'desenvolvimento-halteres',
          name: 'Desenvolvimento com Halteres',
          description: 'Exercício fundamental para o desenvolvimento dos ombros (deltoides).',
          muscleGroups: ['shoulders', 'triceps'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/seated-dumbbell-shoulder-press/seated-dumbbell-shoulder-press-800.avif',
          defaultSets: 3,
          defaultReps: 10,
          instructions: [
            'Sente-se em um banco com as costas retas, segurando um halter em cada mão na altura dos ombros.',
            'Empurre os halteres para cima até que os braços estejam quase totalmente estendidos.',
            'Desça os halteres de forma controlada até a posição inicial.',
            'Mantenha o core contraído durante todo o movimento.'
          ]
        },
        {
          id: 'remada-curvada-barra',
          name: 'Remada Curvada com Barra',
          description: 'Exercício composto para as costas, focando em espessura e força.',
          muscleGroups: ['back', 'biceps'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/bent-over-row/bent-over-row-800.avif',
          defaultSets: 3,
          defaultReps: 10,
          instructions: [
            'Fique em pé com os pés na largura dos ombros e segure a barra com uma pegada pronada.',
            'Incline o tronco para frente, mantendo as costas retas, até ficar quase paralelo ao chão.',
            'Puxe a barra em direção à parte inferior do peito, contraindo as escápulas.',
            'Desça a barra de forma controlada até a posição inicial.'
          ]
        },
        {
          id: 'rosca-martelo',
          name: 'Rosca Martelo',
          description: 'Trabalha o bíceps e o músculo braquial, ajudando na largura do braço.',
          muscleGroups: ['biceps'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/hammer-curl/hammer-curl-800.avif',
          defaultSets: 3,
          defaultReps: 12,
          instructions: [
            'Fique em pé, segurando um halter em cada mão com as palmas voltadas uma para a outra (pegada neutra).',
            'Mantenha os cotovelos parados e próximos ao corpo.',
            'Flexione um cotovelo de cada vez, levantando o halter em direção ao ombro.',
            'Desça o halter de forma controlada e repita com o outro braço.'
          ]
        },
        {
          id: 'elevacao-panturrilha-pe',
          name: 'Elevação de Panturrilha em Pé',
          description: 'Exercício de isolamento para fortalecer os músculos da panturrilha (gastrocnêmio e sóleo).',
          muscleGroups: ['legs'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/seated-calf-raise/seated-calf-raise-800.avif',
          defaultSets: 4,
          defaultReps: 15,
          instructions: [
            'Fique em pé, com os pés apoiados em um degrau ou na máquina específica.',
            'Eleve os calcanhares o máximo possível, contraindo as panturrilhas.',
            'Segure a contração por um momento no topo.',
            'Desça os calcanhares de forma controlada, alongando os músculos.'
          ]
        },
        {
          id: 'abdominal-maquina',
          name: 'Abdominal na Máquina',
          description: 'Exercício de isolamento para o reto abdominal com resistência ajustável.',
          muscleGroups: ['abs'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/decline-sit-up/decline-sit-up-800.avif',
          defaultSets: 3,
          defaultReps: 15,
          instructions: [
            'Sente-se na máquina e ajuste o assento e os pegadores conforme sua altura.',
            'Segure os pegadores ou apoie os braços nas almofadas.',
            'Flexione o tronco para frente, contraindo o abdômen para puxar o peso.',
            'Retorne à posição inicial de forma controlada, sem deixar o peso bater.'
          ]
        },
        {
          id: 'levantamento-terra',
          name: 'Levantamento Terra',
          description: 'Exercício composto que trabalha costas, pernas e glúteos. Considerado um dos três levantamentos básicos.',
          muscleGroups: ['back', 'legs'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/sumo-deadlift/sumo-deadlift-800.avif',
          defaultSets: 3,
          defaultReps: 8,
          instructions: [
            'Posicione a barra no chão, próxima às suas canelas.',
            'Agache com a coluna reta, quadris para trás, e segure a barra com uma pegada mista ou pronada.',
            'Levante a barra mantendo-a próxima ao corpo, estendendo os quadris e joelhos simultaneamente.',
            'Desça a barra de forma controlada, invertendo o movimento.'
          ]
        },
        {
          id: 'elevacao-pelvica',
          name: 'Elevação Pélvica',
          description: 'Excelente exercício para ativação e fortalecimento dos glúteos e isquiotibiais.',
          muscleGroups: ['legs'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/hip-thrust/hip-thrust-800.avif',
          defaultSets: 3,
          defaultReps: 12,
          instructions: [
            'Sente-se no chão com as costas apoiadas em um banco e uma barra sobre o quadril.',
            'Flexione os joelhos e mantenha os pés firmes no chão.',
            'Eleve o quadril até que o corpo forme uma linha reta dos ombros aos joelhos.',
            'Desça o quadril de forma controlada.'
          ]
        },
        {
          id: 'levantamento-terra-sumo',
          name: 'Levantamento Terra Sumô',
          description: 'Variação do levantamento terra com uma postura mais aberta, focando mais nos glúteos e parte interna das coxas.',
          muscleGroups: ['legs', 'back'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/sumo-deadlift/sumo-deadlift-800.avif',
          defaultSets: 3,
          defaultReps: 8,
          instructions: [
            'Posicione-se com os pés bem afastados e as pontas dos pés apontando para fora.',
            'Agache com a coluna reta e segure a barra com uma pegada interna aos joelhos.',
            'Levante a barra estendendo os quadris e joelhos, mantendo o peito erguido.',
            'Desça a barra de forma controlada até o chão.'
          ]
        },
        {
          id: 'agachamento-bulgaro-halteres',
          name: 'Agachamento Búlgaro com Halteres',
          description: 'Exercício unilateral que desafia o equilíbrio e fortalece quadríceps e glúteos.',
          muscleGroups: ['legs'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/dumbbell-bulgarian-split-squat/dumbbell-bulgarian-split-squat-800.avif',
          defaultSets: 3,
          defaultReps: 12,
          instructions: [
            'Segure um halter em cada mão e posicione o peito de um pé em um banco atrás de você.',
            'Agache com a perna da frente até que a coxa fique paralela ao chão.',
            'Mantenha o tronco ereto e o joelho da frente alinhado com o pé.',
            'Suba à posição inicial e repita. Troque de perna após a série.'
          ]
        },
        {
          id: 'elevacao-lateral-halteres',
          name: 'Elevação Lateral com Halteres',
          description: 'Exercício clássico para a porção medial dos ombros, contribuindo para a largura.',
          muscleGroups: ['shoulders'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/dumbbell-lateral-raise/dumbbell-lateral-raise-800.avif',
          defaultSets: 3,
          defaultReps: 12,
          instructions: [
            'Fique em pé, segurando um halter em cada mão ao lado do corpo.',
            'Com os cotovelos levemente flexionados, eleve os braços lateralmente até a altura dos ombros.',
            'Faça uma pequena pausa no topo do movimento.',
            'Desça os halteres de forma controlada.'
          ]
        },
        {
          id: 'abdominal-supra',
          name: 'Abdominal Supra',
          description: 'Exercício básico para a parte superior do reto abdominal.',
          muscleGroups: ['abs'],
          imageUri: 'https://static.strengthlevel.com/images/exercises/crunches/crunches-800.avif',
          defaultSets: 3,
          defaultReps: 20,
          instructions: [
            'Deite-se de costas com os joelhos flexionados e os pés no chão.',
            'Coloque as mãos atrás da cabeça ou cruzadas sobre o peito.',
            'Eleve o tronco em direção aos joelhos, contraindo o abdômen.',
            'Desça de forma controlada sem relaxar completamente antes da próxima repetição.'
          ]
        }
      ];
      